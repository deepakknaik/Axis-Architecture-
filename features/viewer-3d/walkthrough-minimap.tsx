'use client';

import * as React from 'react';
import { Compass, Navigation } from 'lucide-react';
import { BuildingModel } from '@/lib/reconstruction/types';

export interface WalkthroughMinimapProps {
  model: BuildingModel;
  activeFloorId?: string | 'ALL';
  playerPose: { x: number; y: number; z: number; yaw: number };
  fov?: number;
}

export function WalkthroughMinimap({
  model,
  activeFloorId = 'ALL',
  playerPose,
  fov = 78,
}: WalkthroughMinimapProps) {
  const activeFloor = React.useMemo(() => {
    if (activeFloorId !== 'ALL') {
      return model.floors.find((f) => f.id === activeFloorId) || model.floors[0];
    }
    return model.floors[0];
  }, [model.floors, activeFloorId]);

  const { boundingBox } = model;
  const padding = 1.2;
  const minX = boundingBox.min.x - padding;
  const maxX = boundingBox.max.x + padding;
  const minZ = boundingBox.min.z - padding;
  const maxZ = boundingBox.max.z + padding;
  const viewWidth = Math.max(1, maxX - minX);
  const viewHeight = Math.max(1, maxZ - minZ);

  // Compute viewing cone coordinates
  const coneDist = 3.2;
  const halfFovRad = ((fov / 2) * Math.PI) / 180;
  // Three.js forward direction in world space
  const dirX = -Math.sin(playerPose.yaw);
  const dirZ = -Math.cos(playerPose.yaw);

  const leftX = playerPose.x - Math.sin(playerPose.yaw - halfFovRad) * coneDist;
  const leftZ = playerPose.z - Math.cos(playerPose.yaw - halfFovRad) * coneDist;
  const rightX = playerPose.x - Math.sin(playerPose.yaw + halfFovRad) * coneDist;
  const rightZ = playerPose.z - Math.cos(playerPose.yaw + halfFovRad) * coneDist;

  const conePath = `M ${playerPose.x} ${playerPose.z} L ${leftX} ${leftZ} L ${rightX} ${rightZ} Z`;

  // Compass heading degrees
  const headingDeg = Math.round(((playerPose.yaw * 180) / Math.PI + 360) % 360);
  const getCompassDir = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  };

  return (
    <div className="bg-[#0B0F17]/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-2.5 shadow-2xl w-52 flex flex-col gap-1.5 select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between text-[10px] font-mono border-b border-stone-800 pb-1">
        <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider">
          <Navigation className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>RADAR MINIMAP</span>
        </div>
        <div className="flex items-center gap-1 text-stone-300">
          <Compass className="w-3 h-3 text-amber-400" />
          <span className="font-bold">{getCompassDir(headingDeg)}</span>
          <span className="text-stone-500 text-[9px]">{headingDeg}°</span>
        </div>
      </div>

      {/* Blueprint Schematic Map */}
      <div className="w-full h-32 bg-[#05070B] rounded-lg border border-stone-800/80 overflow-hidden relative flex items-center justify-center p-1">
        <svg
          viewBox={`${minX} ${minZ} ${viewWidth} ${viewHeight}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="mini-grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#1E293B" strokeWidth="0.08" />
            </pattern>
          </defs>
          <rect x={minX} y={minZ} width={viewWidth} height={viewHeight} fill="url(#mini-grid)" />

          {/* Room Boundaries */}
          {activeFloor?.rooms?.map((rm) => {
            if (!rm.boundaryPolygon || rm.boundaryPolygon.length < 3) return null;
            const pointsStr = rm.boundaryPolygon.map((p) => `${p.x},${p.z}`).join(' ');
            return (
              <polygon
                key={`mini-rm-${rm.id}`}
                points={pointsStr}
                fill="#0F172A"
                fillOpacity="0.6"
                stroke="#334155"
                strokeWidth="0.1"
              />
            );
          })}

          {/* Wall Segments */}
          {activeFloor?.walls?.map((w) => (
            <line
              key={`mini-wall-${w.id}`}
              x1={w.start.x}
              y1={w.start.z}
              x2={w.end.x}
              y2={w.end.z}
              stroke="#94A3B8"
              strokeWidth="0.45"
              strokeLinecap="round"
            />
          ))}

          {/* Doors */}
          {activeFloor?.doors?.map((d) => (
            <circle
              key={`mini-door-${d.id}`}
              cx={d.position.x}
              cy={d.position.z}
              r="0.3"
              fill="#F59E0B"
            />
          ))}

          {/* FOV Viewing Cone Sweep */}
          <path d={conePath} fill="rgba(56, 189, 248, 0.28)" stroke="#38BDF8" strokeWidth="0.12" />

          {/* Player Heading Pointer Line */}
          <line
            x1={playerPose.x}
            y1={playerPose.z}
            x2={playerPose.x + dirX * 1.5}
            y2={playerPose.z + dirZ * 1.5}
            stroke="#38BDF8"
            strokeWidth="0.25"
            strokeLinecap="round"
          />

          {/* Player Position Blip */}
          <circle cx={playerPose.x} cy={playerPose.z} r="0.6" fill="#0284C7" fillOpacity="0.4" />
          <circle cx={playerPose.x} cy={playerPose.z} r="0.32" fill="#38BDF8" />
        </svg>
      </div>

      {/* Coordinates Status Bar */}
      <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-0.5">
        <span>X: {playerPose.x.toFixed(1)}m</span>
        <span>Z: {playerPose.z.toFixed(1)}m</span>
        <span className="text-cyan-400 font-semibold">{activeFloor.name || 'Ground Floor'}</span>
      </div>
    </div>
  );
}
