'use client';

import * as React from 'react';
import * as THREE from 'three';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface RoofMeshProps {
  model: BuildingModel;
  visible?: boolean;
  wireframe?: boolean;
  activeFloorId?: string | 'ALL';
  isExplodedView?: boolean;
}

export function RoofMesh({
  model,
  visible = true,
  wireframe = false,
  activeFloorId = 'ALL',
  isExplodedView = false,
}: RoofMeshProps) {
  const roofGeometry = React.useMemo(() => {
    const { dimensions } = model;
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

  // In multi-floor models, if inspecting Ground Floor or any non-top floor, do not render exterior roof
  const isSingleLowerFloor = Boolean(
    activeFloorId &&
    activeFloorId !== 'ALL' &&
    model.floors.length > 1 &&
    model.floors.findIndex((f) => f.id === activeFloorId) < model.floors.length - 1
  );
  if (isSingleLowerFloor) {
    return null;
  }

  // Calculate highest top elevation across all floors to place roof on top floor
  const topElevation = Math.max(
    model.boundingBox.max.y,
    ...model.floors.map((f) => (f.elevationMeters || 0) + (f.heightMeters || 3.0))
  );

  const explodedOffset = isExplodedView && activeFloorId === 'ALL' ? model.floors.length * 2.2 : 0;
  const baseElevation = topElevation + explodedOffset;
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
          color="#282D36"
          roughness={0.65}
          metalness={0.18}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
      </mesh>

      {/* Fascia / Eave Trim Line */}
      <mesh position={[0, -ridgeHeight / 2 + 0.04, 0]}>
        <boxGeometry args={[dimensions.widthMeters + 1.05, 0.08, dimensions.depthMeters + 1.05]} />
        <meshStandardMaterial color="#17191E" roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  );
}
