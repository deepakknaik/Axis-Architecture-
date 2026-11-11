'use client';

import * as React from 'react';
import * as THREE from 'three';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface RoofMeshProps {
  model: BuildingModel;
  visible?: boolean;
  wireframe?: boolean;
}

export function RoofMesh({
  model,
  visible = true,
  wireframe = false,
}: RoofMeshProps) {
  const roofGeometry = React.useMemo(() => {
    const { boundingBox, dimensions } = model;
    const overhang = 0.5; // 0.5m architectural eave overhang
    const roofWidth = dimensions.widthMeters + overhang * 2;
    const roofDepth = dimensions.depthMeters + overhang * 2;
    const ridgeHeight = Math.min(2.2, Math.max(1.4, dimensions.depthMeters * 0.22)); // Proportional pitch

    // Gable profile shape across the depth (Z-axis)
    const halfDepth = roofDepth / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-halfDepth, 0);
    shape.lineTo(halfDepth, 0);
    shape.lineTo(0, ridgeHeight);
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: roofWidth,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 1,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry so it can be cleanly placed
    geom.center();
    return geom;
  }, [model]);

  if (!visible) return null;

  const baseElevation = model.boundingBox.max.y;
  const centerX = (model.boundingBox.min.x + model.boundingBox.max.x) / 2;
  const centerZ = (model.boundingBox.min.z + model.boundingBox.max.z) / 2;
  const { dimensions } = model;
  const ridgeHeight = Math.min(2.2, Math.max(1.4, dimensions.depthMeters * 0.22));

  return (
    <group position={[centerX, baseElevation + ridgeHeight / 2, centerZ]}>
      {/* Pitched Roof Mesh (Rotated 90 deg so ridge runs along X-axis) */}
      <mesh
        geometry={roofGeometry}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#3A414B"
          roughness={0.82}
          metalness={0.12}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Fascia / Eave Trim Line */}
      <mesh position={[0, -ridgeHeight / 2 + 0.04, 0]}>
        <boxGeometry args={[dimensions.widthMeters + 1.05, 0.08, dimensions.depthMeters + 1.05]} />
        <meshStandardMaterial color="#22272E" roughness={0.7} />
      </mesh>
    </group>
  );
}
