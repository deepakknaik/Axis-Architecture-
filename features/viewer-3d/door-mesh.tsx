'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Door3D } from '@/lib/reconstruction/types';

export interface DoorMeshProps {
  door: Door3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

export function DoorMesh({
  door,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: DoorMeshProps) {
  const frameThickness = 0.05;
  const jambDepth = 0.15;
  const leafThickness = 0.04;

  const width = door.clearWidthMeters;
  const height = door.clearHeightMeters;

  const materialColor = isSelected
    ? '#D47343'
    : isHovered
    ? '#A88365'
    : '#8C6D53'; // Warm architectural timber tone

  return (
    <group
      position={[door.position.x, door.position.y, door.position.z]}
      rotation={[0, door.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(door.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(door.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Left Jamb */}
      <mesh
        position={[-width / 2 + frameThickness / 2, height / 2, 0]}
        castShadow
      >
        <boxGeometry args={[frameThickness, height, jambDepth]} />
        <meshStandardMaterial color="#4A453F" roughness={0.7} wireframe={wireframe} />
      </mesh>

      {/* 2. Right Jamb */}
      <mesh
        position={[width / 2 - frameThickness / 2, height / 2, 0]}
        castShadow
      >
        <boxGeometry args={[frameThickness, height, jambDepth]} />
        <meshStandardMaterial color="#4A453F" roughness={0.7} wireframe={wireframe} />
      </mesh>

      {/* 3. Header Jamb */}
      <mesh
        position={[0, height - frameThickness / 2, 0]}
        castShadow
      >
        <boxGeometry args={[width, frameThickness, jambDepth]} />
        <meshStandardMaterial color="#4A453F" roughness={0.7} wireframe={wireframe} />
      </mesh>

      {/* 4. Timber Door Leaf (Pivot-hinged 20 degrees open for architectural depth) */}
      <group position={[-width / 2 + frameThickness, 0, 0]} rotation={[0, 0.35, 0]}>
        <mesh
          position={[(width - frameThickness * 2) / 2, height / 2, 0]}
          castShadow
        >
          <boxGeometry args={[width - frameThickness * 2, height - frameThickness, leafThickness]} />
          <meshStandardMaterial
            color={isSelected ? '#D47343' : isHovered ? '#8D5B34' : '#6B4728'}
            roughness={0.38}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>

        {/* Brushed Brass / Gold Vertical Architectural Pull Handle */}
        {!wireframe && (
          <mesh
            position={[(width - frameThickness * 2) * 0.82, height * 0.48, leafThickness / 2 + 0.02]}
            castShadow
          >
            <cylinderGeometry args={[0.012, 0.012, 0.65, 12]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.88} />
          </mesh>
        )}
      </group>
    </group>
  );
}
