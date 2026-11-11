'use client';

import * as React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { BuildingModel, Room3D, BuildingFloor } from '@/lib/reconstruction/types';
import { CameraPresetType } from '@/lib/reconstruction/interaction-types';

export interface CameraControllerProps {
  model: BuildingModel;
  preset: CameraPresetType;
  focusedRoom: Room3D | null;
  focusedFloor: BuildingFloor | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  fitTrigger: number; // Increment to trigger fitModelToView
  resetTrigger: number; // Increment to trigger reset
}

export function CameraController({
  model,
  preset,
  focusedRoom,
  focusedFloor,
  controlsRef,
  fitTrigger,
  resetTrigger,
}: CameraControllerProps) {
  const { camera } = useThree();

  // Model Extents
  const { center, size } = model.boundingBox;
  const maxHoriz = Math.max(size.x, size.z, 8);
  const fovRad = ((camera as THREE.PerspectiveCamera).fov || 45) * (Math.PI / 180);
  // Distance required to frame the building
  const fitDistance = Math.max(12, (maxHoriz / 2) / Math.tan(fovRad / 2) * 1.35);

  // Target camera position and lookAt target
  const targetPos = React.useRef(new THREE.Vector3(14, 11, 14));
  const targetLook = React.useRef(new THREE.Vector3(center.x, center.y, center.z));
  const isTransitioning = React.useRef(false);

  // Compute preset positions dynamically from real model extents
  const getPresetPosition = React.useCallback(
    (p: CameraPresetType): { pos: THREE.Vector3; look: THREE.Vector3 } => {
      const c = new THREE.Vector3(center.x, center.y + size.y * 0.3, center.z);
      const d = fitDistance;

      switch (p) {
        case 'AXONOMETRIC':
          return {
            pos: new THREE.Vector3(c.x + d * 0.72, c.y + d * 0.58, c.z + d * 0.72),
            look: c,
          };
        case 'TOP':
          return {
            pos: new THREE.Vector3(c.x, c.y + d * 1.4, c.z + 0.001),
            look: c,
          };
        case 'FRONT':
          return {
            pos: new THREE.Vector3(c.x, c.y + size.y * 0.2, c.z + d * 1.05),
            look: c,
          };
        case 'LEFT':
          return {
            pos: new THREE.Vector3(c.x - d * 1.05, c.y + size.y * 0.2, c.z),
            look: c,
          };
        case 'RIGHT':
          return {
            pos: new THREE.Vector3(c.x + d * 1.05, c.y + size.y * 0.2, c.z),
            look: c,
          };
        case 'PERSPECTIVE':
        default:
          return {
            pos: new THREE.Vector3(c.x + d * 0.65, c.y + d * 0.42, c.z + d * 0.75),
            look: c,
          };
      }
    },
    [center, size, fitDistance]
  );

  // Preset change effect
  React.useEffect(() => {
    const { pos, look } = getPresetPosition(preset);
    targetPos.current.copy(pos);
    targetLook.current.copy(look);
    isTransitioning.current = true;
  }, [preset, getPresetPosition]);

  // Fit to view trigger
  React.useEffect(() => {
    if (fitTrigger > 0) {
      const { pos, look } = getPresetPosition('AXONOMETRIC');
      targetPos.current.copy(pos);
      targetLook.current.copy(look);
      isTransitioning.current = true;
    }
  }, [fitTrigger, getPresetPosition]);

  // Reset trigger
  React.useEffect(() => {
    if (resetTrigger > 0) {
      const { pos, look } = getPresetPosition('AXONOMETRIC');
      targetPos.current.copy(pos);
      targetLook.current.copy(look);
      isTransitioning.current = true;
    }
  }, [resetTrigger, getPresetPosition]);

  // Focus room effect
  React.useEffect(() => {
    if (focusedRoom) {
      const rx = focusedRoom.centroid.x;
      const rz = focusedRoom.centroid.z;
      const ry = focusedRoom.centroid.y || 0;
      targetLook.current.set(rx, ry + 1.0, rz);
      targetPos.current.set(rx + 4.5, ry + 5.5, rz + 5.0);
      isTransitioning.current = true;
    }
  }, [focusedRoom]);

  // Focus floor effect
  React.useEffect(() => {
    if (focusedFloor) {
      const elev = focusedFloor.elevationMeters;
      targetLook.current.set(center.x, elev + 1.4, center.z);
      targetPos.current.set(center.x + fitDistance * 0.7, elev + fitDistance * 0.5, center.z + fitDistance * 0.7);
      isTransitioning.current = true;
    }
  }, [focusedFloor, center, fitDistance]);

  // Smooth frame interpolation (300-500ms damping)
  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    const lerpFactor = Math.min(1.0, delta * 6.5);
    camera.position.lerp(targetPos.current, lerpFactor);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, lerpFactor);
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLook.current);
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.05 &&
      (!controlsRef.current || controlsRef.current.target.distanceTo(targetLook.current) < 0.05)
    ) {
      isTransitioning.current = false;
    }
  });

  return null;
}
