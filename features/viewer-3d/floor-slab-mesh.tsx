'use client';

import * as React from 'react';
import * as THREE from 'three';
import { FloorSlab3D } from '@/lib/reconstruction/types';

export interface FloorSlabMeshProps {
  slab: FloorSlab3D;
  wireframe?: boolean;
}

export function FloorSlabMesh({ slab, wireframe = false }: FloorSlabMeshProps) {
  // Memoize ExtrudeGeometry from footprint polygon points
  const geometry = React.useMemo(() => {
    const shape = new THREE.Shape();
    const pts = slab.footprintPolygon;
    if (pts.length < 3) return new THREE.BoxGeometry(10, 0.2, 12);

    shape.moveTo(pts[0].x, pts[0].z);
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i].x, pts[i].z);
    }
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: slab.thicknessMeters,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Extrude creates geometry along Z, so rotate to lie on XZ plane
    geom.rotateX(Math.PI / 2);
    // Position vertically so top aligns with Y=0
    geom.translate(0, slab.elevationMeters, 0);
    return geom;
  }, [slab]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#E2DDD5"
        roughness={0.9}
        metalness={0.05}
        wireframe={wireframe}
      />
    </mesh>
  );
}
