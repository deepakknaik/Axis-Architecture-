'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Wall3D, WallSubSegment3D } from '@/lib/reconstruction/types';
import { WallMaterialKey, WALL_MATERIALS } from '@/lib/reconstruction/material-types';

export interface WallMeshProps {
  wall: Wall3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
  customWallMaterial?: WallMaterialKey;
}

export function WallMesh({
  wall,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
  customWallMaterial,
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

    // Interactive Custom Material Override (Wall Palette)
    if (customWallMaterial && WALL_MATERIALS[customWallMaterial]) {
      const spec = WALL_MATERIALS[customWallMaterial];
      return {
        color: wall.classification === 'EXTERIOR' ? spec.color : '#FAF8F4',
        roughness: spec.roughness,
        metalness: spec.metalness,
      };
    }

    // Standard warm architectural limestone / crisp modern stucco
    return {
      color: wall.classification === 'EXTERIOR' ? '#F6F4EE' : '#FAF8F4',
      roughness: 0.82,
      metalness: 0.03,
    };
  }, [isSelected, isHovered, wall.classification, customWallMaterial]);

  const hasDoor = Boolean(wall.openings?.some((o) => o.type === 'DOOR'));

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
        <group key={seg.id}>
          {/* Main Wall Segment */}
          <mesh
            position={seg.position}
            rotation={[0, seg.rotationY, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[seg.length, seg.height, seg.thickness]} />
            <meshStandardMaterial
              color={wireframe ? '#0284C7' : materialProps.color}
              roughness={materialProps.roughness}
              metalness={materialProps.metalness}
              wireframe={wireframe}
            />
          </mesh>

          {/* Entrance Feature: Warm Vertical Wood Slat Cladding Accent (Matching Reference Panel 1) */}
          {!wireframe && hasDoor && wall.classification === 'EXTERIOR' && !seg.isHeader && !seg.isSill && (
            <mesh
              position={[
                seg.position[0],
                seg.position[1],
                seg.position[2] + 0.012,
              ]}
              rotation={[0, seg.rotationY, 0]}
              castShadow
            >
              <boxGeometry args={[seg.length, seg.height, 0.024]} />
              <meshStandardMaterial
                color="#85532F"
                roughness={0.42}
                metalness={0.06}
              />
            </mesh>
          )}

          {/* Architectural Wall Coping Cap (Top Rim - Dark Model Coping) */}
          {!wireframe && !seg.isSill && (
            <mesh
              position={[seg.position[0], seg.position[1] + seg.height / 2 + 0.02, seg.position[2]]}
              rotation={[0, seg.rotationY, 0]}
              castShadow
            >
              <boxGeometry args={[seg.length + 0.02, 0.04, seg.thickness + 0.03]} />
              <meshStandardMaterial
                color={isSelected ? '#B85D36' : isHovered ? '#475569' : '#2D323A'}
                roughness={0.5}
                metalness={0.12}
              />
            </mesh>
          )}

          {/* 10cm Dark Polished Granite Skirting Baseboard (Matching Real Domestic Architecture) */}
          {!wireframe && !seg.isHeader && !seg.isSill && (
            <mesh
              position={[
                seg.position[0],
                seg.position[1] - seg.height / 2 + 0.05,
                seg.position[2],
              ]}
              rotation={[0, seg.rotationY, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[seg.length + 0.005, 0.10, seg.thickness + 0.016]} />
              <meshStandardMaterial
                color="#282B30"
                roughness={0.22}
                metalness={0.35}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
