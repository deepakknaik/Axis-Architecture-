/**
 * AXIS ARCHITECTURE — 3D Architectural Reconstruction Engine
 * 
 * THE VERIFIED BLUEPRINT IS THE ONLY SOURCE OF GEOMETRIC TRUTH.
 * 
 * Strict Data Boundary:
 * Directly consumes verifiedGeometry from Part 07 BlueprintVerification items.
 * Generates the canonical parametric BuildingModel (1 unit = 1.0 meter).
 */

import {
  BlueprintVerification,
  BlueprintAnalysis,
  WallElement,
  DoorElement,
  WindowElement,
  RoomElement,
  StairElement,
  ColumnElement,
  Project,
  Vector2D,
} from '@/lib/types/architectural';
import {
  BuildingModel,
  BuildingFloor,
  Wall3D,
  FloorSlab3D,
  Door3D,
  Window3D,
  Stair3D,
  Column3D,
  Room3D,
  Point3D,
  ReconstructionResult,
  ReconstructionWarning,
  ReconstructionAssumption,
  WallOpening3D,
} from './types';
import { CoordinateMapper } from './coordinate-mapper';
import {
  computeWallFootprint,
  subdivideWallOpenings,
  computeBoundingBox,
  computePolygonAreaSqMeters,
} from './geometry-utils';
import { reconstructionValidator } from './reconstruction-validator';

export interface ReconstructionInput {
  verification: BlueprintVerification;
  analysis: BlueprintAnalysis;
  project?: Project | null;
  defaultWallHeightMeters?: number;
}

export class ReconstructionEngine {
  /**
   * Primary entry point: Reconstructs a verified building dataset into a 3D building model.
   */
  public reconstruct(input: ReconstructionInput): ReconstructionResult {
    const startTime = Date.now();
    const { verification, analysis, project } = input;

    // 1. Gate Check
    const gate = reconstructionValidator.canReconstruct(
      verification.projectId,
      verification,
      analysis
    );

    if (!gate.canReconstruct) {
      return {
        success: false,
        warnings: [],
        errors: [{ code: 'GATE_REJECTED', message: gate.reason || 'Reconstruction gate rejected.' }],
      };
    }

    const warnings: ReconstructionWarning[] = [];
    const assumptions: ReconstructionAssumption[] = [];

    // 2. Filter verified elements (strictly exclude REJECTED elements)
    const activeItems = verification.items.filter((item) => item.status !== 'REJECTED');

    const verifiedWalls = activeItems
      .filter((i) => i.elementType === 'WALL')
      .map((i) => ({ element: i.verifiedGeometry as WallElement, verRef: i }));

    const verifiedDoors = activeItems
      .filter((i) => i.elementType === 'DOOR')
      .map((i) => ({ element: i.verifiedGeometry as DoorElement, verRef: i }));

    const verifiedWindows = activeItems
      .filter((i) => i.elementType === 'WINDOW')
      .map((i) => ({ element: i.verifiedGeometry as WindowElement, verRef: i }));

    const verifiedRooms = activeItems
      .filter((i) => i.elementType === 'ROOM')
      .map((i) => ({ element: i.verifiedGeometry as RoomElement, verRef: i }));

    const verifiedStairs = activeItems
      .filter((i) => i.elementType === 'STAIR')
      .map((i) => ({ element: i.verifiedGeometry as StairElement, verRef: i }));

    const verifiedColumns = activeItems
      .filter((i) => i.elementType === 'COLUMN')
      .map((i) => ({ element: i.verifiedGeometry as ColumnElement, verRef: i }));

    // 3. Resolve Scale & Plan Center Origin
    const pixelsPerMeter = analysis.scale?.pixelsPerMeter || analysis.scaleInfo?.pixelsPerMeter || 53.6;

    // Find bounding center of wall coordinates to center the 3D model around (0,0,0)
    let minPxX = Infinity, maxPxX = -Infinity, minPxY = Infinity, maxPxY = -Infinity;
    verifiedWalls.forEach(({ element }) => {
      minPxX = Math.min(minPxX, element.startPoint.x, element.endPoint.x);
      maxPxX = Math.max(maxPxX, element.startPoint.x, element.endPoint.x);
      minPxY = Math.min(minPxY, element.startPoint.y, element.endPoint.y);
      maxPxY = Math.max(maxPxY, element.startPoint.y, element.endPoint.y);
    });

    const originPixel: Vector2D = {
      x: (minPxX + maxPxX) / 2,
      y: (minPxY + maxPxY) / 2,
    };

    const mapper = new CoordinateMapper({
      pixelsPerMeter,
      originPixel,
      groundElevationMeters: 0.0,
    });

    // 4. Default Architectural Assumptions
    const defaultWallHeight =
      input.defaultWallHeightMeters || project?.settings?.standardWallHeight || 2.80;

    assumptions.push({
      id: 'asmp-wall-height',
      type: 'WALL_HEIGHT_ASSUMED',
      description: `Vertical wall height assumed at ${defaultWallHeight.toFixed(2)}m based on residential architectural standards.`,
      assumedValue: defaultWallHeight,
      unit: 'meters',
    });

    assumptions.push({
      id: 'asmp-slab-thick',
      type: 'SLAB_THICKNESS_ASSUMED',
      description: 'Ground floor reinforced concrete slab assumed at 0.20m thickness.',
      assumedValue: 0.20,
      unit: 'meters',
    });

    // Check vertical scale discrepancy warning (e.g. Bungalow 11.0m vs 12.0m)
    if (analysis.status === 'NEEDS_REVIEW' || gate.scaleStatus === 'PARTIAL') {
      warnings.push({
        id: 'warn-scale-discrepancy',
        code: 'SCALE_DISCREPANCY',
        message: 'Vertical dimension discrepancy noted between interior bay sum and overall extent. Model extents calibrated to overall perimeter.',
        severity: 'WARNING',
      });
    }

    // 5. Reconstruct 3D Doors & Windows
    const doors3D: Door3D[] = verifiedDoors.map(({ element, verRef }) => {
      const pos3D = mapper.planPixelToWorld3D(
        element.position || (element as any).startPoint || { x: 0, y: 0 },
        0.0
      );
      const width = element.clearWidth || element.width || 0.90;
      const height = element.clearHeight || element.height || 2.10;

      return {
        id: element.id,
        floorId: 'fl-ground',
        wallId: element.hostWallId,
        position: pos3D,
        clearWidthMeters: width,
        clearHeightMeters: height,
        doorType: element.doorType || 'SINGLE_SWING',
        swingDirection: element.swingDirection || 'INWARD',
        rotationY: 0,
        connectedRoomIds: element.connectedRoomIds,
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          verifiedAt: verRef.reviewedAt,
          reviewStatus: verRef.status,
        },
      };
    });

    const windows3D: Window3D[] = verifiedWindows.map(({ element, verRef }) => {
      const sillH = element.sillHeight || 0.90;
      const winW = element.windowWidth || (element as any).width || 1.40;
      const winH = element.windowHeight || (element as any).height || 1.20;
      const pos3D = mapper.planPixelToWorld3D(
        element.position || (element as any).startPoint || { x: 0, y: 0 },
        sillH
      );

      return {
        id: element.id,
        floorId: 'fl-ground',
        wallId: element.hostWallId,
        position: pos3D,
        windowWidthMeters: winW,
        windowHeightMeters: winH,
        sillHeightMeters: sillH,
        windowType: element.windowType || 'CASEMENT',
        rotationY: 0,
        connectedRoomIds: element.connectedRoomIds,
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          reviewStatus: verRef.status,
        },
      };
    });

    // 6. Reconstruct 3D Walls with Opening Subdivisions
    const walls3D: Wall3D[] = verifiedWalls.map(({ element, verRef }) => {
      const start3D = mapper.planPixelToWorld3D(element.startPoint, 0.0);
      const end3D = mapper.planPixelToWorld3D(element.endPoint, 0.0);
      const lengthMeters = Number(
        Math.hypot(end3D.x - start3D.x, end3D.z - start3D.z).toFixed(3)
      );
      const thickness = element.thickness || 0.23;
      const height = element.height || defaultWallHeight;

      const footprint = computeWallFootprint(start3D, end3D, thickness);

      // Collect openings associated with this wall
      const wallOpenings: WallOpening3D[] = [];

      // Associated doors
      doors3D
        .filter((d) => d.wallId === element.id || Math.hypot(d.position.x - (start3D.x + end3D.x)/2, d.position.z - (start3D.z + end3D.z)/2) < 1.0)
        .forEach((d) => {
          // Distance along wall from start
          const offset = Math.max(0.1, (lengthMeters - d.clearWidthMeters) / 2);
          wallOpenings.push({
            id: `op-${d.id}`,
            type: 'DOOR',
            elementId: d.id,
            offsetAlongWallMeters: offset,
            widthMeters: d.clearWidthMeters,
            heightMeters: d.clearHeightMeters,
            sillElevationMeters: 0.0,
          });
        });

      // Associated windows
      windows3D
        .filter((w) => w.wallId === element.id || Math.hypot(w.position.x - (start3D.x + end3D.x)/2, w.position.z - (start3D.z + end3D.z)/2) < 1.2)
        .forEach((w) => {
          const offset = Math.max(0.1, (lengthMeters - w.windowWidthMeters) / 2);
          wallOpenings.push({
            id: `op-${w.id}`,
            type: 'WINDOW',
            elementId: w.id,
            offsetAlongWallMeters: offset,
            widthMeters: w.windowWidthMeters,
            heightMeters: w.windowHeightMeters,
            sillElevationMeters: w.sillHeightMeters,
          });
        });

      const subSegments = subdivideWallOpenings(
        start3D,
        end3D,
        thickness,
        height,
        0.0,
        wallOpenings
      );

      return {
        id: element.id,
        floorId: 'fl-ground',
        start: start3D,
        end: end3D,
        lengthMeters,
        thicknessMeters: thickness,
        heightMeters: height,
        elevationMeters: 0.0,
        classification: element.classification || 'EXTERIOR',
        footprintPolygon: footprint,
        openings: wallOpenings,
        subSegments,
        material: element.classification === 'EXTERIOR' ? 'LIMESTONE_EXTERIOR' : 'PLASTER_INTERIOR',
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          verifiedAt: verRef.reviewedAt,
          reviewStatus: verRef.status,
        },
      };
    });

    // 7. Reconstruct 3D Rooms
    const rooms3D: Room3D[] = verifiedRooms.map(({ element, verRef }) => {
      const boundary3D: Point3D[] = (element.boundaryPolygon || []).map((p) =>
        mapper.planPixelToWorld3D(p, 0.0)
      );

      // Centroid
      const cX = boundary3D.reduce((sum, p) => sum + p.x, 0) / (boundary3D.length || 1);
      const cZ = boundary3D.reduce((sum, p) => sum + p.z, 0) / (boundary3D.length || 1);

      const area = element.calculatedAreaSqMeters || computePolygonAreaSqMeters(boundary3D);
      const dims = element.dimensions || { width: 3.0, length: 3.5, height: 2.8 };

      return {
        id: element.id,
        floorId: 'fl-ground',
        name: element.name,
        roomFunction: element.roomFunction,
        boundaryPolygon: boundary3D,
        centroid: { x: Number(cX.toFixed(3)), y: 0.0, z: Number(cZ.toFixed(3)) },
        areaSqMeters: area,
        dimensions: {
          widthMeters: dims.width,
          depthMeters: dims.length,
          heightMeters: dims.height || defaultWallHeight,
        },
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          reviewStatus: verRef.status,
        },
      };
    });

    // 8. Reconstruct 3D Stairs
    const stairs3D: Stair3D[] = verifiedStairs.map(({ element, verRef }) => {
      const s3D = mapper.planPixelToWorld3D(element.startPoint || { x: 0, y: 0 }, 0.0);
      const e3D = mapper.planPixelToWorld3D(element.endPoint || { x: 0, y: 0 }, 0.0);
      const riserCount = element.riserCount || element.flightCount * 8 || 4;
      const riserH = element.riserHeight || 0.17;
      const treadD = element.treadDepth || 0.28;
      const totalRise = element.totalRise || riserCount * riserH;
      const width = element.stairWidth || element.width || 1.20;

      // Generate step volumes
      const steps = Array.from({ length: riserCount }, (_, idx) => {
        const stepElev = (idx + 1) * riserH;
        return {
          index: idx,
          elevationMeters: stepElev,
          footprint: [
            { x: s3D.x, y: stepElev, z: s3D.z + idx * treadD },
            { x: s3D.x + width, y: stepElev, z: s3D.z + idx * treadD },
            { x: s3D.x + width, y: stepElev, z: s3D.z + (idx + 1) * treadD },
            { x: s3D.x, y: stepElev, z: s3D.z + (idx + 1) * treadD },
          ],
        };
      });

      return {
        id: element.id,
        floorId: 'fl-ground',
        startPoint: s3D,
        endPoint: e3D,
        widthMeters: width,
        riserCount,
        riserHeightMeters: riserH,
        treadDepthMeters: treadD,
        totalRiseMeters: totalRise,
        direction: element.direction || 'UP',
        steps,
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          reviewStatus: verRef.status,
        },
      };
    });

    // 9. Reconstruct 3D Columns
    const columns3D: Column3D[] = verifiedColumns.map(({ element, verRef }) => {
      const pos3D = mapper.planPixelToWorld3D(element.position || { x: 0, y: 0 }, 0.0);
      const w = element.diameterOrWidth || 0.35;
      const d = element.depth || w;
      const h = element.height || defaultWallHeight;
      const halfW = w / 2;
      const halfD = d / 2;

      const footprint: Point3D[] = [
        { x: pos3D.x - halfW, y: 0.0, z: pos3D.z - halfD },
        { x: pos3D.x + halfW, y: 0.0, z: pos3D.z - halfD },
        { x: pos3D.x + halfW, y: 0.0, z: pos3D.z + halfD },
        { x: pos3D.x - halfW, y: 0.0, z: pos3D.z + halfD },
      ];

      return {
        id: element.id,
        floorId: 'fl-ground',
        position: pos3D,
        widthMeters: w,
        depthMeters: d,
        heightMeters: h,
        crossSectionShape: element.crossSectionShape || 'RECTANGULAR',
        structuralMaterial: element.structuralMaterial || 'CONCRETE',
        footprintPolygon: footprint,
        sourceReference: element.sourceReference,
        verificationReference: {
          verificationId: verRef.id,
          reviewStatus: verRef.status,
        },
      };
    });

    // 10. Generate Floor Slab Footprint from Exterior Wall Envelopes
    const exteriorWalls = walls3D.filter((w) => w.classification === 'EXTERIOR');
    const slabFootprintPoints: Point3D[] = [];
    if (exteriorWalls.length > 0) {
      exteriorWalls.forEach((w) => {
        slabFootprintPoints.push(w.start);
        slabFootprintPoints.push(w.end);
      });
    } else {
      rooms3D.forEach((r) => slabFootprintPoints.push(...r.boundaryPolygon));
    }

    const slabBounds = computeBoundingBox(slabFootprintPoints);
    const slabPolygon: Point3D[] = [
      { x: slabBounds.min.x - 0.25, y: -0.20, z: slabBounds.min.z - 0.25 },
      { x: slabBounds.max.x + 0.25, y: -0.20, z: slabBounds.min.z - 0.25 },
      { x: slabBounds.max.x + 0.25, y: -0.20, z: slabBounds.max.z + 0.25 },
      { x: slabBounds.min.x - 0.25, y: -0.20, z: slabBounds.max.z + 0.25 },
    ];

    const slabArea = Number((slabBounds.size.x * slabBounds.size.z).toFixed(2));
    const floorSlab: FloorSlab3D = {
      id: 'slab-ground',
      floorId: 'fl-ground',
      elevationMeters: -0.20,
      thicknessMeters: 0.20,
      footprintPolygon: slabPolygon,
      areaSqMeters: slabArea,
      material: 'CONCRETE_SLAB',
    };

    // 11. Multi-Floor Foundation Assembly
    const groundFloor: BuildingFloor = {
      id: 'fl-ground',
      name: 'Ground Floor (Level 01)',
      levelType: 'GROUND',
      floorIndex: 0,
      elevationMeters: 0.0,
      heightMeters: defaultWallHeight,
      slab: floorSlab,
      walls: walls3D,
      doors: doors3D,
      windows: windows3D,
      stairs: stairs3D,
      columns: columns3D,
      rooms: rooms3D,
    };

    // Compute complete 3D model bounding box
    const allWorldPoints: Point3D[] = [];
    walls3D.forEach((w) => {
      allWorldPoints.push(w.start, w.end, { ...w.start, y: w.heightMeters });
    });
    columns3D.forEach((c) => {
      allWorldPoints.push(c.position, { ...c.position, y: c.heightMeters });
    });
    allWorldPoints.push(...slabPolygon);

    const modelBounds = computeBoundingBox(allWorldPoints);

    const totalElementsCount =
      walls3D.length +
      doors3D.length +
      windows3D.length +
      rooms3D.length +
      stairs3D.length +
      columns3D.length +
      1; // Slab

    const duration = Date.now() - startTime;

    const buildingModel: BuildingModel = {
      id: `bm-${verification.blueprintId || 'session'}`,
      name: project?.title || 'Verified Architectural Model',
      projectId: verification.projectId,
      sourceBlueprintId: verification.blueprintId,
      sourceHash: project?.blueprints?.[0]?.sourceChecksum || 'sha256-verified-boundary',
      status: assumptions.length > 0 ? 'READY_WITH_ASSUMPTIONS' : 'READY',
      units: 'METRIC',
      metricUnitRatio: 1.0,
      dimensions: {
        widthMeters: Number(modelBounds.size.x.toFixed(2)),
        depthMeters: Number(modelBounds.size.z.toFixed(2)),
        heightMeters: Number(modelBounds.size.y.toFixed(2)),
        grossAreaSqMeters: slabArea,
      },
      boundingBox: modelBounds,
      floors: [groundFloor],
      activeFloorIndex: 0,
      assumptions,
      warnings,
      metadata: {
        modelId: `bm-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        sourceBlueprintId: verification.blueprintId,
        sourceHash: project?.blueprints?.[0]?.sourceChecksum || 'sha256-digest',
        scaleStatus: gate.scaleStatus === 'UNRESOLVED' ? 'ASSUMED' : gate.scaleStatus,
        drawingScale: analysis.scaleInfo?.drawingScale || '1:50',
        pixelsPerMeter,
        totalElementCount: totalElementsCount,
        elementsByType: {
          WALL: walls3D.length,
          DOOR: doors3D.length,
          WINDOW: windows3D.length,
          ROOM: rooms3D.length,
          STAIR: stairs3D.length,
          COLUMN: columns3D.length,
          SLAB: 1,
        },
        assumptionCount: assumptions.length,
        warningCount: warnings.length,
        reconstructionDurationMs: duration,
      },
    };

    // 12. Validate Model Geometry
    const validation = reconstructionValidator.validateModelGeometry(buildingModel);
    if (!validation.isValid) {
      return {
        success: false,
        warnings: [...warnings, ...validation.warnings],
        errors: validation.errors,
      };
    }

    return {
      success: true,
      model: buildingModel,
      warnings: [...warnings, ...validation.warnings],
      errors: [],
      metadata: buildingModel.metadata,
    };
  }
}

export const reconstructionEngine = new ReconstructionEngine();

export function reconstructBuilding(input: ReconstructionInput): ReconstructionResult {
  return reconstructionEngine.reconstruct(input);
}
