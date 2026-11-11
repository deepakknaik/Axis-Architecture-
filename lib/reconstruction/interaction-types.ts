/**
 * AXIS ARCHITECTURE — Interactive Workspace & Walkthrough Types (Part 09)
 * 
 * Defines state and interfaces for:
 * - Two primary interaction modes (INSPECT vs WALKTHROUGH)
 * - Viewport tools (SELECT, ORBIT, PAN, MEASURE)
 * - Camera presets and fitting
 * - Category and floor visibility/isolation
 * - Architectural dimension measurement
 * - First-person walkthrough with collision and floor constraints
 */

import { Point3D, Vector3D } from './types';

export type InteractionWorkspaceMode = 'INSPECT' | 'WALKTHROUGH';

export type ActiveViewportTool = 'SELECT' | 'ORBIT' | 'PAN' | 'MEASURE';

export type CameraPresetType =
  | 'AXONOMETRIC'
  | 'PERSPECTIVE'
  | 'TOP'
  | 'FRONT'
  | 'LEFT'
  | 'RIGHT';

export interface CategoryVisibilityState {
  walls: boolean;
  doors: boolean;
  windows: boolean;
  rooms: boolean;
  stairs: boolean;
  columns: boolean;
  floors: boolean;
  dimensions: boolean;
  roof: boolean;
  fixtures: boolean;
  labels: boolean;
}

export const DEFAULT_CATEGORY_VISIBILITY: CategoryVisibilityState = {
  walls: true,
  doors: true,
  windows: true,
  rooms: true,
  stairs: true,
  columns: true,
  floors: true,
  dimensions: true,
  roof: false,
  fixtures: true,
  labels: true,
};

export interface MeasurementItem {
  id: string;
  start: Point3D;
  end: Point3D;
  distanceMeters: number;
  createdAt: number;
}

export interface SectionClippingSettings {
  enabled: boolean;
  heightMeters: number;
}

export interface WalkthroughState {
  isActive: boolean;
  isPointerLocked: boolean;
  eyeHeightMeters: number; // Default 1.65m (CAMERA HEIGHT ASSUMED)
  movementSpeed: number;   // Meters per second (e.g. 3.0m/s)
  currentPosition: Point3D;
  activeFloorId: string;
  collidingWithWallId: string | null;
}

export interface RoomHighlightInfo {
  roomId: string;
  name: string;
  areaSqMeters: number;
  dimensions: {
    widthMeters: number;
    depthMeters: number;
    heightMeters: number;
  };
}
