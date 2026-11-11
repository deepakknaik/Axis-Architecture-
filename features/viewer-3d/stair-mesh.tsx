'use client';

import * as React from 'react';
import { Stair3D } from '@/lib/reconstruction/types';

export interface StairMeshProps {
  stair: Stair3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

export function StairMesh({
  stair,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: StairMeshProps) {
  const stepsData = React.useMemo(() => {
    const dx = stair.endPoint.x - stair.startPoint.x;
    const dz = stair.endPoint.z - stair.startPoint.z;
    const totalDist = Math.max(0.1, Math.hypot(dx, dz));
    const angle = Math.atan2(dz, dx);
    const count = Math.max(1, stair.riserCount || stair.steps?.length || 12);
    const stepLength = totalDist / count;
    const stepHeight = stair.totalRiseMeters / count;

    const steps = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const x = stair.startPoint.x + dx * t;
      const z = stair.startPoint.z + dz * t;
      const y = stair.startPoint.y + stepHeight * (i + 0.5);

      steps.push({
        id: `step-${i}`,
        position: [x, y, z] as [number, number, number],
        length: stepLength,
        width: stair.widthMeters,
        height: stepHeight,
        rotationY: -angle,
      });
    }
    return { steps, angle };
  }, [stair]);

  const materialProps = React.useMemo(() => {
    if (isSelected) {
      return {
        color: '#D47343',
        roughness: 0.6,
        metalness: 0.1,
      };
    }
    if (isHovered) {
      return {
        color: '#D8D4CA',
        roughness: 0.7,
        metalness: 0.05,
      };
    }
    return {
      color: '#C7C2B6', // Warm architectural stone / precast concrete
      roughness: 0.85,
      metalness: 0.05,
    };
  }, [isSelected, isHovered]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(stair.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(stair.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {stepsData.steps.map((s) => (
        <mesh
          key={s.id}
          position={s.position}
          rotation={[0, s.rotationY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[s.length, s.height, s.width]} />
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
