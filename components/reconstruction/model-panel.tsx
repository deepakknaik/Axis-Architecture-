'use client';

import * as React from 'react';
import {
  Layers,
  Building2,
  DoorOpen,
  Maximize2,
  Footprints,
  Eye,
  EyeOff,
  Check,
  Ruler,
  AlertTriangle,
  Info,
  ChevronRight,
  Focus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingModel, Room3D, BuildingFloor } from '@/lib/reconstruction/types';
import {
  CategoryVisibilityState,
  DEFAULT_CATEGORY_VISIBILITY,
} from '@/lib/reconstruction/interaction-types';

export interface ModelPanelProps {
  model: BuildingModel;
  activeFloorId: string | 'ALL';
  onFloorChange: (floorId: string | 'ALL') => void;
  fadeNonSelectedFloors: boolean;
  onToggleFadeFloors: () => void;
  categoryVisibility: CategoryVisibilityState;
  onToggleCategory: (category: keyof CategoryVisibilityState) => void;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onFocusRoom: (room: Room3D) => void;
  onStartWalkthroughFromRoom: (room: Room3D) => void;
  className?: string;
}

export function ModelPanel({
  model,
  activeFloorId,
  onFloorChange,
  fadeNonSelectedFloors,
  onToggleFadeFloors,
  categoryVisibility,
  onToggleCategory,
  selectedRoomId,
  onSelectRoom,
  onFocusRoom,
  onStartWalkthroughFromRoom,
  className = '',
}: ModelPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'floors' | 'layers' | 'rooms' | 'audit'>('floors');

  const { dimensions, floors, assumptions, warnings } = model;
  const currentFloor = floors.find((f) => f.id === activeFloorId) || floors[0];
  const allRooms = React.useMemo(() => {
    if (activeFloorId === 'ALL') {
      return floors.flatMap((f) => f.rooms || []);
    }
    return currentFloor?.rooms || [];
  }, [floors, activeFloorId, currentFloor]);

  return (
    <div className={`flex flex-col h-full bg-stone-50 border-r border-axis-border text-xs ${className}`}>
      {/* Tab Switcher Header */}
      <div className="flex-none p-2 border-b border-axis-border bg-white grid grid-cols-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('floors')}
          className={`py-1.5 text-center font-mono text-[11px] rounded transition-colors ${
            activeTab === 'floors'
              ? 'bg-axis-terracotta text-white font-semibold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Floors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`py-1.5 text-center font-mono text-[11px] rounded transition-colors ${
            activeTab === 'layers'
              ? 'bg-axis-terracotta text-white font-semibold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Layers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className={`py-1.5 text-center font-mono text-[11px] rounded transition-colors ${
            activeTab === 'rooms'
              ? 'bg-axis-terracotta text-white font-semibold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Rooms ({allRooms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`py-1.5 text-center font-mono text-[11px] rounded transition-colors ${
            activeTab === 'audit'
              ? 'bg-axis-terracotta text-white font-semibold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Audit
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* 1. FLOORS TAB */}
        {activeTab === 'floors' && (
          <div className="space-y-3">
            <Card className="bg-white border-axis-border p-3 space-y-2">
              <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
                Floor Isolation & Level Control
              </span>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onFloorChange('ALL')}
                  className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors font-mono text-xs ${
                    activeFloorId === 'ALL'
                      ? 'bg-axis-terracotta/10 text-axis-terracotta border border-axis-terracotta font-semibold'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>All Floors (Full Envelope)</span>
                  <span className="text-[10px] opacity-75">{floors.length} levels</span>
                </button>

                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => onFloorChange(floor.id)}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors font-mono text-xs ${
                      activeFloorId === floor.id
                        ? 'bg-axis-terracotta/10 text-axis-terracotta border border-axis-terracotta font-semibold'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span>{floor.name}</span>
                    <span className="text-[10px] opacity-75">
                      +{floor.elevationMeters.toFixed(2)}m
                    </span>
                  </button>
                ))}
              </div>

              {/* Floor Fade Toggle */}
              {floors.length > 1 && (
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] text-stone-600">Fade Non-Selected Floors:</span>
                  <button
                    type="button"
                    onClick={onToggleFadeFloors}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      fadeNonSelectedFloors
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}
                  >
                    {fadeNonSelectedFloors ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              )}
            </Card>

            {/* Quick Floor Metrics */}
            <Card className="bg-white border-axis-border p-3 space-y-2 text-[11px]">
              <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
                Active Level Primitives
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200 flex justify-between">
                  <span>Walls:</span>
                  <span className="font-bold text-stone-900">{currentFloor.walls.length}</span>
                </div>
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200 flex justify-between">
                  <span>Doors:</span>
                  <span className="font-bold text-stone-900">{currentFloor.doors.length}</span>
                </div>
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200 flex justify-between">
                  <span>Windows:</span>
                  <span className="font-bold text-stone-900">{currentFloor.windows.length}</span>
                </div>
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200 flex justify-between">
                  <span>Columns:</span>
                  <span className="font-bold text-stone-900">{currentFloor.columns.length}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 2. LAYERS / CATEGORY VISIBILITY TAB */}
        {activeTab === 'layers' && (
          <Card className="bg-white border-axis-border p-3 space-y-2">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
              Architectural Layer Toggles
            </span>
            <div className="space-y-1">
              {(
                [
                  ['walls', 'Walls (Structural & Partitions)'],
                  ['doors', 'Doors & Clear Openings'],
                  ['windows', 'Windows & Fenestrations'],
                  ['rooms', 'Room Boundary Highlights'],
                  ['columns', 'Columns & RC Piers'],
                  ['stairs', 'Stairs & Risers'],
                  ['floors', 'Floor Slabs'],
                  ['dimensions', 'Real-Scale 3D Dimensions'],
                ] as const
              ).map(([catKey, label]) => {
                const isVis = categoryVisibility[catKey];
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => onToggleCategory(catKey)}
                    className="w-full flex items-center justify-between p-2 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-colors"
                  >
                    <span className="text-stone-800 text-xs">{label}</span>
                    <span
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold border ${
                        isVis
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-200 text-stone-500 border-stone-300'
                      }`}
                    >
                      {isVis ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isVis ? 'ON' : 'OFF'}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* 3. ROOMS TAB */}
        {activeTab === 'rooms' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block px-1">
              Verified Spatial Volumes ({allRooms.length})
            </span>

            {allRooms.map((room) => {
              const isSel = selectedRoomId === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-axis-terracotta/10 border-axis-terracotta shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-xs">{room.name}</span>
                    <span className="font-mono text-[10px] text-axis-terracotta font-bold">
                      {room.areaSqMeters.toFixed(1)} m²
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mt-1">
                    <span>
                      {room.dimensions.widthMeters.toFixed(1)}m × {room.dimensions.depthMeters.toFixed(1)}m
                    </span>
                    <span>H: {room.dimensions.heightMeters.toFixed(1)}m</span>
                  </div>

                  {/* Actions: Focus Room & Enter Walkthrough From Here */}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-200/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocusRoom(room);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] transition-colors"
                    >
                      <Focus className="w-3 h-3" />
                      <span>Focus</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartWalkthroughFromRoom(room);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-axis-terracotta hover:bg-[#b85d32] text-white font-mono text-[10px] transition-colors"
                    >
                      <Footprints className="w-3 h-3" />
                      <span>Walkthrough</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. AUDIT & EXTENTS TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            {/* Dimensions */}
            <Card className="bg-white border-axis-border p-3 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
                Envelope Dimensions
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-[9px] text-stone-500 block">Width (X)</span>
                  <span className="font-bold text-stone-900">{dimensions.widthMeters.toFixed(2)}m</span>
                </div>
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-[9px] text-stone-500 block">Depth (Z)</span>
                  <span className="font-bold text-stone-900">{dimensions.depthMeters.toFixed(2)}m</span>
                </div>
                <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-[9px] text-stone-500 block">Height (Y)</span>
                  <span className="font-bold text-stone-900">{dimensions.heightMeters.toFixed(2)}m</span>
                </div>
              </div>
              <div className="pt-1 border-t border-stone-200 flex justify-between text-[11px]">
                <span className="text-stone-500">Gross Floor Area:</span>
                <span className="font-mono font-bold text-stone-900">{dimensions.grossAreaSqMeters.toFixed(1)} m²</span>
              </div>
            </Card>

            {/* Assumptions */}
            <Card className="bg-white border-axis-border p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold block">
                  Reconstruction Assumptions
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                  {assumptions.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {assumptions.map((ass, idx) => (
                  <div key={idx} className="p-2 rounded bg-stone-50 border border-stone-200 font-mono text-[10px] space-y-0.5">
                    <div className="flex justify-between font-bold text-stone-700">
                      <span>{ass.type}</span>
                      <span className="text-axis-terracotta">{ass.assumedValue} {ass.unit}</span>
                    </div>
                    <p className="text-stone-500 font-sans text-[10px]">{ass.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Warnings */}
            {warnings.length > 0 && (
              <Card className="bg-amber-50/50 border-amber-200 p-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Warnings ({warnings.length})</span>
                </div>
                <div className="space-y-1">
                  {warnings.map((w, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-white border border-amber-200 text-amber-900 text-[10px] font-mono">
                      <span className="font-bold">{w.code}:</span> {w.message}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
