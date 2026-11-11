/**
 * AXIS ARCHITECTURE — Detection Verification & Human-in-the-Loop Review Engine
 * 
 * Provides an isolated quality-control domain layer for validating architectural detections.
 * Strictly separates original detections from verified geometry, ensuring complete source immutability.
 * 
 * ARCHITECTURAL DATA FLOW:
 * Source Blueprint (Immutable Binary)
 *   ↓
 * Analysis Result (Raw Prototype Detections)
 *   ↓
 * Blueprint Verification (Human Confirmed, Edited, Rejected Primitives)
 *   ↓
 * Validated Architectural Building Model (Future Part 08 Reconstruction)
 */

import {
  ArchitecturalElement,
  ArchitecturalElementType,
  WallElement,
  DoorElement,
  WindowElement,
  RoomElement,
  StairElement,
  ColumnElement,
  VerificationItem,
  VerificationStatus,
  VerificationHistoryEntry,
  BlueprintVerification,
  VerificationProgress,
  CategoryReviewProgress,
  BlueprintAnalysis,
} from '@/lib/types/architectural';

export class VerificationEngine {
  /**
   * Initializes a BlueprintVerification state from analysis detections.
   * If existing items are supplied (e.g. from localStorage), merges them seamlessly.
   */
  initializeVerification(
    analysis: BlueprintAnalysis,
    projectId: string,
    existingVerification?: BlueprintVerification | null
  ): BlueprintVerification {
    // Validate existing verification against current analysis detection contract
    // Discard any stale prototype cache if element counts or schema do not match
    if (
      existingVerification &&
      existingVerification.blueprintId === analysis.blueprintId &&
      existingVerification.items.length > 0 &&
      existingVerification.items.length === analysis.detections.elements.length &&
      !existingVerification.items.some((i) => i.elementId.startsWith('W-001') && analysis.walls[0]?.id !== 'W-001')
    ) {
      return existingVerification;
    }

    const allDetections = analysis.detections.elements;

    // Create a verification record for every detected architectural primitive
    const items: VerificationItem[] = allDetections.map((elem) => {
      const isFlagged = elem.status === 'FLAGGED' || !!elem.metadata?.uncertaintyReason;
      const uncertaintyReason =
        (elem.metadata?.uncertaintyReason as string) ||
        (isFlagged ? 'Dimensional variance detected. Review required before building model synthesis.' : 'Standard detection consistency audit.');

      return {
        id: `ver-${elem.id.toLowerCase()}`,
        elementId: elem.id,
        elementType: elem.type,
        status: 'UNREVIEWED',
        originalDetection: JSON.parse(JSON.stringify(elem)),
        verifiedGeometry: JSON.parse(JSON.stringify(elem)),
        reviewReason: uncertaintyReason,
        isPriorityReview: isFlagged,
        confidenceLabel: isFlagged ? 'REVIEW_REQUIRED' : 'HIGH_CONSISTENCY',
        confidenceScore: elem.confidence,
        confidence: elem.confidence,
        priority: isFlagged ? 'HIGH' : 'LOW',
        issueDescription: uncertaintyReason,
        resolved: false,
      };
    });

    // Sort priority items first
    items.sort((a, b) => {
      if (a.isPriorityReview && !b.isPriorityReview) return -1;
      if (!a.isPriorityReview && b.isPriorityReview) return 1;
      return a.elementId.localeCompare(b.elementId);
    });

    return {
      id: `bv-${analysis.blueprintId || 'session'}`,
      blueprintId: analysis.blueprintId,
      projectId,
      status: 'UNVERIFIED',
      items,
      history: [],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Helper to format current local time as HH:MM
   */
  private formatTimestamp(date: Date = new Date()): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  /**
   * Confirms a detection as valid.
   * Original detection is strictly preserved; verifiedGeometry is accepted.
   */
  confirmDetection(
    verification: BlueprintVerification,
    elementId: string,
    reviewedBy: string = 'Architectural Reviewer'
  ): BlueprintVerification {
    const now = new Date();
    const formatted = this.formatTimestamp(now);

    let prevStatus: VerificationStatus = 'UNREVIEWED';
    let targetType: ArchitecturalElementType = 'WALL';

    const updatedItems = verification.items.map((item) => {
      if (item.elementId === elementId) {
        prevStatus = item.status;
        targetType = item.elementType;
        return {
          ...item,
          status: 'CONFIRMED' as VerificationStatus,
          verifiedGeometry: JSON.parse(JSON.stringify(item.originalDetection)),
          reviewedAt: now.toISOString(),
          reviewedBy,
          resolved: true,
        };
      }
      return item;
    });

    const historyEntry: VerificationHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      elementId,
      elementType: targetType,
      previousStatus: prevStatus,
      newStatus: 'CONFIRMED',
      timestamp: now.toISOString(),
      formattedTime: formatted,
      note: 'Confirmed detection as architecturally valid.',
    };

    const newHistory = [historyEntry, ...verification.history];
    const progress = this.calculateProgress(updatedItems);

    return {
      ...verification,
      items: updatedItems,
      history: newHistory,
      status: progress.isComplete ? 'VERIFIED' : 'REVIEW_IN_PROGRESS',
      updatedAt: now.toISOString(),
    };
  }

  /**
   * Confirms all remaining UNREVIEWED detections at once.
   * Preserves existing EDITED or REJECTED statuses and updates history.
   */
  confirmAllDetections(
    verification: BlueprintVerification,
    reviewedBy: string = 'Architectural Reviewer'
  ): BlueprintVerification {
    const now = new Date();
    const formatted = this.formatTimestamp(now);

    let countConfirmed = 0;
    const updatedItems = verification.items.map((item) => {
      if (item.status === 'UNREVIEWED') {
        countConfirmed++;
        return {
          ...item,
          status: 'CONFIRMED' as VerificationStatus,
          verifiedGeometry: JSON.parse(JSON.stringify(item.originalDetection)),
          reviewedAt: now.toISOString(),
          reviewedBy,
          resolved: true,
          notes: 'Batch confirmed via Verify All at once.',
        };
      }
      return item;
    });

    const historyEntry: VerificationHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      elementId: 'ALL_ELEMENTS',
      elementType: 'WALL',
      previousStatus: 'UNREVIEWED',
      newStatus: 'CONFIRMED',
      timestamp: now.toISOString(),
      formattedTime: formatted,
      note: `Batch verified ${countConfirmed} unreviewed architectural detections at once.`,
    };

    const newHistory = [historyEntry, ...verification.history];
    const progress = this.calculateProgress(updatedItems);

    return {
      ...verification,
      items: updatedItems,
      history: newHistory,
      status: progress.isComplete ? 'VERIFIED' : 'REVIEW_IN_PROGRESS',
      updatedAt: now.toISOString(),
    };
  }

  /**
   * Modifies the geometry of a detection.
   * Validates geometric parameters. Original detection remains unchanged.
   */
  editDetection(
    verification: BlueprintVerification,
    elementId: string,
    updatedGeometry: ArchitecturalElement,
    changesSummary?: string,
    reviewedBy: string = 'Architectural Reviewer'
  ): { success: boolean; verification: BlueprintVerification; error?: string } {
    // 1. Strict Geometric Safety Validation (Section 56 & 57)
    const validation = this.validateGeometry(updatedGeometry);
    if (!validation.valid) {
      return { success: false, verification, error: validation.error };
    }

    const now = new Date();
    const formatted = this.formatTimestamp(now);

    let prevStatus: VerificationStatus = 'UNREVIEWED';
    let targetType: ArchitecturalElementType = updatedGeometry.type;

    const updatedItems = verification.items.map((item) => {
      if (item.elementId === elementId) {
        prevStatus = item.status;
        targetType = item.elementType;
        return {
          ...item,
          status: 'EDITED' as VerificationStatus,
          verifiedGeometry: JSON.parse(JSON.stringify(updatedGeometry)),
          reviewedAt: now.toISOString(),
          reviewedBy,
          resolved: true,
        };
      }
      return item;
    });

    const historyEntry: VerificationHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      elementId,
      elementType: targetType,
      previousStatus: prevStatus,
      newStatus: 'EDITED',
      timestamp: now.toISOString(),
      formattedTime: formatted,
      note: changesSummary || 'Geometry adjusted to match architectural specifications.',
      changesSummary,
    };

    const newHistory = [historyEntry, ...verification.history];
    const progress = this.calculateProgress(updatedItems);

    return {
      success: true,
      verification: {
        ...verification,
        items: updatedItems,
        history: newHistory,
        status: progress.isComplete ? 'VERIFIED' : 'REVIEW_IN_PROGRESS',
        updatedAt: now.toISOString(),
      },
    };
  }

  /**
   * Rejects a detection.
   * The element is omitted from the downstream validated building model,
   * but remains preserved in audit records and optional visual reference.
   */
  rejectDetection(
    verification: BlueprintVerification,
    elementId: string,
    reason: string = 'Rejected by reviewer',
    reviewedBy: string = 'Architectural Reviewer'
  ): BlueprintVerification {
    const now = new Date();
    const formatted = this.formatTimestamp(now);

    let prevStatus: VerificationStatus = 'UNREVIEWED';
    let targetType: ArchitecturalElementType = 'WALL';

    const updatedItems = verification.items.map((item) => {
      if (item.elementId === elementId) {
        prevStatus = item.status;
        targetType = item.elementType;
        return {
          ...item,
          status: 'REJECTED' as VerificationStatus,
          reviewedAt: now.toISOString(),
          reviewedBy,
          resolved: true,
        };
      }
      return item;
    });

    const historyEntry: VerificationHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      elementId,
      elementType: targetType,
      previousStatus: prevStatus,
      newStatus: 'REJECTED',
      timestamp: now.toISOString(),
      formattedTime: formatted,
      note: reason,
    };

    const newHistory = [historyEntry, ...verification.history];
    const progress = this.calculateProgress(updatedItems);

    return {
      ...verification,
      items: updatedItems,
      history: newHistory,
      status: progress.isComplete ? 'VERIFIED' : 'REVIEW_IN_PROGRESS',
      updatedAt: now.toISOString(),
    };
  }

  /**
   * Geometry Safety Rules (Section 56 & 57)
   */
  validateGeometry(element: ArchitecturalElement): { valid: boolean; error?: string } {
    if (!element) {
      return { valid: false, error: 'Element payload is undefined.' };
    }

    // Check for NaN or Infinity in common dimensions
    const checkNumber = (n: unknown, name: string) => {
      if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) {
        return `${name} contains an invalid numeric value (NaN or Infinity).`;
      }
      return null;
    };

    if (element.dimensions) {
      const errW = checkNumber(element.dimensions.width, 'Width');
      if (errW) return { valid: false, error: errW };
      const errL = checkNumber(element.dimensions.length, 'Length');
      if (errL) return { valid: false, error: errL };
      const errH = checkNumber(element.dimensions.height, 'Height');
      if (errH) return { valid: false, error: errH };
      if (element.dimensions.width <= 0 || element.dimensions.length <= 0 || element.dimensions.height <= 0) {
        return { valid: false, error: 'Element dimensions must be strictly positive non-zero numbers.' };
      }
    }

    switch (element.type) {
      case 'WALL': {
        const wall = element as WallElement;
        const errX1 = checkNumber(wall.startPoint?.x, 'Start point X');
        if (errX1) return { valid: false, error: errX1 };
        const errY1 = checkNumber(wall.startPoint?.y, 'Start point Y');
        if (errY1) return { valid: false, error: errY1 };
        const errX2 = checkNumber(wall.endPoint?.x, 'End point X');
        if (errX2) return { valid: false, error: errX2 };
        const errY2 = checkNumber(wall.endPoint?.y, 'End point Y');
        if (errY2) return { valid: false, error: errY2 };

        const dx = wall.endPoint.x - wall.startPoint.x;
        const dy = wall.endPoint.y - wall.startPoint.y;
        const lengthPx = Math.sqrt(dx * dx + dy * dy);

        if (lengthPx < 5) {
          return { valid: false, error: 'Wall length is too short (minimum 0.05m required).' };
        }
        if (wall.thickness <= 0.02 || wall.thickness > 1.5) {
          return { valid: false, error: 'Wall thickness must be between 0.02m and 1.50m.' };
        }
        break;
      }

      case 'DOOR': {
        const door = element as DoorElement;
        if (door.clearWidth < 0.4 || door.clearWidth > 4.0) {
          return { valid: false, error: 'Door clear width must be between 0.40m and 4.00m.' };
        }
        if (door.clearHeight < 1.0 || door.clearHeight > 3.5) {
          return { valid: false, error: 'Door clear height must be between 1.00m and 3.50m.' };
        }
        const validSwings = ['LEFT', 'RIGHT', 'INWARD', 'OUTWARD'];
        if (door.swingDirection && !validSwings.includes(door.swingDirection)) {
          return { valid: false, error: `Invalid swing direction: ${door.swingDirection}` };
        }
        break;
      }

      case 'WINDOW': {
        const win = element as WindowElement;
        if (win.windowWidth < 0.3 || win.windowWidth > 8.0) {
          return { valid: false, error: 'Window width must be between 0.30m and 8.00m.' };
        }
        if (win.sillHeight < 0 || win.sillHeight > 3.0) {
          return { valid: false, error: 'Window sill height must be between 0.00m and 3.00m.' };
        }
        if (win.windowHeight < 0.2 || win.windowHeight > 3.5) {
          return { valid: false, error: 'Window height must be between 0.20m and 3.50m.' };
        }
        break;
      }

      case 'ROOM': {
        const room = element as RoomElement;
        if (!room.boundaryPolygon || room.boundaryPolygon.length < 3) {
          return { valid: false, error: 'Room boundary must form a closed polygon with at least 3 vertices.' };
        }
        if (!room.name || room.name.trim().length === 0) {
          return { valid: false, error: 'Room name cannot be empty.' };
        }
        if (room.calculatedAreaSqMeters <= 0.1) {
          return { valid: false, error: 'Room calculated area must be greater than 0.10 m².' };
        }
        break;
      }

      case 'STAIR': {
        const stair = element as StairElement;
        if (stair.flightCount <= 0 || stair.flightCount > 60) {
          return { valid: false, error: 'Stair flight must have between 1 and 60 risers.' };
        }
        if (stair.treadDepth < 0.15 || stair.treadDepth > 0.6) {
          return { valid: false, error: 'Stair tread depth must be between 0.15m and 0.60m.' };
        }
        if (stair.riserHeight < 0.05 || stair.riserHeight > 0.3) {
          return { valid: false, error: 'Stair riser height must be between 0.05m and 0.30m.' };
        }
        break;
      }

      case 'COLUMN': {
        const col = element as ColumnElement;
        if (col.diameterOrWidth < 0.1 || col.diameterOrWidth > 2.0) {
          return { valid: false, error: 'Column width must be between 0.10m and 2.00m.' };
        }
        if (col.depth && (col.depth < 0.1 || col.depth > 2.0)) {
          return { valid: false, error: 'Column depth must be between 0.10m and 2.00m.' };
        }
        break;
      }
    }

    return { valid: true };
  }

  /**
   * Retrieves the next unreviewed item.
   * Priority items with `isPriorityReview` are reviewed first.
   */
  getNextUnreviewed(
    verification: BlueprintVerification,
    currentElementId?: string
  ): VerificationItem | null {
    const unreviewed = verification.items.filter((item) => item.status === 'UNREVIEWED');
    if (unreviewed.length === 0) return null;

    if (!currentElementId) {
      return unreviewed[0];
    }

    // Try finding the next unreviewed item after the current one
    const currentIndex = unreviewed.findIndex((item) => item.elementId === currentElementId);
    if (currentIndex !== -1 && currentIndex + 1 < unreviewed.length) {
      return unreviewed[currentIndex + 1];
    }

    // If reached end, return the first unreviewed
    return unreviewed[0];
  }

  /**
   * Retrieves the previous item in the queue.
   */
  getPreviousItem(
    verification: BlueprintVerification,
    currentElementId?: string
  ): VerificationItem | null {
    if (!currentElementId || verification.items.length === 0) return null;
    const currentIndex = verification.items.findIndex((item) => item.elementId === currentElementId);
    if (currentIndex > 0) {
      return verification.items[currentIndex - 1];
    }
    return null;
  }

  /**
   * Calculates real-time progress telemetry and category breakdowns.
   */
  calculateProgress(items: VerificationItem[]): VerificationProgress {
    const totalDetections = items.length;
    let reviewedCount = 0;
    let confirmedCount = 0;
    let editedCount = 0;
    let rejectedCount = 0;

    const categoryMap: Record<ArchitecturalElementType, CategoryReviewProgress> = {
      WALL: { type: 'WALL', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
      DOOR: { type: 'DOOR', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
      WINDOW: { type: 'WINDOW', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
      ROOM: { type: 'ROOM', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
      STAIR: { type: 'STAIR', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
      COLUMN: { type: 'COLUMN', total: 0, reviewed: 0, confirmed: 0, edited: 0, rejected: 0 },
    };

    for (const item of items) {
      const cat = categoryMap[item.elementType];
      if (cat) {
        cat.total++;
      }

      if (item.status === 'CONFIRMED') {
        reviewedCount++;
        confirmedCount++;
        if (cat) {
          cat.reviewed++;
          cat.confirmed++;
        }
      } else if (item.status === 'EDITED') {
        reviewedCount++;
        editedCount++;
        if (cat) {
          cat.reviewed++;
          cat.edited++;
        }
      } else if (item.status === 'REJECTED') {
        reviewedCount++;
        rejectedCount++;
        if (cat) {
          cat.reviewed++;
          cat.rejected++;
        }
      }
    }

    const remainingCount = totalDetections - reviewedCount;
    const isComplete = totalDetections > 0 && remainingCount === 0;

    return {
      totalDetections,
      reviewedCount,
      confirmedCount,
      editedCount,
      rejectedCount,
      remainingCount,
      isComplete,
      categories: categoryMap,
    };
  }

  getVerificationProgress(verification: BlueprintVerification): VerificationProgress {
    return this.calculateProgress(verification.items);
  }
}

export const verificationEngine = new VerificationEngine();
