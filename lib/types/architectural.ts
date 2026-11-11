/**
 * AXIS ARCHITECTURE — Architectural Data Foundation
 * 
 * Foundational type contracts and data structures for 2D blueprint interpretation,
 * architectural element extraction, human verification, and 3D spatial reconstruction.
 */

// -----------------------------------------------------------------------------
// Coordinate & Geometry Primitives
// -----------------------------------------------------------------------------

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface BoundingBox2D {
  min: Vector2D;
  max: Vector2D;
}

export interface Dimensions3D {
  width: number;   // Along X or local primary axis (meters)
  length: number;  // Along Y or local secondary axis (meters)
  height: number;  // Along Z or vertical axis (meters)
  thickness?: number; // Wall thickness or slab depth
}

export interface SpatialTransform {
  position: Vector3D;
  rotation: Vector3D; // Euler angles in radians or degrees
  scale?: Vector3D;
}

// -----------------------------------------------------------------------------
// Architectural Element Taxonomy
// -----------------------------------------------------------------------------

export type ArchitecturalElementType =
  | 'WALL'
  | 'DOOR'
  | 'WINDOW'
  | 'ROOM'
  | 'STAIR'
  | 'COLUMN';

export type ElementProcessingStatus =
  | 'DETECTED'
  | 'VERIFIED'
  | 'MODIFIED'
  | 'FLAGGED'
  | 'REJECTED';

export type WallClassification =
  | 'LOAD_BEARING'
  | 'PARTITION'
  | 'EXTERIOR'
  | 'INTERIOR'
  | 'CURTAIN';

export type DoorType =
  | 'SINGLE_SWING'
  | 'DOUBLE_SWING'
  | 'SLIDING'
  | 'POCKET'
  | 'BIFOLD'
  | 'REVOLVING';

export type WindowType =
  | 'FIXED'
  | 'CASEMENT'
  | 'DOUBLE_HUNG'
  | 'SLIDING'
  | 'DOUBLE_SLIDER'
  | 'AWNING'
  | 'CLERESTORY';

export type RoomFunction =
  | 'LIVING'
  | 'BEDROOM'
  | 'KITCHEN'
  | 'DINING'
  | 'BATHROOM'
  | 'PORCH'
  | 'CORRIDOR'
  | 'OFFICE'
  | 'BALCONY'
  | 'STORAGE'
  | 'UTILITY'
  | 'GARAGE'
  | 'OPEN_SPACE'
  | 'CUSTOM';

// -----------------------------------------------------------------------------
// Core Source Coordinate System & Base Element Contract
// -----------------------------------------------------------------------------

export type SourcePoint = {
  x: number;
  y: number;
  xNormalized?: number;
  yNormalized?: number;
};

export type SourceBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  normalized?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export interface DetectionSourceReference {
  blueprintId: string;
  page?: number;
  sourceWidth: number;
  sourceHeight: number;
  boundingBox: SourceBoundingBox;
  geometry?: unknown;
}

export interface SourceReference {
  imageId: string;
  page?: number;
  boundingBox: BoundingBox2D;
  sourceCoordinates: Vector2D | Vector2D[];
  pixelDistance?: number;
  detectionRef?: DetectionSourceReference;
}

export interface BaseArchitecturalElement {
  id: string;
  type: ArchitecturalElementType;
  floorId: string;
  confidence: number; // 0.0 to 1.0 (from analysis model)
  status: ElementProcessingStatus;
  transform: SpatialTransform;
  dimensions: Dimensions3D;
  rawBounds2D: BoundingBox2D; // Pixel/normalized coordinates in the original 2D blueprint
  sourceReference?: SourceReference;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Specific Element Definitions
// -----------------------------------------------------------------------------

export interface WallElement extends BaseArchitecturalElement {
  type: 'WALL';
  startPoint: Vector2D;
  endPoint: Vector2D;
  thickness: number; // in meters (e.g. 0.15m partition, 0.30m exterior)
  height: number;    // in meters (e.g. 2.80m)
  classification: WallClassification;
  connectedElementIds: string[]; // Connected doors, windows, adjoining walls
}

export interface DoorElement extends BaseArchitecturalElement {
  type: 'DOOR';
  doorType: DoorType;
  hostWallId?: string; // ID of wall hosting this door
  swingDirection?: 'LEFT' | 'RIGHT' | 'INWARD' | 'OUTWARD';
  clearWidth: number;
  clearHeight: number;
  wallThickness?: number;
  connectedRoomIds?: string[];
  width?: number;
  height?: number;
  position?: Vector2D;
}

export interface WindowElement extends BaseArchitecturalElement {
  type: 'WINDOW';
  windowType: WindowType;
  hostWallId?: string;
  sillHeight: number; // Height above floor in meters
  windowHeight: number;
  windowWidth: number;
  wallThickness?: number;
  glazingLayers?: number;
  frameMaterial?: string;
  connectedRoomIds?: string[];
  height?: number;
  position?: Vector2D;
}

export interface RoomElement extends BaseArchitecturalElement {
  type: 'ROOM';
  name: string;
  roomFunction: RoomFunction;
  boundaryPolygon: Vector2D[]; // 2D footprint polygon points
  calculatedAreaSqMeters: number;
  perimeterMeters?: number;
  boundaryWallIds: string[];
  doorIds?: string[];
  windowIds?: string[];
}

export interface StairElement extends BaseArchitecturalElement {
  type: 'STAIR';
  flightCount: number;
  treadDepth: number;
  riserHeight: number;
  stairWidth: number;
  direction: 'UP' | 'DOWN';
  connectsToFloorId?: string;
  startPoint?: Vector2D;
  endPoint?: Vector2D;
  riserCount?: number;
  totalRise?: number;
  handrailSide?: 'LEFT' | 'RIGHT' | 'BOTH' | 'NONE' | string;
  connectedFloorIds?: string[];
  width?: number;
}

export interface ColumnElement extends BaseArchitecturalElement {
  type: 'COLUMN';
  crossSectionShape: 'RECTANGULAR' | 'CIRCULAR' | 'COMPOSITE';
  diameterOrWidth: number;
  depth?: number;
  structuralMaterial?: 'CONCRETE' | 'STEEL' | 'TIMBER' | 'COMPOSITE';
  position?: Vector2D;
  height?: number;
  connectedWallIds?: string[];
}

export type ArchitecturalElement =
  | WallElement
  | DoorElement
  | WindowElement
  | RoomElement
  | StairElement
  | ColumnElement;

// -----------------------------------------------------------------------------
// Verification Contracts (Human-in-the-loop review — Part 07)
// -----------------------------------------------------------------------------

export type VerificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus =
  | 'UNREVIEWED'
  | 'CONFIRMED'
  | 'EDITED'
  | 'REJECTED';

export type ConfidenceSemanticLabel =
  | 'DETECTED'
  | 'PARTIAL'
  | 'REVIEW_REQUIRED'
  | 'UNRESOLVED'
  | 'HIGH_CONSISTENCY'
  | 'GEOMETRY_AMBIGUOUS'
  | 'SCALE_UNRESOLVED';

export interface VerificationHistoryEntry {
  id: string;
  elementId: string;
  elementType: ArchitecturalElementType;
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  timestamp: string; // ISO string
  formattedTime: string; // e.g. "06:31"
  note?: string;
  changesSummary?: string;
}

export interface VerificationItem {
  id: string;
  elementId: string;
  elementType: ArchitecturalElementType;
  status: VerificationStatus;
  originalDetection: ArchitecturalElement;
  verifiedGeometry: ArchitecturalElement;
  reviewReason: string;
  isPriorityReview: boolean;
  confidenceLabel: ConfidenceSemanticLabel;
  confidenceScore?: number; // Raw model metric if present, never fabricated
  reviewedAt?: string;
  reviewedBy?: string;
  // Backward compatibility fields
  confidence?: number;
  priority?: VerificationPriority;
  issueDescription?: string;
  suggestedAction?: 'ACCEPT' | 'ADJUST_DIMENSIONS' | 'RECLASSIFY' | 'DISMISS';
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  snapshot2DUrl?: string;
}

export interface CategoryReviewProgress {
  type: ArchitecturalElementType;
  total: number;
  reviewed: number;
  confirmed: number;
  edited: number;
  rejected: number;
}

export interface VerificationProgress {
  totalDetections: number;
  reviewedCount: number;
  confirmedCount: number;
  editedCount: number;
  rejectedCount: number;
  remainingCount: number;
  isComplete: boolean;
  categories: Record<ArchitecturalElementType, CategoryReviewProgress>;
}

export interface BlueprintVerification {
  id: string;
  blueprintId: string;
  projectId: string;
  status: 'UNVERIFIED' | 'REVIEW_IN_PROGRESS' | 'VERIFIED';
  items: VerificationItem[];
  history: VerificationHistoryEntry[];
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Blueprint & Analysis Contracts
// -----------------------------------------------------------------------------

export interface BlueprintScale {
  ratioText: string;        // e.g. "1:100" or "1/4\" = 1'-0\""
  pixelsPerMeter: number;   // Calibration factor
  isCalibrated: boolean;
  calibrationPoints?: [Vector2D, Vector2D]; // Reference measured line
  measuredDistanceMeters?: number;
}

export interface BlueprintMetadata {
  originalFileName: string;
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf' | 'image/svg+xml';
  width: number;
  height: number;
  dpi?: number;
  drawingTitle?: string;
  sheetNumber?: string;
  architectName?: string;
  dateOnPlan?: string;
}

export type AnalysisStatus =
  | 'PREPARING'
  | 'ANALYZING'
  | 'READY'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'FAILED';

export interface ArchitecturalExtentDimensions {
  widthMeters: number;
  lengthMeters: number;
  wallThicknessMeters: number;
  wallHeightMeters: number;
  totalGrossAreaSqMeters: number;
}

export interface AnalysisScaleInfo {
  projectUnits: 'METRIC' | 'IMPERIAL';
  drawingScale: string;        // "1:100"
  pixelsPerMeter: number;
  status: 'RESOLVED' | 'UNRESOLVED';
}

export interface AnalysisOrientation {
  northAngleDegrees: number;   // e.g. 0 (North pointing up)
  entranceDirection: string;   // "East"
  status: 'RESOLVED' | 'UNRESOLVED';
  note?: string;
}

export interface AnalysisFloorInfo {
  groundFloors: number;        // 1
  additionalFloors: number;    // 0
  status: 'RESOLVED' | 'UNRESOLVED';
}

export interface DetectionResult {
  elements: ArchitecturalElement[];
  totalDetected: number;
  averageConfidence: number;
  elementsByType: Record<ArchitecturalElementType, number>;
  unresolvedItemsCount: number;
}

export interface DebugAnnotationBox {
  id: string;
  label: string;
  category: 'OCR_TEXT' | 'DIMENSION_LINE' | 'WALL_CANDIDATE' | 'DOOR_CANDIDATE' | 'FURNITURE_PROTECTED';
  box: { x: number; y: number; width: number; height: number };
  details?: string;
}

export interface BlueprintAnalysis {
  id: string;
  blueprintId: string;
  version: number;
  status: AnalysisStatus;
  startedAt: string;
  completedAt?: string;
  engineMode: 'DETERMINISTIC_ANALYSIS' | 'ANALYSIS_PREVIEW' | 'PROTOTYPE_GEOMETRY';
  imageWidth?: number;
  imageHeight?: number;
  scale: BlueprintScale;
  scaleInfo: AnalysisScaleInfo;
  dimensions: ArchitecturalExtentDimensions;
  orientation: AnalysisOrientation;
  floorInfo: AnalysisFloorInfo;
  walls: WallElement[];
  doors: DoorElement[];
  windows: WindowElement[];
  rooms: RoomElement[];
  stairs: StairElement[];
  columns: ColumnElement[];
  detections: DetectionResult;
  verificationQueue: VerificationItem[];
  unresolvedItemsCount: number;
  modelExecutionTimeMs?: number;
  debugAnnotations?: DebugAnnotationBox[];
}

export type IngestionStatus =
  | 'IDLE'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'UPLOADING'
  | 'INGESTING'
  | 'READY'
  | 'FAILED';

export interface Blueprint {
  id: string;
  projectId: string;
  name: string;
  filename?: string;
  mimeType?: string;
  fileSize?: number;
  status?: IngestionStatus;
  sourceChecksum?: string;
  sourceUrl?: string;
  thumbnailUrl?: string;
  metadata?: BlueprintMetadata;
  scale?: BlueprintScale;
  uploadedAt: string;
  pageCount?: number;
  width?: number;
  height?: number;
  units?: string;
  sourcePath?: string;
  profile?: string;
  analysis?: BlueprintAnalysis;
}

// -----------------------------------------------------------------------------
// Multi-Floor & 3D Building Model Contracts
// -----------------------------------------------------------------------------

export interface BuildingFloor {
  id: string;
  buildingModelId: string;
  name: string;
  levelIndex: number; // 0 = Ground, 1 = 1st floor, -1 = Basement
  elevationMeters: number; // Height offset from ground datum
  ceilingHeightMeters: number; // Standard slab-to-ceiling clearance
  slabThicknessMeters: number;
  blueprintId?: string;
  elements: ArchitecturalElement[];
}

export interface BuildingModel {
  id: string;
  projectId: string;
  name: string;
  version: number;
  floors: BuildingFloor[];
  totalFloors: number;
  totalGrossAreaSqMeters: number;
  defaultUnit: 'METRIC' | 'IMPERIAL';
  meshStatus: 'NOT_GENERATED' | 'GENERATING' | 'READY' | 'OUTDATED';
  meshAssetUrl?: string; // e.g. GLTF / GLB / binary mesh bundle
  generatedAt?: string;
}

// -----------------------------------------------------------------------------
// Project Contract
// -----------------------------------------------------------------------------

import { AxisStatusType } from './status';

export type BuildingType = 'Residential' | 'Commercial' | 'Office' | 'Other';

export interface ProjectSettings {
  defaultScaleUnit: 'METRIC' | 'IMPERIAL';
  standardWallHeight: number;
  standardWallThickness: number;
  gridSnapIncrement: number; // in meters (e.g. 0.05m = 5cm)
  autoDetectOpenings: boolean;
}

export interface Project {
  id: string;
  title: string;
  codeName?: string;
  description?: string;
  clientName?: string;
  location?: string;
  buildingType?: BuildingType;
  floorsCount?: number;
  status: AxisStatusType | 'PLANNING' | 'ANALYSIS' | 'REVIEW' | 'RECONSTRUCTED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  lastModified?: string;
  blueprints: Blueprint[];
  buildingModel?: BuildingModel;
  settings: ProjectSettings;
  thumbnailVariant?: 'villa' | 'tower' | 'studio' | 'urban' | 'coastal' | 'office' | 'default';
}
