'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { Room3D } from '@/lib/reconstruction/types';

export interface RoomMeshProps {
  room: Room3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
}

export function RoomMesh({
  room,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}: RoomMeshProps) {
  // Construct Three.Shape from room boundary polygon
  const { shape, linePoints } = React.useMemo(() => {
    const poly = room.boundaryPolygon || [];
    if (poly.length < 3) {
      return { shape: null, linePoints: [] };
    }

    const s = new THREE.Shape();
    s.moveTo(poly[0].x, poly[0].z);
    for (let i = 1; i < poly.length; i++) {
      s.lineTo(poly[i].x, poly[i].z);
    }
    s.closePath();

    const pts: [number, number, number][] = poly.map((p) => [
      p.x,
      (p.y || 0) + 0.02,
      p.z,
    ]);
    pts.push([poly[0].x, (poly[0].y || 0) + 0.02, poly[0].z]);

    return { shape: s, linePoints: pts };
  }, [room.boundaryPolygon]);

  // Architectural Floor Finish based on Space Type
  const materialProps = React.useMemo(() => {
    if (isSelected) {
      return { color: '#D47343', roughness: 0.6, metalness: 0.1 };
    }
    if (isHovered) {
      return { color: '#E4DDD2', roughness: 0.6, metalness: 0.05 };
    }

    const fn = room.roomFunction;
    const name = (room.name || '').toLowerCase();

    // 1. Warm timber parquet for bedrooms
    if (fn === 'BEDROOM' || name.includes('bed')) {
      return { color: '#B98B5C', roughness: 0.72, metalness: 0.02 };
    }
    // 2. Glazed ceramic tile for bathrooms
    if (
      fn === 'BATHROOM' ||
      name.includes('bath') ||
      name.includes('wc') ||
      name.includes('toilet')
    ) {
      return { color: '#C2D2DA', roughness: 0.38, metalness: 0.08 };
    }
    // 3. Honed quartz/terrazzo for kitchen
    if (fn === 'KITCHEN' || name.includes('kitchen')) {
      return { color: '#CAC7BE', roughness: 0.55, metalness: 0.04 };
    }
    // 4. Textured stone for porch / balcony / terrace
    if (
      fn === 'BALCONY' ||
      name.includes('porch') ||
      name.includes('terrace') ||
      name.includes('balcony')
    ) {
      return { color: '#B8B3A8', roughness: 0.8, metalness: 0.02 };
    }
    // 5. Architectural concrete/light wood for living / dining / hallway
    if (fn === 'LIVING' || name.includes('living')) {
      return { color: '#C8A882', roughness: 0.7, metalness: 0.02 };
    }
    if (fn === 'DINING' || name.includes('dining')) {
      return { color: '#D2CCC3', roughness: 0.65, metalness: 0.02 };
    }

    // Default architectural floor finish
    return { color: '#DDD8CE', roughness: 0.75, metalness: 0.02 };
  }, [isSelected, isHovered, room.roomFunction, room.name]);

  if (!shape) return null;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(room.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(room.id);
      }}
      onPointerOut={() => onHover?.(null)}
    >
      {/* Floor Polygon Fill (rotated -90deg X to lay flat) */}
      <mesh
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color={materialProps.color}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          depthWrite={true}
        />
      </mesh>

      {/* Perimeter Line using @react-three/drei Line */}
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color={isSelected ? '#D47343' : isHovered ? '#A89E90' : '#4A463F'}
          lineWidth={isSelected ? 2 : 1}
          transparent
          opacity={isSelected ? 0.9 : 0.35}
        />
      )}

      {/* Room Centroid Label Badge */}
      {(isSelected || isHovered) && (
        <Html
          position={[room.centroid.x, 0.35, room.centroid.z]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`px-2 py-0.5 rounded font-mono text-[10px] whitespace-nowrap shadow-md transition-all ${
              isSelected
                ? 'bg-axis-terracotta text-white font-bold border border-amber-300'
                : 'bg-stone-900/85 text-stone-200 border border-stone-700 font-medium'
            }`}
          >
            <span>{room.name}</span>
            <span className="opacity-80 ml-1.5 font-normal">
              {room.areaSqMeters.toFixed(1)} m²
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
