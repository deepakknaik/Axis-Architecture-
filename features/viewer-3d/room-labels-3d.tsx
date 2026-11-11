'use client';

import * as React from 'react';
import { Html } from '@react-three/drei';
import { Room3D, BuildingFloor } from '@/lib/reconstruction/types';

export interface RoomLabels3DProps {
  floors: BuildingFloor[];
  activeFloorId?: string | 'ALL';
  visible?: boolean;
  selectedRoomId?: string | null;
  onSelectRoom?: (roomId: string) => void;
}

export function RoomLabels3D({
  floors,
  activeFloorId = 'ALL',
  visible = true,
  selectedRoomId,
  onSelectRoom,
}: RoomLabels3DProps) {
  if (!visible) return null;

  const activeRooms = React.useMemo(() => {
    return floors.flatMap((floor) => {
      if (activeFloorId !== 'ALL' && floor.id !== activeFloorId) return [];
      return (floor.rooms || []).map((r) => ({
        ...r,
        elevation: floor.elevationMeters || 0,
      }));
    });
  }, [floors, activeFloorId]);

  return (
    <group>
      {activeRooms.map((room) => {
        const isSelected = selectedRoomId === room.id;
        const width = room.dimensions?.widthMeters ? room.dimensions.widthMeters.toFixed(1) : '-';
        const depth = room.dimensions?.depthMeters ? room.dimensions.depthMeters.toFixed(1) : '-';
        const area = room.areaSqMeters ? room.areaSqMeters.toFixed(1) : '-';

        return (
          <group
            key={`label-${room.id}`}
            position={[room.centroid.x, room.elevation + 2.25, room.centroid.z]}
          >
            <Html center distanceFactor={16}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoom?.(room.id);
                }}
                className={`group flex items-stretch overflow-hidden rounded shadow-xl backdrop-blur-md transition-all transform hover:scale-105 select-none text-left ${
                  isSelected
                    ? 'bg-stone-900 ring-2 ring-axis-terracotta ring-offset-1 ring-offset-black/40'
                    : 'bg-[#0f172a]/90 hover:bg-[#0f172a] border border-stone-700/70'
                }`}
              >
                {/* Blueprint Blue / Terracotta Accent Strip */}
                <div
                  className={`w-1.5 transition-colors ${
                    isSelected ? 'bg-axis-terracotta' : 'bg-blue-500 group-hover:bg-blue-400'
                  }`}
                />

                {/* Content Box */}
                <div className="px-2.5 py-1 font-sans">
                  <div className="text-[11px] font-bold tracking-wider uppercase text-white leading-tight">
                    {room.name}
                  </div>
                  <div className="font-mono text-[9.5px] text-stone-300 leading-tight mt-0.5">
                    {width} × {depth} m · <span className="text-blue-300">{area} m²</span>
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
