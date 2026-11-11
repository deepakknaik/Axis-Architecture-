'use client';

import * as React from 'react';
import { Column3D } from '@/lib/reconstruction/types';

export interface ColumnMeshProps {
  column: Column3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

export function ColumnMesh({
  column,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: ColumnMeshProps) {
  const centerY = column.position.y + column.heightMeters / 2;

  const materialProps = React.useMemo(() => {
    if (isSelected) {
      return {
        color: '#D47343', // AXIS Terracotta accent
        roughness: 0.5,
        metalness: 0.2,
      };
    }
    if (isHovered) {
      return {
        color: '#717572',
        roughness: 0.7,
        metalness: 0.1,
      };
    }
    // Structural reinforced concrete / slate pier
    return {
      color: '#4F5250',
      roughness: 0.85,
      metalness: 0.1,
    };
  }, [isSelected, isHovered]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(column.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(column.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      <mesh
        position={[column.position.x, centerY, column.position.z]}
        castShadow
        receiveShadow
      >
        {column.crossSectionShape === 'CIRCULAR' ? (
          <cylinderGeometry
            args={[
              column.widthMeters / 2,
              column.widthMeters / 2,
              column.heightMeters,
              24,
            ]}
          />
        ) : (
          <boxGeometry
            args={[
              column.widthMeters,
              column.heightMeters,
              column.depthMeters,
            ]}
          />
        )}
        <meshStandardMaterial
          color={materialProps.color}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
