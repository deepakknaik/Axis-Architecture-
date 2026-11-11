'use client';

import * as React from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Bed,
  Armchair,
  UtensilsCrossed,
  Bath,
  Footprints,
  Sun,
  LayoutGrid,
} from 'lucide-react';
import { Room3D, BuildingFloor } from '@/lib/reconstruction/types';

export interface RoomLabels3DProps {
  floors: BuildingFloor[];
  activeFloorId?: string | 'ALL';
  visible?: boolean;
  selectedRoomId?: string | null;
  onSelectRoom?: (roomId: string) => void;
  isExplodedView?: boolean;
}

function getRoomIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('bed')) return Bed;
  if (lower.includes('living') || lower.includes('lounge') || lower.includes('foyer')) return Armchair;
  if (lower.includes('kitchen') || lower.includes('dining')) return UtensilsCrossed;
  if (lower.includes('bath') || lower.includes('toilet') || lower.includes('wc')) return Bath;
  if (lower.includes('stair')) return Footprints;
  if (lower.includes('balcony') || lower.includes('porch') || lower.includes('patio')) return Sun;
  return LayoutGrid;
}

export function RoomLabels3D({
  floors,
  activeFloorId = 'ALL',
  visible = true,
  selectedRoomId,
  onSelectRoom,
  isExplodedView = false,
}: RoomLabels3DProps) {
  if (!visible) return null;

  const activeRooms = React.useMemo(() => {
    return floors.flatMap((floor, floorIndex) => {
      if (activeFloorId !== 'ALL' && floor.id !== activeFloorId) return [];
      const explodedY = isExplodedView && activeFloorId === 'ALL' ? floorIndex * 2.2 : 0;
      return (floor.rooms || []).map((r) => ({
        ...r,
        elevation: (floor.elevationMeters || 0) + explodedY,
      }));
    });
  }, [floors, activeFloorId, isExplodedView]);

  return (
    <group>
      {activeRooms.map((room) => {
        const isSelected = selectedRoomId === room.id;
        const width = room.dimensions?.widthMeters ? room.dimensions.widthMeters.toFixed(1) : '-';
        const depth = room.dimensions?.depthMeters ? room.dimensions.depthMeters.toFixed(1) : '-';
        const area = room.areaSqMeters ? room.areaSqMeters.toFixed(1) : '-';
        const IconComponent = getRoomIcon(room.name);
        const leaderHeight = 2.4;

        const lineTop: [number, number, number] = [0, 0, 0];
        const lineBottom: [number, number, number] = [0, -leaderHeight, 0];

        return (
          <group
            key={`label-${room.id}`}
            position={[room.centroid.x, room.elevation + leaderHeight, room.centroid.z]}
          >
            {/* 3D Architectural Leader Line from badge down to floor pin (Matching Reference Panel 2) */}
            <Line
              points={[lineTop, lineBottom]}
              color={isSelected ? '#F59E0B' : '#C79A52'}
              lineWidth={1.2}
              transparent
              opacity={isSelected ? 0.95 : 0.65}
            />

            {/* Floor Anchor Pin Disc */}
            <mesh position={[0, -leaderHeight + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.06, 0.12, 16]} />
              <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
            </mesh>

            {/* Gold Callout Badge (Matching Reference Panel 2) */}
            <Html center distanceFactor={14}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoom?.(room.id);
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-2xl backdrop-blur-md transition-all transform hover:scale-105 select-none text-left border ${
                  isSelected
                    ? 'bg-stone-950/95 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-[#12161E]/90 hover:bg-[#181F2C] border-[#D97706]/70 hover:border-amber-400'
                }`}
              >
                {/* Gold Category Icon Box */}
                <div className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Content Box */}
                <div className="font-sans whitespace-nowrap">
                  <div className="text-[11px] font-bold text-white tracking-wide leading-tight">
                    {room.name}
                  </div>
                  <div className="font-mono text-[9.5px] text-amber-200/90 leading-tight mt-0.5">
                    {width} × {depth} m · <span className="text-amber-400 font-semibold">{area} m²</span>
                  </div>
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
