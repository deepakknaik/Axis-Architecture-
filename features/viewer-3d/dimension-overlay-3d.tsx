'use client';

import * as React from 'react';
import { Html } from '@react-three/drei';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface DimensionOverlay3DProps {
  model: BuildingModel;
  visible?: boolean;
  selectedElementId?: string | null;
}

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

  // Find selected element if any to show specific dimension
  const selectedWall = selectedElementId
    ? model.floors.flatMap((f) => f.walls).find((w) => w.id === selectedElementId)
    : null;

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

      {/* Selected Wall Dynamic Dimension Callout */}
      {selectedWall && (
        <Html
          position={[
            (selectedWall.start.x + selectedWall.end.x) / 2,
            selectedWall.elevationMeters + selectedWall.heightMeters + 0.3,
            (selectedWall.start.z + selectedWall.end.z) / 2,
          ]}
          center
          distanceFactor={12}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex flex-col items-center px-2 py-1 rounded bg-axis-terracotta text-white text-[11px] font-mono whitespace-nowrap shadow-lg border border-amber-400">
            <span className="font-bold">{selectedWall.lengthMeters.toFixed(2)} m</span>
            <span className="text-[9px] opacity-90">
              T: {selectedWall.thicknessMeters.toFixed(2)}m | H: {selectedWall.heightMeters.toFixed(2)}m
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
