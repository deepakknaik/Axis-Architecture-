'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BuildingFloor } from '@/lib/reconstruction/types';

export interface InteriorCeilingMeshProps {
  floor: BuildingFloor;
  visible?: boolean;
}

// Animated 3-Blade Ceiling Fan Component
function RoomCeilingFan({ position }: { position: [number, number, number] }) {
  const fanBladesRef = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 4.5; // Natural smooth fan rotation
    }
  });

  return (
    <group position={position}>
      {/* Downrod */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.36, 12]} />
        <meshStandardMaterial color="#4A4E54" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Motor Housing */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.07, 16]} />
        <meshStandardMaterial color="#363A40" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Rotating Blades Group */}
      <group ref={fanBladesRef} position={[0, 0.02, 0]}>
        {[0, 120, 240].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={deg} rotation={[0, rad, 0]}>
              <mesh position={[0.3, 0, 0]} rotation={[0.08, 0, 0]}>
                <boxGeometry args={[0.54, 0.008, 0.12]} />
                <meshStandardMaterial color="#3C2A1E" roughness={0.5} metalness={0.1} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* Subtle Warm Downlight Glow */}
      <pointLight color="#FFF3DD" intensity={0.4} distance={4.5} decay={2} position={[0, -0.05, 0]} />
    </group>
  );
}

export function InteriorCeilingMesh({ floor, visible = true }: InteriorCeilingMeshProps) {
  if (!visible) return null;

  const floorElev = floor.elevationMeters || 0;
  const ceilingHeight = floor.heightMeters || 3.0;
  const ceilingY = floorElev + ceilingHeight;

  // Memoize ceiling slab geometry from floor slab footprint
  const ceilingGeometry = React.useMemo(() => {
    const pts = floor.slab?.footprintPolygon;
    if (!pts || pts.length < 3) return null;

    const shape = new THREE.Shape();
    shape.moveTo(pts[0].x, pts[0].z);
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i].x, pts[i].z);
    }
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.12,
      bevelEnabled: false,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Extrude builds along Z, so rotate to lie on XZ plane
    geom.rotateX(Math.PI / 2);
    geom.translate(0, ceilingY, 0);
    return geom;
  }, [floor.slab, ceilingY]);

  return (
    <group>
      {/* 1. Overhead Ceiling Undersurface Slab */}
      {ceilingGeometry && (
        <mesh geometry={ceilingGeometry} receiveShadow>
          <meshStandardMaterial
            color="#FAF8F5" // Crisp off-white gypsum plaster ceiling
            roughness={0.92}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 2. Ceiling Fans in Living Rooms & Bedrooms */}
      {(floor.rooms || []).map((room) => {
        const fn = room.roomFunction;
        const name = (room.name || '').toLowerCase();
        const hasFan =
          fn === 'BEDROOM' ||
          fn === 'LIVING' ||
          name.includes('bed') ||
          name.includes('living') ||
          name.includes('hall');

        if (!hasFan) return null;

        return (
          <RoomCeilingFan
            key={`fan-${room.id}`}
            position={[room.centroid.x, ceilingY - 0.36, room.centroid.z]}
          />
        );
      })}
    </group>
  );
}
