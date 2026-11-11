'use client';

import * as React from 'react';
import { Line } from '@react-three/drei';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface ExplodedGuideLinesProps {
  model: BuildingModel;
  visible?: boolean;
}

/**
 * Renders dashed architectural vertical alignment cords and corner nodes
 * between stacked floor slabs in Exploded Axonometric View (Matching Reference Panel 5).
 */
export function ExplodedGuideLines({ model, visible = true }: ExplodedGuideLinesProps) {
  if (!visible || model.floors.length < 2) return null;

  const minX = model.boundingBox.min.x;
  const maxX = model.boundingBox.max.x;
  const minZ = model.boundingBox.min.z;
  const maxZ = model.boundingBox.max.z;

  const corners: Array<[number, number]> = [
    [minX, minZ],
    [maxX, minZ],
    [maxX, maxZ],
    [minX, maxZ],
  ];

  // In exploded mode, floor 0 is at Y=0, floor 1 is lifted by 2.2m, roof is lifted by floors.length * 2.2m
  const floorCount = model.floors.length;
  const topExplodedElevation = 6.0 + floorCount * 2.2;

  return (
    <group>
      {corners.map(([cx, cz], idx) => {
        const p1: [number, number, number] = [cx, 0, cz];
        const p2: [number, number, number] = [cx, topExplodedElevation, cz];

        return (
          <group key={`corner-cord-${idx}`}>
            {/* Dashed Vertical Guide Cord using Drei Line */}
            <Line
              points={[p1, p2]}
              color="#F59E0B"
              lineWidth={1.5}
              dashed
              dashSize={0.25}
              gapSize={0.18}
            />

            {/* Ground Floor Corner Node */}
            <mesh position={[cx, 0.05, cz]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
            </mesh>

            {/* First Floor Corner Node (FFL 3.0m + Exploded 2.2m = 5.2m) */}
            <mesh position={[cx, 3.0 + 2.2, cz]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#60A5FA" emissive="#3B82F6" emissiveIntensity={0.5} />
            </mesh>

            {/* Roof Slab Corner Node */}
            <mesh position={[cx, topExplodedElevation, cz]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
