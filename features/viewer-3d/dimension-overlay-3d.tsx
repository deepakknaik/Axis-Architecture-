'use client';

import * as React from 'react';
import { Html, Line } from '@react-three/drei';
import { BuildingModel, Wall3D } from '@/lib/reconstruction/types';

export interface DimensionOverlay3DProps {
  model: BuildingModel;
  visible?: boolean;
  selectedElementId?: string | null;
}

/**
 * Technical / BIM Dimension Overlay with interactive dimension brackets,
 * glowing yellow bounding box, and floating element specification card (Matching Reference Panel 4).
 */
export function DimensionOverlay3D({
  model,
  visible = true,
  selectedElementId,
}: DimensionOverlay3DProps) {
  if (!visible) return null;

  const { boundingBox, dimensions } = model;
  const width = dimensions.widthMeters.toFixed(2);
  const depth = dimensions.depthMeters.toFixed(2);
  const height = dimensions.heightMeters.toFixed(2);

  const minX = boundingBox.min.x;
  const maxX = boundingBox.max.x;
  const minY = boundingBox.min.y;
  const maxY = boundingBox.max.y;
  const minZ = boundingBox.min.z;
  const maxZ = boundingBox.max.z;

  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  // Find selected wall if any to show specific BIM brackets
  const selectedWall: Wall3D | undefined = React.useMemo(() => {
    if (!selectedElementId) return undefined;
    return model.floors.flatMap((f) => f.walls).find((w) => w.id === selectedElementId);
  }, [model.floors, selectedElementId]);

  // Wall Bracket Point Coordinates
  const bracketPoints = React.useMemo(() => {
    if (!selectedWall) return null;

    const sx = selectedWall.start.x;
    const sz = selectedWall.start.z;
    const ex = selectedWall.end.x;
    const ez = selectedWall.end.z;
    const yBase = selectedWall.elevationMeters || 0;
    const yTop = yBase + (selectedWall.heightMeters || 3.0);

    const dx = ex - sx;
    const dz = ez - sz;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;

    const offsetDist = 0.45;
    const bx1 = sx + nx * offsetDist;
    const bz1 = sz + nz * offsetDist;
    const bx2 = ex + nx * offsetDist;
    const bz2 = ez + nz * offsetDist;

    const hLine: [[number, number, number], [number, number, number]] = [
      [bx1, yBase + 0.1, bz1],
      [bx2, yBase + 0.1, bz2],
    ];

    const tickLen = 0.15;
    const t1: [[number, number, number], [number, number, number]] = [
      [bx1 - nx * tickLen, yBase + 0.1, bz1 - nz * tickLen],
      [bx1 + nx * tickLen, yBase + 0.1, bz1 + nz * tickLen],
    ];
    const t2: [[number, number, number], [number, number, number]] = [
      [bx2 - nx * tickLen, yBase + 0.1, bz2 - nz * tickLen],
      [bx2 + nx * tickLen, yBase + 0.1, bz2 + nz * tickLen],
    ];

    const vOffsetDist = 0.35;
    const vx = sx - nx * vOffsetDist;
    const vz = sz - nz * vOffsetDist;

    const vLine: [[number, number, number], [number, number, number]] = [
      [vx, yBase, vz],
      [vx, yTop, vz],
    ];
    const vt1: [[number, number, number], [number, number, number]] = [
      [vx - 0.1, yBase, vz],
      [vx + 0.1, yBase, vz],
    ];
    const vt2: [[number, number, number], [number, number, number]] = [
      [vx - 0.1, yTop, vz],
      [vx + 0.1, yTop, vz],
    ];

    return {
      hLine,
      t1,
      t2,
      vLine,
      vt1,
      vt2,
      midX: (bx1 + bx2) / 2,
      midZ: (bz1 + bz2) / 2,
      vx,
      vz,
      yBase,
      yTop,
    };
  }, [selectedWall]);

  return (
    <group>
      {/* Front Width Dimension Callout */}
      <Html
        position={[centerX, minY + 0.1, maxZ + 0.6]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-900/90 border border-stone-700/80 text-axis-terracotta text-[11px] font-mono whitespace-nowrap shadow-md">
          <span className="text-stone-400">WIDTH:</span>
          <span className="font-semibold text-white">{width} m</span>
        </div>
      </Html>

      {/* Side Depth Dimension Callout */}
      <Html
        position={[maxX + 0.6, minY + 0.1, centerZ]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-900/90 border border-stone-700/80 text-axis-terracotta text-[11px] font-mono whitespace-nowrap shadow-md">
          <span className="text-stone-400">DEPTH:</span>
          <span className="font-semibold text-white">{depth} m</span>
        </div>
      </Html>

      {/* Vertical Height Dimension Callout */}
      <Html
        position={[minX - 0.5, (minY + maxY) / 2, maxZ]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-900/90 border border-stone-700/80 text-axis-terracotta text-[11px] font-mono whitespace-nowrap shadow-md">
          <span className="text-stone-400">HEIGHT:</span>
          <span className="font-semibold text-white">{height} m</span>
        </div>
      </Html>

      {/* BIM Mode: Active Wall Dimension Brackets (Matching Reference Panel 4) */}
      {selectedWall && bracketPoints && (
        <group>
          {/* Horizontal Dimension Line & Ticks */}
          <Line points={bracketPoints.hLine} color="#FBBF24" lineWidth={2} />
          <Line points={bracketPoints.t1} color="#FBBF24" lineWidth={2} />
          <Line points={bracketPoints.t2} color="#FBBF24" lineWidth={2} />

          {/* Horizontal Length Dimension Label (e.g. 3.50 m) */}
          <Html
            position={[bracketPoints.midX, bracketPoints.yBase + 0.2, bracketPoints.midZ]}
            center
            distanceFactor={13}
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-2 py-0.5 rounded bg-stone-950/90 border border-amber-400/80 text-amber-300 font-mono text-xs font-bold shadow-xl">
              {selectedWall.lengthMeters.toFixed(2)} m
            </div>
          </Html>

          {/* Vertical Height Dimension Line & Ticks */}
          <Line points={bracketPoints.vLine} color="#FBBF24" lineWidth={2} />
          <Line points={bracketPoints.vt1} color="#FBBF24" lineWidth={2} />
          <Line points={bracketPoints.vt2} color="#FBBF24" lineWidth={2} />

          {/* Vertical Height Dimension Label (e.g. 3.00 m) */}
          <Html
            position={[bracketPoints.vx, (bracketPoints.yBase + bracketPoints.yTop) / 2, bracketPoints.vz]}
            center
            distanceFactor={13}
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-2 py-0.5 rounded bg-stone-950/90 border border-amber-400/80 text-amber-300 font-mono text-xs font-bold shadow-xl">
              {selectedWall.heightMeters.toFixed(2)} m
            </div>
          </Html>

          {/* Floating Element Specifications Card (Matching Reference Panel 4 Card) */}
          <Html
            position={[
              (selectedWall.start.x + selectedWall.end.x) / 2,
              bracketPoints.yTop + 0.45,
              (selectedWall.start.z + selectedWall.end.z) / 2,
            ]}
            center
            distanceFactor={14}
          >
            <div className="bg-stone-950/95 border border-amber-400/80 rounded-xl p-3 shadow-2xl text-xs font-mono text-stone-200 w-52 pointer-events-auto space-y-1.5">
              <div className="font-bold text-amber-400 text-[11px] pb-1 border-b border-stone-800 flex items-center justify-between">
                <span>{selectedWall.id.toUpperCase()}</span>
                <span className="text-[10px] text-stone-400 font-normal">Wall Primitive</span>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-[10.5px]">
                <span className="text-stone-400">Length:</span>
                <span className="font-semibold text-white">{selectedWall.lengthMeters.toFixed(2)} m</span>
                <span className="text-stone-400">Thickness:</span>
                <span className="font-semibold text-white">{selectedWall.thicknessMeters.toFixed(2)} m</span>
                <span className="text-stone-400">Height:</span>
                <span className="font-semibold text-white">{selectedWall.heightMeters.toFixed(2)} m</span>
                <span className="text-stone-400">Material:</span>
                <span className="font-semibold text-white">RCC + Brick</span>
                <span className="text-stone-400">Confidence:</span>
                <span className="font-semibold text-emerald-400">0.98</span>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
