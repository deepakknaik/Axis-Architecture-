'use client';

import * as React from 'react';
import * as THREE from 'three';
import { BuildingModel } from '@/lib/reconstruction/types';
import { SolarParameters } from '@/lib/reconstruction/solar-types';

export interface ArchitecturalLightingProps {
  model: BuildingModel;
  isWalkthrough?: boolean;
  solarParams?: SolarParameters;
}

/**
 * Procedural Warm Architectural Lighting Subsystem (Matching Reference Panels 1, 2, 3)
 * Features:
 * - Soffit eave downlights under the entrance porch ceiling
 * - Pathway landscape bollard lights with warm ground light pools
 * - Interior warm cove / downlight ambiance for furnished living spaces
 */
export function ArchitecturalLighting({
  model,
  isWalkthrough = false,
  solarParams,
}: ArchitecturalLightingProps) {
  const mult = solarParams ? solarParams.artificialMultiplier : 1.0;
  const { boundingBox, dimensions } = model;
  const cx = (boundingBox.min.x + boundingBox.max.x) / 2;
  const cz = (boundingBox.min.z + boundingBox.max.z) / 2;
  const maxZ = boundingBox.max.z;
  const minX = boundingBox.min.x;
  const maxX = boundingBox.max.x;

  // Front porch ceiling elevation (approx 3.0m on ground floor)
  const porchCeilingY = 2.95;

  // Soffit downlight positions under the front entrance porch & eaves
  const soffitLightPositions: Array<[number, number, number]> = [
    [cx - 1.6, porchCeilingY, maxZ + 0.6],
    [cx, porchCeilingY, maxZ + 0.6],
    [cx + 1.6, porchCeilingY, maxZ + 0.6],
    [cx - 2.8, porchCeilingY, maxZ - 0.2],
    [cx + 2.8, porchCeilingY, maxZ - 0.2],
  ];

  // Pathway & garden landscape light positions along front steps & planters
  const pathwayLightPositions: Array<[number, number, number]> = [
    [cx - 2.2, -0.15, maxZ + 2.4],
    [cx + 2.2, -0.15, maxZ + 2.4],
    [cx - 2.6, -0.15, maxZ + 4.2],
    [cx + 2.6, -0.15, maxZ + 4.2],
    [minX + 0.8, -0.15, maxZ + 1.4],
    [maxX - 0.8, -0.15, maxZ + 1.4],
  ];

  return (
    <group>
      {/* 1. Warm Soffit Downlights (Porch & Eaves) */}
      {soffitLightPositions.map(([lx, ly, lz], idx) => (
        <group key={`soffit-light-${idx}`} position={[lx, ly, lz]}>
          {/* Recessed Fixture Trim Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.07, 0.11, 16]} />
            <meshStandardMaterial color="#2B3038" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Glowing Emissive LED Lens */}
          <mesh position={[0, -0.01, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color="#FFE4B5"
              emissive="#FFB74D"
              emissiveIntensity={2.4}
              roughness={0.2}
            />
          </mesh>

          {/* Downward Warm Spotlight Pool */}
          <spotLight
            position={[0, -0.05, 0]}
            target-position={[0, -3.0, 0]}
            color="#FFD699"
            intensity={(isWalkthrough ? 1.6 : 2.4) * mult}
            distance={5.5}
            angle={Math.PI / 3.8}
            penumbra={0.65}
            decay={1.8}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
        </group>
      ))}

      {/* 2. Front Pathway & Landscape Bollard Lights (Matching Reference Panel 1) */}
      {pathwayLightPositions.map(([bx, by, bz], idx) => (
        <group key={`bollard-${idx}`} position={[bx, by, bz]}>
          {/* Black Architectural Bollard Post */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.44, 12]} />
            <meshStandardMaterial color="#1E232A" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Luminous Warm Light Chamber */}
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
            <meshStandardMaterial
              color="#FFA726"
              emissive="#FF9800"
              emissiveIntensity={2.8 * Math.min(2.0, mult)}
            />
          </mesh>

          {/* Bollard Top Cap */}
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.055, 0.045, 0.03, 12]} />
            <meshStandardMaterial color="#1E232A" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Soft Ground Warm Glow */}
          <pointLight
            position={[0, 0.36, 0]}
            color="#FFB300"
            intensity={1.1 * mult}
            distance={2.8}
            decay={2.0}
          />
        </group>
      ))}

      {/* 3. Interior Warm Ambient Cove Lighting (Soft architectural glow through windows) */}
      <pointLight
        position={[cx - 1.5, 2.4, cz - 1.0]}
        color="#FFE0B2"
        intensity={(isWalkthrough ? 1.8 : 1.4) * mult}
        distance={9.0}
        decay={2.0}
      />
      <pointLight
        position={[cx + 1.8, 2.4, cz + 1.2]}
        color="#FFE0B2"
        intensity={(isWalkthrough ? 1.8 : 1.4) * mult}
        distance={9.0}
        decay={2.0}
      />

      {/* Upper Floor Interior Light (for Multi-Storey models) */}
      {model.floors.length > 1 && (
        <pointLight
          position={[cx, 5.4, cz]}
          color="#FFE0B2"
          intensity={1.2 * mult}
          distance={10.0}
          decay={2.0}
        />
      )}
    </group>
  );
}
