'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Window3D } from '@/lib/reconstruction/types';

export interface WindowMeshProps {
  window: Window3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

export function WindowMesh({
  window: win,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: WindowMeshProps) {
  const frameThickness = 0.04;
  const frameDepth = 0.12;

  const w = win.windowWidthMeters;
  const h = win.windowHeightMeters;

  const frameColor = isSelected ? '#D47343' : isHovered ? '#605A50' : '#45413A'; // Architectural dark bronze

  return (
    <group
      position={[win.position.x, win.position.y, win.position.z]}
      rotation={[0, win.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(win.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(win.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* 1. Outer Aluminum Frame */}
      {/* Bottom Sill */}
      <mesh position={[0, frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[w, frameThickness, frameDepth + 0.04]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} wireframe={wireframe} />
      </mesh>
      {/* Top Header */}
      <mesh position={[0, h - frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[w, frameThickness, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} wireframe={wireframe} />
      </mesh>
      {/* Left Jamb */}
      <mesh position={[-w / 2 + frameThickness / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} wireframe={wireframe} />
      </mesh>
      {/* Right Jamb */}
      <mesh position={[w / 2 - frameThickness / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} wireframe={wireframe} />
      </mesh>
      {/* Center Mullion if wide */}
      {w > 1.2 && (
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[frameThickness * 0.8, h, frameDepth * 0.9]} />
          <meshStandardMaterial color={frameColor} roughness={0.5} wireframe={wireframe} />
        </mesh>
      )}

      {/* 2. Architectural Translucent Glazing Pane */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w - frameThickness * 2, h - frameThickness * 2, 0.012]} />
        <meshStandardMaterial
          color={win.sillHeightMeters >= 1.2 ? '#DFEAF0' : '#9CC7E6'}
          roughness={win.sillHeightMeters >= 1.2 ? 0.35 : 0.08}
          metalness={0.12}
          transparent={true}
          opacity={win.sillHeightMeters >= 1.2 ? 0.75 : 0.38}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
