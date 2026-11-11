'use client';

import * as React from 'react';
import * as THREE from 'three';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface SiteEnvironmentProps {
  model: BuildingModel;
  isWalkthrough?: boolean;
}

export function SiteEnvironment({
  model,
  isWalkthrough = false,
}: SiteEnvironmentProps) {
  const { boundingBox, dimensions } = model;
  const cx = (boundingBox.min.x + boundingBox.max.x) / 2;
  const cz = (boundingBox.min.z + boundingBox.max.z) / 2;
  const minZ = boundingBox.min.z;
  const maxZ = boundingBox.max.z;
  const minX = boundingBox.min.x;
  const maxX = boundingBox.max.x;
  const w = dimensions.widthMeters;
  const d = dimensions.depthMeters;

  const PLINTH_HEIGHT = 0.4;
  const GY = -PLINTH_HEIGHT;

  return (
    <group>
      {/* 1. Atmospheric Sky & Fog */}
      <color attach="background" args={['#dde7ee']} />
      <fog attach="fog" args={['#dde7ee', 40, 125]} />

      {/* 2. Soft Sage Green Landscaped Ground Plane */}
      <mesh
        position={[cx, GY - 0.005, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[95, 95]} />
        <meshStandardMaterial
          color="#ADBFA7"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Concrete Building Plinth Foundation (Elevates house 0.4m above site lawn) */}
      <mesh
        position={[cx, GY + PLINTH_HEIGHT / 2, cz]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w + 0.6, PLINTH_HEIGHT, d + 0.6]} />
        <meshStandardMaterial
          color="#CFCAC0"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* 4. Front Porch Plinth & Concrete Steps (Front Entrance at maxZ) */}
      <group position={[cx, 0, maxZ]}>
        {/* Extended Porch Plinth Platform */}
        <mesh
          position={[0, GY + PLINTH_HEIGHT / 2, 0.9]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[Math.min(5.2, Math.max(4.2, w * 0.35)), PLINTH_HEIGHT, 1.8]} />
          <meshStandardMaterial color="#CFCAC0" roughness={0.85} />
        </mesh>

        {/* Porch Stone Tile Finish */}
        <mesh
          position={[0, 0.015, 0.9]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[Math.min(5.16, Math.max(4.16, w * 0.35 - 0.04)), 1.76]} />
          <meshStandardMaterial color="#B8B3A8" roughness={0.7} />
        </mesh>

        {/* Step 1 */}
        <mesh
          position={[0, GY + 0.26 / 2, 1.8 + 0.2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[Math.min(4.8, Math.max(3.8, w * 0.32)), 0.26, 0.4]} />
          <meshStandardMaterial color="#C8C3B8" roughness={0.85} />
        </mesh>

        {/* Step 2 */}
        <mesh
          position={[0, GY + 0.13 / 2, 1.8 + 0.58]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[Math.min(4.8, Math.max(3.8, w * 0.32)), 0.13, 0.4]} />
          <meshStandardMaterial color="#C8C3B8" roughness={0.85} />
        </mesh>

        {/* Front Entrance Pathway */}
        <mesh
          position={[0, GY + 0.01, 1.8 + 0.78 + 3.0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[2.2, 6.0]} />
          <meshStandardMaterial color="#BDB8AE" roughness={0.92} />
        </mesh>
      </group>

      {/* 5. Architectural Landscaping Planters with Trees at Front Corners */}
      {[
        [minX + 1.2, maxZ + 0.8],
        [maxX - 1.2, maxZ + 0.8],
      ].map(([px, pz], idx) => (
        <group key={`planter-${idx}`} position={[px, GY, pz]}>
          {/* Concrete Planter Box */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.4, 1.0]} />
            <meshStandardMaterial color="#B9B3A7" roughness={0.85} />
          </mesh>
          {/* Organic Topsoil */}
          <mesh position={[0, 0.39, 0]}>
            <boxGeometry args={[1.7, 0.04, 0.9]} />
            <meshStandardMaterial color="#4A3A2C" roughness={0.99} />
          </mesh>
          {/* Tree Trunk */}
          <mesh position={[-0.45, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 1.3, 12]} />
            <meshStandardMaterial color="#6B4F35" roughness={0.85} />
          </mesh>
          {/* Foliage Canopy Clusters */}
          <mesh position={[-0.45, 1.8, 0]} castShadow>
            <sphereGeometry args={[0.62, 14, 12]} />
            <meshStandardMaterial color="#47734C" roughness={0.85} />
          </mesh>
          <mesh position={[-0.35, 2.1, 0.1]} castShadow>
            <sphereGeometry args={[0.42, 12, 10]} />
            <meshStandardMaterial color="#55855A" roughness={0.85} />
          </mesh>
          <mesh position={[-0.6, 1.6, -0.1]} castShadow>
            <sphereGeometry args={[0.38, 12, 10]} />
            <meshStandardMaterial color="#3D6642" roughness={0.85} />
          </mesh>
          {/* Low Ground Cover Shrub */}
          <mesh position={[0.4, 0.55, 0]} castShadow>
            <sphereGeometry args={[0.28, 10, 8]} />
            <meshStandardMaterial color="#6A9456" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.52, 0.15]} castShadow>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color="#507B46" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
