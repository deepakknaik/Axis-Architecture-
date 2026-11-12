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

  const frameColor = isSelected ? '#D47343' : isHovered ? '#475569' : '#181B20'; // Modern anodized dark aluminum

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
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.85} wireframe={wireframe} />
      </mesh>
      {/* Top Header */}
      <mesh position={[0, h - frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[w, frameThickness, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.85} wireframe={wireframe} />
      </mesh>
      {/* Left Jamb */}
      <mesh position={[-w / 2 + frameThickness / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.85} wireframe={wireframe} />
      </mesh>
      {/* Right Jamb */}
      <mesh position={[w / 2 - frameThickness / 2, h / 2, 0]} castShadow>
        <boxGeometry args={[frameThickness, h, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.85} wireframe={wireframe} />
      </mesh>
      {/* Center Mullion if wide */}
      {w > 1.2 && (
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[frameThickness * 0.8, h, frameDepth * 0.9]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.85} wireframe={wireframe} />
        </mesh>
      )}

      {/* 2. Double-Glazed Architectural Reflective Pane (Matching Reference Panel 1) */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w - frameThickness * 2, h - frameThickness * 2, 0.012]} />
        <meshPhysicalMaterial
          color="#D8EDF8"
          roughness={0.04}
          metalness={0.06}
          transmission={0.68}
          ior={1.52}
          reflectivity={0.95}
          clearcoat={0.9}
          clearcoatRoughness={0.05}
          transparent={true}
          opacity={0.42}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Window Security Grill Bars (Multi-pane security grid casting realistic room shadows) */}
      {!wireframe && (
        <group position={[0, h / 2, 0.012]}>
          {/* Vertical security bars */}
          {[-0.35, -0.175, 0, 0.175, 0.35].map((relX, idx) => (
            <mesh
              key={`grill-v-${idx}`}
              position={[relX * (w - frameThickness * 2), 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.007, 0.007, h - frameThickness * 2, 8]} />
              <meshStandardMaterial color="#EAEAEA" roughness={0.35} metalness={0.7} />
            </mesh>
          ))}
          {/* Horizontal security crossbars */}
          {[-0.28, 0, 0.28].map((relY, idx) => (
            <mesh
              key={`grill-h-${idx}`}
              position={[0, relY * (h - frameThickness * 2), 0]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[0.007, 0.007, w - frameThickness * 2, 8]} />
              <meshStandardMaterial color="#EAEAEA" roughness={0.35} metalness={0.7} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
