'use client';

import * as React from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { BuildingModel, Room3D, BuildingFloor, Point3D } from '@/lib/reconstruction/types';
import {
  InteractionWorkspaceMode,
  ActiveViewportTool,
  CameraPresetType,
  CategoryVisibilityState,
  DEFAULT_CATEGORY_VISIBILITY,
  MeasurementItem,
} from '@/lib/reconstruction/interaction-types';
import { BuildingModelGroup } from './building-model';
import { CameraController } from './camera-controller';
import { WalkthroughController, TouchPadsState } from './walkthrough-controller';
import { MeasurementOverlay } from './measurement-overlay';
import { SiteEnvironment } from './site-environment';
import { exportBuildingModelToGLB } from './model-exporter';

export interface BuildingSceneProps {
  model: BuildingModel;
  mode?: InteractionWorkspaceMode;
  tool?: ActiveViewportTool;
  selectedElementId?: string | null;
  hoveredElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onHoverElement?: (id: string | null) => void;
  categoryVisibility?: CategoryVisibilityState;
  showGrid?: boolean;
  wireframe?: boolean;
  cameraPreset?: CameraPresetType;
  activeFloorId?: string | 'ALL';
  fadeNonSelectedFloors?: boolean;
  focusedRoom?: Room3D | null;
  focusedFloor?: BuildingFloor | null;
  fitTrigger?: number;
  resetTrigger?: number;
  measurements?: MeasurementItem[];
  onAddMeasurement?: (m: MeasurementItem) => void;
  onRemoveMeasurement?: (id: string) => void;
  onExitWalkthrough?: () => void;
  walkthroughStartPoint?: Point3D | null;
  onCollisionChange?: (wallId: string | null) => void;
  touchPads?: TouchPadsState;
  onActiveRoomChange?: (roomName: string, areaSqMeters?: number) => void;
  walkthroughFov?: number;
  onRegisterExporter?: (fn: () => Promise<void>) => void;
  isExplodedView?: boolean;
}

export function BuildingScene({
  model,
  mode = 'INSPECT',
  tool = 'SELECT',
  selectedElementId,
  hoveredElementId,
  onSelectElement,
  onHoverElement,
  categoryVisibility = DEFAULT_CATEGORY_VISIBILITY,
  showGrid = true,
  wireframe = false,
  cameraPreset = 'AXONOMETRIC',
  activeFloorId = 'ALL',
  fadeNonSelectedFloors = true,
  focusedRoom = null,
  focusedFloor = null,
  fitTrigger = 0,
  resetTrigger = 0,
  measurements = [],
  onAddMeasurement,
  onRemoveMeasurement,
  onExitWalkthrough,
  walkthroughStartPoint = null,
  onCollisionChange,
  touchPads,
  onActiveRoomChange,
  walkthroughFov = 76,
  onRegisterExporter,
  isExplodedView = false,
}: BuildingSceneProps) {
  const controlsRef = React.useRef<OrbitControlsImpl>(null);
  const buildingGroupRef = React.useRef<THREE.Group>(null);
  const { scene } = useThree();
  const [pendingMeasurePoint, setPendingMeasurePoint] = React.useState<Point3D | null>(null);

  // Expose GLB export function to parent canvas
  React.useEffect(() => {
    if (onRegisterExporter) {
      onRegisterExporter(async () => {
        const target = buildingGroupRef.current || scene;
        const cleanName = (model.name || 'axis-architecture-model')
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-');
        await exportBuildingModelToGLB(target, {
          fileName: `${cleanName}.glb`,
          binary: true,
        });
      });
    }
  }, [onRegisterExporter, model.name, scene]);

  const gridExtent = Math.max(model.dimensions.widthMeters, model.dimensions.depthMeters) * 2;

  // Handle measurement clicks on any 3D surface
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (mode !== 'INSPECT' || tool !== 'MEASURE') return;

    e.stopPropagation();
    const hitPoint: Point3D = {
      x: Number(e.point.x.toFixed(3)),
      y: Number(e.point.y.toFixed(3)),
      z: Number(e.point.z.toFixed(3)),
    };

    if (!pendingMeasurePoint) {
      setPendingMeasurePoint(hitPoint);
    } else {
      // Complete measurement
      const dx = hitPoint.x - pendingMeasurePoint.x;
      const dy = hitPoint.y - pendingMeasurePoint.y;
      const dz = hitPoint.z - pendingMeasurePoint.z;
      const dist = Math.hypot(dx, dy, dz);

      if (dist > 0.05) {
        onAddMeasurement?.({
          id: `meas-${Date.now()}`,
          start: pendingMeasurePoint,
          end: hitPoint,
          distanceMeters: Number(dist.toFixed(3)),
          createdAt: Date.now(),
        });
      }
      setPendingMeasurePoint(null);
    }
  };

  return (
    <>
      {/* 1. Camera System: Inspect Mode vs Walkthrough Mode */}
      {mode === 'INSPECT' ? (
        <>
          <CameraController
            model={model}
            preset={cameraPreset}
            focusedRoom={focusedRoom}
            focusedFloor={focusedFloor}
            controlsRef={controlsRef}
            fitTrigger={fitTrigger}
            resetTrigger={resetTrigger}
          />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={1.5}
            maxDistance={60}
            maxPolarAngle={Math.PI / 2 + 0.05} // Prevent camera going below ground
            enableRotate={tool === 'SELECT' || tool === 'ORBIT'}
            enablePan={tool === 'PAN'}
          />
        </>
      ) : (
        <WalkthroughController
          model={model}
          isActive={mode === 'WALKTHROUGH'}
          activeFloorId={activeFloorId === 'ALL' ? undefined : activeFloorId}
          startPoint={walkthroughStartPoint}
          onExit={onExitWalkthrough || (() => {})}
          onCollisionChange={onCollisionChange}
          touchPads={touchPads}
          fov={walkthroughFov}
          onActiveRoomChange={onActiveRoomChange}
        />
      )}

      {/* 2. Site Environment (Sky, Fog, Lawn, Concrete Plinth, Steps & Landscaping) */}
      <SiteEnvironment model={model} isWalkthrough={mode === 'WALKTHROUGH'} />

      {/* 3. Natural Architectural Sun & Sky Lighting */}
      <ambientLight intensity={mode === 'WALKTHROUGH' ? 0.75 : 0.55} color="#FFFBF2" />
      <directionalLight
        position={[12, 22, 14]}
        intensity={mode === 'WALKTHROUGH' ? 0.9 : 1.25}
        color="#FFF3DF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0006}
      />
      <hemisphereLight
        args={['#FFFFFF', '#7B8896', mode === 'WALKTHROUGH' ? 0.85 : 0.62]}
      />

      {/* 4. Optional Ground Architectural Grid */}
      {showGrid && (
        <group position={[0, -0.395, 0]}>
          <gridHelper
            args={[
              Math.max(28, Math.ceil(gridExtent)),
              Math.max(28, Math.ceil(gridExtent)),
              '#7D8B7A',
              '#98A892',
            ]}
          />
        </group>
      )}

      {/* 5. Building Assembly Mesh Group */}
      <group ref={buildingGroupRef} onPointerDown={handlePointerDown}>
        <BuildingModelGroup
          model={model}
          selectedElementId={selectedElementId}
          hoveredElementId={hoveredElementId}
          onSelectElement={tool === 'MEASURE' ? undefined : onSelectElement}
          onHoverElement={tool === 'MEASURE' ? undefined : onHoverElement}
          categoryVisibility={categoryVisibility}
          wireframe={wireframe}
          activeFloorId={activeFloorId}
          fadeNonSelectedFloors={fadeNonSelectedFloors}
          isExplodedView={isExplodedView}
        />
      </group>

      {/* 5. Architectural Measurements */}
      <MeasurementOverlay
        measurements={measurements}
        pendingPoint={pendingMeasurePoint}
        onRemoveMeasurement={onRemoveMeasurement}
      />
    </>
  );
}
