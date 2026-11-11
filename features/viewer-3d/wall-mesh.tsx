'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Wall3D, WallSubSegment3D } from '@/lib/reconstruction/types';

export interface WallMeshProps {
  wall: Wall3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

export function WallMesh({
  wall,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: WallMeshProps) {
  // Memoize box geometries for each subsegment of the wall
  const segmentsData = React.useMemo(() => {
    return wall.subSegments.map((seg) => {
      const dx = seg.end.x - seg.start.x;
      const dz = seg.end.z - seg.start.z;
      const length = Math.max(0.01, Math.hypot(dx, dz));
      const angle = Math.atan2(dz, dx);

      const midX = (seg.start.x + seg.end.x) / 2;
      const midZ = (seg.start.z + seg.end.z) / 2;
      const midY = seg.elevation + seg.height / 2;

      return {
        id: seg.id,
        length,
        thickness: seg.thickness,
        height: seg.height,
        position: [midX, midY, midZ] as [number, number, number],
        rotationY: -angle,
        isHeader: seg.isHeader,
        isSill: seg.isSill,
      };
    });
  }, [wall]);

  // Restrained architectural limestone material
  const materialProps = React.useMemo(() => {
    if (isSelected) {
      return {
        color: '#D47343', // AXIS Terracotta accent for selected element
        roughness: 0.6,
        metalness: 0.1,
      };
    }
    if (isHovered) {
      return {
        color: '#E0DDD4',
        roughness: 0.7,
        metalness: 0.05,
      };
    }
    // Standard warm architectural limestone
    return {
      color: wall.classification === 'EXTERIOR' ? '#EAE6DC' : '#F1EEE8',
      roughness: 0.85,
      metalness: 0.02,
    };
  }, [isSelected, isHovered, wall.classification]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(wall.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(wall.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {segmentsData.map((seg) => (
        <mesh
          key={seg.id}
          position={seg.position}
          rotation={[0, seg.rotationY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[seg.length, seg.height, seg.thickness]} />
          <meshStandardMaterial
            color={materialProps.color}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
}
