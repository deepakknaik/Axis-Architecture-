'use client';

import * as React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingModel, Wall3D, Column3D, Stair3D, Point3D } from '@/lib/reconstruction/types';

export interface TouchPadsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
}

export interface WalkthroughControllerProps {
  model: BuildingModel;
  isActive: boolean;
  activeFloorId?: string;
  startPoint?: Point3D | null;
  touchPads?: TouchPadsState;
  fov?: number;
  onExit: () => void;
  onCollisionChange?: (wallId: string | null) => void;
  onActiveRoomChange?: (roomName: string, areaSqMeters?: number) => void;
  onPlayerPoseChange?: (pos: { x: number; y: number; z: number }, yaw: number) => void;
}

export function WalkthroughController({
  model,
  isActive,
  activeFloorId,
  startPoint,
  touchPads,
  fov = 76,
  onExit,
  onCollisionChange,
  onActiveRoomChange,
  onPlayerPoseChange,
}: WalkthroughControllerProps) {
  const { camera, gl } = useThree();

  // Internal Walkthrough State
  const EYE_HEIGHT = 1.62; // CAMERA HEIGHT ASSUMED (Nominal architectural eye-level)
  const CLEARANCE_MARGIN = 0.18; // Smooth collision buffer allowing easy doorway traversal
  const BASE_SPEED = 3.6; // Meters per second

  const floor = React.useMemo(() => {
    if (activeFloorId && activeFloorId !== 'ALL') {
      return model.floors.find((f) => f.id === activeFloorId) || model.floors[0];
    }
    return model.floors[0];
  }, [model.floors, activeFloorId]);

  const floorElev = floor?.elevationMeters || 0;

  // Active Floor Obstacles (Walls, Columns, Stairs)
  const walls: Wall3D[] = floor?.walls || [];
  const columns: Column3D[] = floor?.columns || [];
  const stairs: Stair3D[] = floor?.stairs || [];

  // Player position vector
  const playerPos = React.useRef(new THREE.Vector3(0, floorElev + EYE_HEIGHT, 0));
  const yaw = React.useRef(0);
  const pitch = React.useRef(0);

  // Key tracking
  const keys = React.useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const isLocked = React.useRef(false);
  const lastReportedRoom = React.useRef<string>('');

  // Adjust camera FOV for wide, spacious architectural walkthrough vision
  React.useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      if (isActive) {
        camera.fov = fov; // Wide architectural vision makes spaces feel large and open
        camera.near = 0.05; // Prevent clipping through walls/furniture
      } else {
        camera.fov = 45; // Standard orthographic inspection lens
        camera.near = 0.1;
      }
      camera.updateProjectionMatrix();
    }
  }, [isActive, camera, fov]);

  // Reposition when startPoint updates (e.g. user clicked a "Go to" room spot)
  React.useEffect(() => {
    if (!isActive) return;

    if (startPoint) {
      playerPos.current.set(startPoint.x, floorElev + EYE_HEIGHT, startPoint.z);
      camera.position.copy(playerPos.current);
      // Orient camera towards building center or room orientation
      const dx = model.boundingBox.center.x - startPoint.x;
      const dz = model.boundingBox.center.z - startPoint.z;
      if (Math.hypot(dx, dz) > 0.1) {
        yaw.current = Math.atan2(-dx, -dz);
      }
      pitch.current = 0;
    }
  }, [isActive, startPoint, floorElev, camera, model.boundingBox.center]);

  // Initialize start point when walkthrough activates
  React.useEffect(() => {
    if (!isActive) return;

    if (!startPoint) {
      // Find entrance / first room centroid or building center fallback
      const firstRoom = floor?.rooms?.[0];
      if (firstRoom) {
        playerPos.current.set(firstRoom.centroid.x, floorElev + EYE_HEIGHT, firstRoom.centroid.z);
      } else {
        const c = model.boundingBox.center;
        playerPos.current.set(c.x, floorElev + EYE_HEIGHT, c.z);
      }
      camera.position.copy(playerPos.current);
      yaw.current = 0;
      pitch.current = 0;
      camera.rotation.set(0, 0, 0);
    }
  }, [isActive, startPoint, floor, floorElev, model.boundingBox.center, camera]);

  // Pointer lock change listener
  React.useEffect(() => {
    if (!isActive) return;

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === gl.domElement;
      if (!isLocked.current && isActive) {
        // User pressed ESC or clicked away
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.sprint = true;
      if (e.code === 'Escape') onExit();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.current.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.current.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.current.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.current.right = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.sprint = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      const sensitivity = 0.0022;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;

      // Clamp vertical pitch to ~85 degrees
      const maxPitch = (85 * Math.PI) / 180;
      pitch.current = Math.max(-maxPitch, Math.min(maxPitch, pitch.current));
    };

    const handleCanvasClick = () => {
      if (isActive && !isLocked.current) {
        gl.domElement.requestPointerLock();
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleCanvasClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('click', handleCanvasClick);
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [isActive, gl.domElement, onExit]);

  // Point to Line Segment distance helper for 2D collision
  const distToSegmentSquared = (
    px: number,
    pz: number,
    x1: number,
    z1: number,
    x2: number,
    z2: number
  ) => {
    const l2 = (x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1);
    if (l2 === 0) {
      const distSq = (px - x1) * (px - x1) + (pz - z1) * (pz - z1);
      return { distSq, projX: x1, projZ: z1 };
    }
    let t = ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projZ = z1 + t * (z2 - z1);
    return {
      distSq: (px - projX) * (px - projX) + (pz - projZ) * (pz - projZ),
      projX,
      projZ,
    };
  };

  // Helper to determine if point is inside room boundary polygon
  const isPointInPolygon = (px: number, pz: number, polygon: Point3D[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const zi = polygon[i].z;
      const xj = polygon[j].x;
      const zj = polygon[j].z;
      const intersect =
        zi > pz !== zj > pz && px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Main Movement & Collision Loop
  useFrame((_, delta) => {
    if (!isActive) return;

    // Apply rotation from touch pads
    if (touchPads?.turnLeft) {
      yaw.current += 2.0 * delta;
    }
    if (touchPads?.turnRight) {
      yaw.current -= 2.0 * delta;
    }

    // Apply rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    camera.rotation.z = 0;

    // Movement delta
    const speed = (keys.current.sprint ? BASE_SPEED * 1.8 : BASE_SPEED) * Math.min(delta, 0.1);

    const moveVector = new THREE.Vector3();
    const moveF = keys.current.forward || Boolean(touchPads?.forward);
    const moveB = keys.current.backward || Boolean(touchPads?.backward);
    const moveL = keys.current.left || Boolean(touchPads?.left);
    const moveR = keys.current.right || Boolean(touchPads?.right);

    if (moveF) moveVector.z -= 1;
    if (moveB) moveVector.z += 1;
    if (moveL) moveVector.x -= 1;
    if (moveR) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      // Rotate movement vector according to yaw
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
      moveVector.multiplyScalar(speed);

      // Candidate next position
      let candX = playerPos.current.x + moveVector.x;
      let candZ = playerPos.current.z + moveVector.z;
      let activeCollisionId: string | null = null;

      // 1. Wall Collision Detection & Sliding
      for (const wall of walls) {
        const halfThick = (wall.thicknessMeters || 0.23) / 2;
        const safeRadius = halfThick + CLEARANCE_MARGIN;
        const res = distToSegmentSquared(
          candX,
          candZ,
          wall.start.x,
          wall.start.z,
          wall.end.x,
          wall.end.z
        );

        if (res.distSq < safeRadius * safeRadius) {
          activeCollisionId = wall.id;
          // Push candidate outside wall circle
          const dist = Math.sqrt(res.distSq) || 0.001;
          const pushNormX = (candX - res.projX) / dist;
          const pushNormZ = (candZ - res.projZ) / dist;
          candX = res.projX + pushNormX * (safeRadius + 0.01);
          candZ = res.projZ + pushNormZ * (safeRadius + 0.01);
        }
      }

      // 2. Column Collision Detection
      for (const col of columns) {
        const colRadius = Math.max(col.widthMeters, col.depthMeters) / 2 + CLEARANCE_MARGIN;
        const dx = candX - col.position.x;
        const dz = candZ - col.position.z;
        const distSq = dx * dx + dz * dz;

        if (distSq < colRadius * colRadius) {
          activeCollisionId = col.id;
          const dist = Math.sqrt(distSq) || 0.001;
          candX = col.position.x + (dx / dist) * (colRadius + 0.01);
          candZ = col.position.z + (dz / dist) * (colRadius + 0.01);
        }
      }

      // 3. Extents Boundary Constraint (Keep player within site envelope)
      const minX = model.boundingBox.min.x - 2.5;
      const maxX = model.boundingBox.max.x + 2.5;
      const minZ = model.boundingBox.min.z - 2.5;
      const maxZ = model.boundingBox.max.z + 2.5;

      playerPos.current.x = Math.max(minX, Math.min(maxX, candX));
      playerPos.current.z = Math.max(minZ, Math.min(maxZ, candZ));

      onCollisionChange?.(activeCollisionId);
    }

    // 4. Floor & Stair Elevation Constraint
    let targetElev = floorElev + EYE_HEIGHT;

    // Check if on stairs
    for (const stair of stairs) {
      const sx = stair.startPoint.x;
      const sz = stair.startPoint.z;
      const ex = stair.endPoint.x;
      const ez = stair.endPoint.z;
      const dist = distToSegmentSquared(playerPos.current.x, playerPos.current.z, sx, sz, ex, ez);
      const stairRadius = (stair.widthMeters || 1.2) / 2;

      if (dist.distSq < stairRadius * stairRadius) {
        // Calculate progress along stair
        const totalLen = Math.hypot(ex - sx, ez - sz) || 1;
        const prog = Math.hypot(playerPos.current.x - sx, playerPos.current.z - sz) / totalLen;
        const clampedProg = Math.max(0, Math.min(1, prog));
        targetElev = floorElev + EYE_HEIGHT + clampedProg * (stair.totalRiseMeters || 2.8);
        break;
      }
    }

    playerPos.current.y = targetElev;
    camera.position.copy(playerPos.current);

    // 5. Active Room Spatial Detection
    const curX = playerPos.current.x;
    const curZ = playerPos.current.z;
    const foundRoom = (floor?.rooms || []).find((r) => {
      if (r.boundaryPolygon && r.boundaryPolygon.length >= 3) {
        return isPointInPolygon(curX, curZ, r.boundaryPolygon);
      }
      const halfW = (r.dimensions?.widthMeters || 3) / 2;
      const halfD = (r.dimensions?.depthMeters || 3) / 2;
      return (
        Math.abs(curX - r.centroid.x) <= halfW &&
        Math.abs(curZ - r.centroid.z) <= halfD
      );
    });

    const roomLabel = foundRoom ? foundRoom.name : 'Exterior / Porch';
    if (roomLabel !== lastReportedRoom.current) {
      lastReportedRoom.current = roomLabel;
      onActiveRoomChange?.(roomLabel, foundRoom?.areaSqMeters);
    }

    // Report player pose for 2D radar minimap HUD (Matching Reference Panel 3)
    onPlayerPoseChange?.(
      { x: playerPos.current.x, y: playerPos.current.y, z: playerPos.current.z },
      yaw.current
    );
  });

  return null;
}
