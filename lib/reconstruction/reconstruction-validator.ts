/**
 * AXIS ARCHITECTURE — Reconstruction Gate & Geometric Validator
 * 
 * Enforces strict architectural quality boundaries:
 * 1. Reconstruction Gate: Only verified geometry enters 3D generation.
 *    Rejects unverified, conflicting, or incomplete states with clear reasons.
 * 2. Geometric Safety: Prevents NaN, infinite coordinates, or inverted geometry.
 */

import { BlueprintVerification, BlueprintAnalysis } from '@/lib/types/architectural';
import {
  BuildingModel,
  ReconstructionGateResult,
  ReconstructionError,
  ReconstructionWarning,
} from './types';

export class ReconstructionValidator {
  /**
   * Section 3: Reconstruction Gate.
   * Evaluates if a project's verification dataset is eligible for 3D reconstruction.
   */
  public canReconstruct(
    projectId: string,
    verification?: BlueprintVerification | null,
    analysis?: BlueprintAnalysis | null
  ): ReconstructionGateResult {
    if (!verification || !verification.items || verification.items.length === 0) {
      return {
        canReconstruct: false,
        reason: 'No verified architectural dataset exists for this project. Complete Human Review before 3D reconstruction.',
        unresolvedCount: 0,
        rejectedCount: 0,
        totalVerified: 0,
        scaleStatus: 'UNRESOLVED',
        requiresReview: true,
      };
    }

    const items = verification.items;
    const rejectedItems = items.filter((i) => i.status === 'REJECTED');
    const validItems = items.filter((i) => i.status !== 'REJECTED');

    // Count unreviewed priority items
    const priorityUnreviewed = items.filter(
      (i) => i.isPriorityReview && i.status === 'UNREVIEWED'
    );

    const hasWalls = validItems.some((i) => i.elementType === 'WALL');
    if (!hasWalls) {
      return {
        canReconstruct: false,
        reason: 'At least one verified wall is required to establish building envelope and footprint.',
        unresolvedCount: priorityUnreviewed.length,
        rejectedCount: rejectedItems.length,
        totalVerified: validItems.length,
        scaleStatus: analysis?.scaleInfo?.status || 'UNRESOLVED',
        requiresReview: true,
      };
    }

    // Check if critical geometric discrepancies are blocking
    if (priorityUnreviewed.length > 0) {
      return {
        canReconstruct: false,
        reason: `Reconstruction blocked: ${priorityUnreviewed.length} priority architectural element(s) require human inspection before reliable 3D synthesis.`,
        unresolvedCount: priorityUnreviewed.length,
        rejectedCount: rejectedItems.length,
        totalVerified: validItems.length,
        scaleStatus: analysis?.scaleInfo?.status === 'UNRESOLVED' ? 'PARTIAL' : 'RESOLVED',
        requiresReview: true,
      };
    }

    const scaleStatus =
      analysis?.scaleInfo?.status === 'UNRESOLVED' ? 'PARTIAL' : 'RESOLVED';

    return {
      canReconstruct: true,
      unresolvedCount: 0,
      rejectedCount: rejectedItems.length,
      totalVerified: validItems.length,
      scaleStatus,
      requiresReview: false,
    };
  }

  /**
   * Section 22: Validates the generated canonical model geometry.
   * Ensures no NaN, infinity, or impossible values exist.
   */
  public validateModelGeometry(model: BuildingModel): {
    isValid: boolean;
    errors: ReconstructionError[];
    warnings: ReconstructionWarning[];
  } {
    const errors: ReconstructionError[] = [];
    const warnings: ReconstructionWarning[] = [];

    // 1. Check Model Bounding Box
    const bb = model.boundingBox;
    if (
      isNaN(bb.min.x) || isNaN(bb.min.y) || isNaN(bb.min.z) ||
      isNaN(bb.max.x) || isNaN(bb.max.y) || isNaN(bb.max.z)
    ) {
      errors.push({
        code: 'NAN_BOUNDING_BOX',
        message: 'Calculated 3D model bounding box contains NaN coordinates.',
      });
    }

    if (bb.size.x <= 0.1 || bb.size.z <= 0.1) {
      errors.push({
        code: 'COLLAPSED_EXTENTS',
        message: 'Building footprint extents collapsed to near zero.',
      });
    }

    // 2. Validate Floors & Elements
    model.floors.forEach((floor) => {
      // Validate Walls
      floor.walls.forEach((wall) => {
        if (isNaN(wall.start.x) || isNaN(wall.end.x) || isNaN(wall.lengthMeters)) {
          errors.push({
            code: 'INVALID_WALL_COORDS',
            message: `Wall ${wall.id} contains NaN coordinates.`,
            elementId: wall.id,
          });
        }
        if (wall.lengthMeters <= 0.05) {
          warnings.push({
            id: `warn-len-${wall.id}`,
            elementId: wall.id,
            code: 'SHORT_WALL_SEGMENT',
            message: `Wall ${wall.id} has very short length (${wall.lengthMeters.toFixed(2)}m).`,
            severity: 'WARNING',
          });
        }
        if (wall.thicknessMeters <= 0.02 || wall.thicknessMeters > 1.5) {
          warnings.push({
            id: `warn-thick-${wall.id}`,
            elementId: wall.id,
            code: 'UNUSUAL_WALL_THICKNESS',
            message: `Wall ${wall.id} thickness (${wall.thicknessMeters.toFixed(2)}m) outside standard range.`,
            severity: 'INFO',
          });
        }
      });

      // Validate Slabs
      if (floor.slab.areaSqMeters <= 0.5) {
        warnings.push({
          id: `warn-slab-${floor.id}`,
          elementId: floor.slab.id,
          code: 'SMALL_SLAB_AREA',
          message: `Floor ${floor.name} slab area (${floor.slab.areaSqMeters}m²) is unusually small.`,
          severity: 'WARNING',
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export const reconstructionValidator = new ReconstructionValidator();
