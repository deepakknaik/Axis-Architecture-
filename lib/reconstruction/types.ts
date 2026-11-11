/**
 * AXIS ARCHITECTURE — Canonical 3D Building Model Types
 * 
 * THE VERIFIED BLUEPRINT IS THE ONLY SOURCE OF GEOMETRIC TRUTH.
 * 
 * Strict Data Boundary:
 * Part 08 reconstructs ONLY verified geometry (verifiedGeometry) from Part 07.
 * Metric Contract: 1 canonical unit = 1.0 meter.
 * Coordinate Contract: X = width (East), Y = elevation (Up, Y=0 ground), Z = depth (South).
 */

import {
  ArchitecturalElementType,
  WallClassification,
  DoorType,
  WindowType,
  RoomFunction,
  Vector2D,
  SourceReference,
} from '@/lib/types/architectural';

export interface Point3D {
  x: number;
  y: number; // Elevation (meters)
  z: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface BoundingBox3D {
  min: Point3D;
  max: Point3D;
  center: Point3D;
  size: Vector3D;
}

export type ReconstructionAssumptionType =
  | 'WALL_HEIGHT_ASSUMED'
  | 'WINDOW_SILL_HEIGHT_ASSUMED'
  | 'FLOOR_ELEVATION_ASSUMED'
  | 'STAIR_TREAD_RISE_ASSUMED'
  | 'SLAB_THICKNESS_ASSUMED'
  | 'SCALE_INTERPOLATED';

export interface ReconstructionAssumption {
  id: string;
  elementId?: string;
  type: ReconstructionAssumptionType;
  description: string;
  assumedValue: string | number;
  unit: string;
}

export interface ReconstructionWarning {
  id: string;
  elementId?: string;
  code: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface ReconstructionError {
  code: string;
  message: string;
  elementId?: string;
}

export type FloorLevelType =
  | 'BASEMENT'
  | 'GROUND'
  | 'FIRST'
  | 'SECOND'
  | 'THIRD'
  | 'TERRACE'
  | 'ROOF';

// -----------------------------------------------------------------------------
// Parametric 3D Elements
// -----------------------------------------------------------------------------

export interface WallOpening3D {
  id: string;
  type: 'DOOR' | 'WINDOW';
  elementId: string;
  offsetAlongWallMeters: number;
  widthMeters: number;
  heightMeters: number;
  sillElevationMeters: number;
}

export interface WallSubSegment3D {
  id: string;
  start: Point3D;
  end: Point3D;
  thickness: number;
  height: number;
  elevation: number;
  isHeader?: boolean;
  isSill?: boolean;
}

export interface Wall3D {
  id: string;
  floorId: string;
  start: Point3D; // 3D world position
  end: Point3D;   // 3D world position
  lengthMeters: number;
  thicknessMeters: number;
  heightMeters: number;
  elevationMeters: number;
  classification: WallClassification;
  footprintPolygon: Point3D[]; // 4 corner vertices in 3D world (Y = elevation)
  openings: WallOpening3D[];
  subSegments: WallSubSegment3D[]; // Subdivided watertight segments avoiding openings
  material: string;
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    verifiedAt?: string;
    reviewStatus: string;
  };
}

export interface FloorSlab3D {
  id: string;
  floorId: string;
  elevationMeters: number;
  thicknessMeters: number;
  footprintPolygon: Point3D[];
  areaSqMeters: number;
  material: string;
  sourceReference?: SourceReference;
}

export interface Door3D {
  id: string;
  floorId: string;
  wallId?: string;
  position: Point3D; // Center threshold in 3D world
  clearWidthMeters: number;
  clearHeightMeters: number;
  doorType: DoorType;
  swingDirection?: string;
  rotationY: number; // Radians
  connectedRoomIds?: string[];
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    reviewStatus: string;
  };
}

export interface Window3D {
  id: string;
  floorId: string;
  wallId?: string;
  position: Point3D; // Center sill in 3D world
  windowWidthMeters: number;
  windowHeightMeters: number;
  sillHeightMeters: number;
  windowType: WindowType;
  rotationY: number; // Radians
  connectedRoomIds?: string[];
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    reviewStatus: string;
  };
}

export interface StairStep3D {
  index: number;
  elevationMeters: number;
  footprint: Point3D[];
}

export interface Stair3D {
  id: string;
  floorId: string;
  startPoint: Point3D;
  endPoint: Point3D;
  widthMeters: number;
  riserCount: number;
  riserHeightMeters: number;
  treadDepthMeters: number;
  totalRiseMeters: number;
  direction: 'UP' | 'DOWN';
  steps: StairStep3D[];
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    reviewStatus: string;
  };
}

export interface Column3D {
  id: string;
  floorId: string;
  position: Point3D; // Footprint center at floor elevation
  widthMeters: number;
  depthMeters: number;
  heightMeters: number;
  crossSectionShape: 'RECTANGULAR' | 'CIRCULAR' | 'COMPOSITE';
  structuralMaterial: string;
  footprintPolygon: Point3D[];
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    reviewStatus: string;
  };
}

export interface Room3D {
  id: string;
  floorId: string;
  name: string;
  roomFunction: RoomFunction;
  boundaryPolygon: Point3D[];
  centroid: Point3D;
  areaSqMeters: number;
  dimensions: {
    widthMeters: number;
    depthMeters: number;
    heightMeters: number;
  };
  sourceReference?: SourceReference;
  verificationReference: {
    verificationId: string;
    reviewStatus: string;
  };
}

// -----------------------------------------------------------------------------
// Floor Hierarchy
// -----------------------------------------------------------------------------

export interface BuildingFloor {
  id: string;
  name: string;
  levelType: FloorLevelType;
  floorIndex: number;
  elevationMeters: number;
  heightMeters: number;
  slab: FloorSlab3D;
  walls: Wall3D[];
  doors: Door3D[];
  windows: Window3D[];
  stairs: Stair3D[];
  columns: Column3D[];
  rooms: Room3D[];
}

// -----------------------------------------------------------------------------
// Canonical Building Model
// -----------------------------------------------------------------------------

export type ReconstructionStatus =
  | 'LOCKED'
  | 'VALIDATING'
  | 'RECONSTRUCTING'
  | 'VALIDATED'
  | 'READY'
  | 'READY_WITH_ASSUMPTIONS'
  | 'PARTIAL'
  | 'FAILED';

export interface ReconstructionMetadata {
  modelId: string;
  generatedAt: string;
  sourceBlueprintId: string;
  sourceHash: string;
  scaleStatus: 'RESOLVED' | 'PARTIAL' | 'ASSUMED';
  drawingScale: string;
  pixelsPerMeter: number;
  totalElementCount: number;
  elementsByType: Record<string, number>;
  assumptionCount: number;
  warningCount: number;
  reconstructionDurationMs: number;
}

export interface BuildingModel {
  id: string;
  name: string;
  projectId: string;
  sourceBlueprintId: string;
  sourceHash: string;
  status: ReconstructionStatus;
  units: 'METRIC';
  metricUnitRatio: number; // 1.0 = 1 meter
  dimensions: {
    widthMeters: number;
    depthMeters: number;
    heightMeters: number;
    grossAreaSqMeters: number;
  };
  boundingBox: BoundingBox3D;
  floors: BuildingFloor[];
  activeFloorIndex: number;
  assumptions: ReconstructionAssumption[];
  warnings: ReconstructionWarning[];
  metadata: ReconstructionMetadata;
}

export interface ReconstructionGateResult {
  canReconstruct: boolean;
  reason?: string;
  unresolvedCount: number;
  rejectedCount: number;
  totalVerified: number;
  scaleStatus: 'RESOLVED' | 'PARTIAL' | 'UNRESOLVED';
  requiresReview: boolean;
}

export interface ReconstructionResult {
  success: boolean;
  model?: BuildingModel;
  warnings: ReconstructionWarning[];
  errors: ReconstructionError[];
  metadata?: ReconstructionMetadata;
}
