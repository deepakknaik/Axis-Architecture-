/**
 * Features: 3D Spatial Viewer Module
 * 
 * Provides lazy-loaded WebGL canvas foundation using Three.js and React Three Fiber.
 * Configured for architectural visualization with isometric, perspective, and plan projection.
 */

'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { ViewerCanvasProps } from './viewer-canvas';

export interface ViewportSettings {
  fov: number;
  near: number;
  far: number;
  backgroundColor: string;
}

export const defaultViewportSettings: ViewportSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  backgroundColor: '#181918',
};

/**
 * Dynamic import for the 3D Viewer Canvas
 * Prevents SSR evaluation of WebGL / browser canvas APIs.
 */
export const DynamicViewerCanvas = dynamic<ViewerCanvasProps>(
  () => import('./viewer-canvas').then((mod) => mod.ViewerCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#181918] text-stone-400 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-axis-terracotta border-t-transparent rounded-full animate-spin mb-3" />
        <span>INITIALIZING 3D SPATIAL ENGINE...</span>
      </div>
    ),
  }
);

export { ViewerCanvas } from './viewer-canvas';
export { BuildingScene } from './building-scene';
export { BuildingModelGroup } from './building-model';
export { WallMesh } from './wall-mesh';
export { FloorSlabMesh } from './floor-slab-mesh';
export { DoorMesh } from './door-mesh';
export { WindowMesh } from './window-mesh';
export { ColumnMesh } from './column-mesh';
export { StairMesh } from './stair-mesh';
export { RoomMesh } from './room-mesh';
export { DimensionOverlay3D } from './dimension-overlay-3d';
export { MeasurementOverlay } from './measurement-overlay';
export { CameraController } from './camera-controller';
export { WalkthroughController } from './walkthrough-controller';
export { RoofMesh } from './roof-mesh';
export { RoomLabels3D } from './room-labels-3d';
export { InteriorFixturesGroup } from './interior-fixtures-group';
export { SiteEnvironment } from './site-environment';
export { ArchitecturalLighting } from './architectural-lighting';
export { ExplodedGuideLines } from './exploded-guide-lines';
export { WalkthroughMinimap } from './walkthrough-minimap';
