'use client';

import * as React from 'react';
import {
  Building2,
  Ruler,
  Layers,
  DoorOpen,
  Maximize,
  HelpCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface ModelStatsPanelProps {
  model: BuildingModel;
  className?: string;
}

export function ModelStatsPanel({ model, className = '' }: ModelStatsPanelProps) {
  const [showAssumptions, setShowAssumptions] = React.useState(true);
  const [showWarnings, setShowWarnings] = React.useState(true);

  const { dimensions, metadata, floors, assumptions, warnings } = model;
  const activeFloor = floors[0];

  const wallCount = floors.reduce((acc, f) => acc + f.walls.length, 0);
  const doorCount = floors.reduce((acc, f) => acc + f.doors.length, 0);
  const windowCount = floors.reduce((acc, f) => acc + f.windows.length, 0);
  const columnCount = floors.reduce((acc, f) => acc + f.columns.length, 0);
  const stairCount = floors.reduce((acc, f) => acc + f.stairs.length, 0);
  const roomCount = floors.reduce((acc, f) => acc + f.rooms.length, 0);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 1. Spatial Dimensions & Building Envelope */}
      <Card className="bg-axis-surface/80 border-axis-border shadow-xs">
        <CardHeader className="py-2.5 px-3.5 border-b border-axis-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-axis-terracotta" />
              <CardTitle className="text-xs font-semibold tracking-wide uppercase text-stone-800">
                Building Spatial Extents
              </CardTitle>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
              REAL SCALE 1:1
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 space-y-3 text-xs">
          {/* Main Dimensions Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-white border border-stone-200/80">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Width (X)</span>
              <span className="font-mono text-sm font-bold text-stone-900">
                {dimensions.widthMeters.toFixed(2)} m
              </span>
            </div>
            <div className="p-2 rounded bg-white border border-stone-200/80">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Depth (Z)</span>
              <span className="font-mono text-sm font-bold text-stone-900">
                {dimensions.depthMeters.toFixed(2)} m
              </span>
            </div>
            <div className="p-2 rounded bg-white border border-stone-200/80">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">Height (Y)</span>
              <span className="font-mono text-sm font-bold text-stone-900">
                {dimensions.heightMeters.toFixed(2)} m
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-[11px]">
            <span className="text-stone-500">Gross Floor Footprint:</span>
            <span className="font-mono font-bold text-stone-800">
              {dimensions.grossAreaSqMeters.toFixed(1)} m²
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Architectural Primitives Breakdown */}
      <Card className="bg-axis-surface/80 border-axis-border shadow-xs">
        <CardHeader className="py-2.5 px-3.5 border-b border-axis-border/60">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-axis-terracotta" />
            <CardTitle className="text-xs font-semibold tracking-wide uppercase text-stone-800">
              Reconstructed Primitives
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-3 text-xs">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Walls</span>
              <span className="font-semibold text-stone-900">{wallCount}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Doors</span>
              <span className="font-semibold text-stone-900">{doorCount}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Windows</span>
              <span className="font-semibold text-stone-900">{windowCount}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Columns</span>
              <span className="font-semibold text-stone-900">{columnCount}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Stairs</span>
              <span className="font-semibold text-stone-900">{stairCount}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 px-2 rounded bg-white border border-stone-200/60 font-mono text-[11px]">
              <span className="text-stone-600 font-sans">Rooms</span>
              <span className="font-semibold text-stone-900">{roomCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Scale & Metric Contract */}
      <Card className="bg-axis-surface/80 border-axis-border shadow-xs">
        <CardHeader className="py-2.5 px-3.5 border-b border-axis-border/60">
          <div className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-axis-terracotta" />
            <CardTitle className="text-xs font-semibold tracking-wide uppercase text-stone-800">
              Metric Datum Contract
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3 text-[11px] space-y-1.5">
          <div className="flex justify-between py-0.5 border-b border-stone-200/50">
            <span className="text-stone-500">Unit Standard:</span>
            <span className="font-mono font-medium text-stone-800">1 unit = 1.000 meter</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-stone-200/50">
            <span className="text-stone-500">Coordinate System:</span>
            <span className="font-mono font-medium text-stone-800">X = Width, Y = Elev, Z = Depth</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-stone-200/50">
            <span className="text-stone-500">Vertical Datum:</span>
            <span className="font-mono font-medium text-stone-800">Y = 0.00m (Ground Slab)</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-stone-500">Nominal Ceiling:</span>
            <span className="font-mono font-medium text-stone-800">2.80 m Elevation</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Assumptions List (Section 48) */}
      {assumptions && assumptions.length > 0 && (
        <Card className="bg-axis-surface/80 border-axis-border shadow-xs">
          <button
            type="button"
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="w-full py-2.5 px-3.5 flex items-center justify-between text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-600" />
              <span className="text-xs font-semibold tracking-wide uppercase text-stone-800">
                Assumptions ({assumptions.length})
              </span>
            </div>
            {showAssumptions ? (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {showAssumptions && (
            <CardContent className="p-3 pt-0 text-[11px] space-y-2">
              {assumptions.map((ass, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-white border border-stone-200/80 space-y-0.5 font-mono text-[10px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-700">{ass.type}</span>
                    <span className="text-axis-terracotta">{ass.assumedValue} {ass.unit}</span>
                  </div>
                  <p className="text-stone-500 font-sans text-[10px] leading-tight mt-0.5">
                    {ass.description}
                  </p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* 5. Warnings List (if any) */}
      {warnings && warnings.length > 0 && (
        <Card className="bg-amber-50/50 border-amber-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setShowWarnings(!showWarnings)}
            className="w-full py-2.5 px-3.5 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold tracking-wide uppercase text-amber-900">
                Reconstruction Warnings ({warnings.length})
              </span>
            </div>
            {showWarnings ? (
              <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
            )}
          </button>

          {showWarnings && (
            <CardContent className="p-3 pt-0 text-[10px] space-y-1.5 font-mono">
              {warnings.map((w, idx) => (
                <div key={idx} className="p-2 rounded bg-white border border-amber-200 text-amber-900">
                  <span className="font-bold block">{w.code}:</span>
                  <span className="text-stone-600 font-sans">{w.message}</span>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
