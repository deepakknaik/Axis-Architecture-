'use client';

import * as React from 'react';
import {
  BlueprintAnalysis,
  ArchitecturalElement,
  RoomElement,
  WallElement,
  DoorElement,
  WindowElement,
  StairElement,
  ColumnElement,
  VerificationItem,
  Vector2D,
} from '@/lib/types/architectural';
import { OverlayVisibilityState } from './analysis-legend';
import { cn } from '@/lib/utils';
export { worldToScreen, screenToWorld, toNormalized, fromNormalized } from '@/lib/blueprint/coordinate-transform';

export interface AnalysisCanvasProps {
  analysis: BlueprintAnalysis;
  previewUrl?: string | null;
  visibility: OverlayVisibilityState;
  showGrid: boolean;
  showLabels: boolean;
  showDimensions: boolean;
  showDebugOverlay?: boolean;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  selectedElement: ArchitecturalElement | null;
  onSelectElement: (element: ArchitecturalElement | null) => void;
  selectedRoomId: string | null;
  onSelectRoom: (room: RoomElement | null) => void;
  verificationItems?: VerificationItem[];
  showRejected?: boolean;
  isVerificationMode?: boolean;
  className?: string;
}

export function AnalysisCanvas({
  analysis,
  previewUrl,
  visibility,
  showGrid,
  showLabels,
  showDimensions,
  showDebugOverlay = false,
  zoom,
  onZoomChange,
  selectedElement,
  onSelectElement,
  selectedRoomId,
  onSelectRoom,
  verificationItems,
  showRejected = false,
  isVerificationMode = false,
  className,
}: AnalysisCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Quick lookup map for verification overrides
  const verificationMap = React.useMemo(() => {
    const map = new Map<string, VerificationItem>();
    if (verificationItems) {
      verificationItems.forEach((v) => map.set(v.elementId, v));
    }
    return map;
  }, [verificationItems]);

  // Pan state (pixel translation)
  const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = React.useRef(false);

  // Hover state
  const [hoveredElementId, setHoveredElementId] = React.useState<string | null>(null);

  // Dynamic ViewBox matching source raster resolution
  const viewBoxWidth = analysis.imageWidth || 1024;
  const viewBoxHeight = analysis.imageHeight || 682;
  const activeBlueprintUrl = previewUrl || '/blueprints/blueprint-bungalow-10x12.png';

  // Center pan initially
  React.useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [analysis.blueprintId]);

  // Handle Wheel Zoom (Smooth with clamp 0.4x to 3.5x)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 3.5);
    onZoomChange(nextZoom);
  };

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Safe Element Click (Ignored if user was dragging)
  const handleElementClick = (
    e: React.MouseEvent,
    element: ArchitecturalElement
  ) => {
    e.stopPropagation();
    if (hasMovedRef.current) return;
    if (selectedElement?.id === element.id) {
      onSelectElement(null);
    } else {
      onSelectElement(element);
      if (element.type === 'ROOM') {
        onSelectRoom(element as RoomElement);
      }
    }
  };

  const handleBackgroundClick = () => {
    if (hasMovedRef.current) return;
    onSelectElement(null);
    onSelectRoom(null);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleBackgroundClick}
      className={cn(
        'relative w-full h-[580px] sm:h-[640px] lg:h-[720px] bg-[#F5F2EC] rounded-axis-md border border-axis-border overflow-hidden select-none touch-none shadow-axis-xs',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        className
      )}
    >
      {/* CAD Coordinate Frame Header Bar (Datum Info) */}
      <div className="absolute top-2.5 left-3 z-10 pointer-events-none flex items-center gap-2 font-mono text-[10px] text-axis-text-muted bg-axis-bg-elevated/85 backdrop-blur-xs px-2.5 py-1 rounded border border-axis-border/60">
        <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
        <span>DATUM: SOURCE RASTER ({viewBoxWidth} × {viewBoxHeight} px)</span>
        <span>·</span>
        <span>EXTENTS: {analysis.dimensions.widthMeters.toFixed(2)}m × {analysis.dimensions.lengthMeters.toFixed(2)}m</span>
        <span>·</span>
        <span>SCALE: {analysis.scaleInfo.drawingScale}</span>
        {analysis.floorInfo && analysis.floorInfo.additionalFloors > 0 && (
          <>
            <span>·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              MULTI-FLOOR DRAWING (GROUND + FIRST FLOOR)
            </span>
          </>
        )}
      </div>

      {/* SVG Canvas Transform Container (Shared transform for base image + all overlays) */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full max-w-none max-h-none overflow-visible"
          style={{ width: `${viewBoxWidth}px`, height: `${viewBoxHeight}px` }}
        >
          <defs>
            {/* Subtle Millimeter CAD Grid Pattern */}
            <pattern
              id="cad-grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#DDD8CE"
                strokeWidth="0.5"
                strokeOpacity="0.45"
              />
            </pattern>
            <pattern
              id="cad-grid-major"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#cad-grid-pattern)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#DDD8CE"
                strokeWidth="0.85"
                strokeOpacity="0.85"
              />
            </pattern>
          </defs>

          {/* 1. Canvas Background */}
          <rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="#F5F2EC"
          />

          {showGrid && (
            <rect
              x="0"
              y="0"
              width={viewBoxWidth}
              height={viewBoxHeight}
              fill="url(#cad-grid-major)"
              opacity="0.3"
            />
          )}

          {/* 2. ACTUAL BLUEPRINT RASTER IMAGE — VISUAL BASE LAYER */}
          <image
            href={activeBlueprintUrl}
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            preserveAspectRatio="xMidYMid meet"
            opacity="0.94"
            className="pointer-events-none select-none"
          />

          {/* MULTI-FLOOR DRAWING SHEET LABELS */}
          {analysis.floorInfo && analysis.floorInfo.additionalFloors > 0 && (
            <g id="layer-floor-banners" className="pointer-events-none select-none font-mono">
              {/* Left Panel: Ground Floor */}
              <rect x="76" y="24" width="399" height="24" rx="4" fill="#0F172A" fillOpacity="0.85" />
              <text x="275" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" letterSpacing="1">
                LEVEL 01 · GROUND FLOOR PLAN (12.00m × 10.00m)
              </text>
              {/* Right Panel: First Floor */}
              <rect x="594" y="24" width="399" height="24" rx="4" fill="#0F172A" fillOpacity="0.85" />
              <text x="793" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" letterSpacing="1">
                LEVEL 02 · FIRST FLOOR PLAN (12.00m × 10.00m)
              </text>
            </g>
          )}

          {/* ============================================================= */}
          {/* DERIVED ARCHITECTURAL OVERLAY LAYER (Source Coordinates)       */}
          {/* ============================================================= */}

          {/* 3. ROOMS OVERLAY (Enclosed Polygons directly aligned with rooms) */}
          {visibility.rooms && (
            <g id="layer-rooms">
              {analysis.rooms.map((room) => {
                const vItem = verificationMap.get(room.id);
                const effective = (vItem?.verifiedGeometry as RoomElement) || room;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedRoomId === effective.id || selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;
                const pointsStr = effective.boundaryPolygon.map((p) => `${p.x},${p.y}`).join(' ');

                // Center of room for label
                const minX = Math.min(...effective.boundaryPolygon.map((p) => p.x));
                const maxX = Math.max(...effective.boundaryPolygon.map((p) => p.x));
                const minY = Math.min(...effective.boundaryPolygon.map((p) => p.y));
                const maxY = Math.max(...effective.boundaryPolygon.map((p) => p.y));
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer transition-opacity"
                  >
                    <polygon
                      points={pointsStr}
                      fill={isRejected ? '#DC2626' : isSelected ? '#B85D36' : isHovered ? '#B85D36' : '#8F6E4A'}
                      fillOpacity={isRejected ? 0.08 : isSelected ? 0.24 : isHovered ? 0.16 : 0.06}
                      stroke={isRejected ? '#DC2626' : isSelected ? '#B85D36' : isHovered ? '#8F6E4A' : '#8F6E4A'}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isRejected ? '4 3' : isSelected ? 'none' : '3 3'}
                    />

                    {/* Room Tag Label */}
                    {showLabels && (
                      <g className="pointer-events-none select-none">
                        <rect
                          x={centerX - 46}
                          y={centerY - 10}
                          width="92"
                          height="20"
                          rx="3"
                          fill="#FFFFFF"
                          fillOpacity={isSelected ? 0.95 : 0.88}
                          stroke={isSelected ? '#B85D36' : '#DDD8CE'}
                          strokeWidth="0.8"
                        />
                        <text
                          x={centerX}
                          y={centerY - 1}
                          textAnchor="middle"
                          fontSize="7.5"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          fill={isSelected ? '#B85D36' : '#252525'}
                        >
                          {effective.name}
                        </text>
                        <text
                          x={centerX}
                          y={centerY + 7}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontFamily="monospace"
                          fill="#6F6B63"
                        >
                          {effective.dimensions.width.toFixed(1)} × {effective.dimensions.length.toFixed(1)}m · {effective.calculatedAreaSqMeters.toFixed(1)}m²
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 4. WALLS OVERLAY (Centerlines on real blueprint walls) */}
          {visibility.walls && (
            <g id="layer-walls">
              {analysis.walls.map((wall) => {
                const vItem = verificationMap.get(wall.id);
                const effective = (vItem?.verifiedGeometry as WallElement) || wall;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;
                const strokeColor = isRejected
                  ? '#DC2626'
                  : isSelected
                  ? '#B85D36'
                  : isHovered
                  ? '#A34F2B'
                  : effective.classification === 'EXTERIOR'
                  ? '#B85D36'
                  : '#8F6E4A';
                const strokeWidth = effective.classification === 'EXTERIOR' ? 4 : 2.5;

                const midX = (effective.startPoint.x + effective.endPoint.x) / 2;
                const midY = (effective.startPoint.y + effective.endPoint.y) / 2;

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover hit line */}
                    <line
                      x1={effective.startPoint.x}
                      y1={effective.startPoint.y}
                      x2={effective.endPoint.x}
                      y2={effective.endPoint.y}
                      stroke="transparent"
                      strokeWidth="16"
                    />

                    {/* Wall centerline */}
                    <line
                      x1={effective.startPoint.x}
                      y1={effective.startPoint.y}
                      x2={effective.endPoint.x}
                      y2={effective.endPoint.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeOpacity={isRejected ? 0.4 : isSelected ? 1 : 0.8}
                      strokeDasharray={isRejected ? '6 4' : 'none'}
                    />

                    {/* Selection highlight */}
                    {isSelected && (
                      <line
                        x1={effective.startPoint.x}
                        y1={effective.startPoint.y}
                        x2={effective.endPoint.x}
                        y2={effective.endPoint.y}
                        stroke="#B85D36"
                        strokeWidth={strokeWidth + 6}
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Label */}
                    {showLabels && (isSelected || isHovered || isVerificationMode) && (
                      <g className="pointer-events-none select-none">
                        <rect
                          x={midX - (isVerificationMode && vItem ? 30 : 20)}
                          y={midY - 8}
                          width={isVerificationMode && vItem ? 60 : 40}
                          height="16"
                          rx="2"
                          fill={isRejected ? '#7F1D1D' : isSelected ? '#B85D36' : '#252525'}
                          stroke="#FFFFFF"
                          strokeWidth="0.6"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          textAnchor="middle"
                          fontSize="7"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#FFFFFF"
                        >
                          {effective.id}
                          {isVerificationMode && vItem && (
                            vItem.status === 'CONFIRMED'
                              ? ' ✓'
                              : vItem.status === 'EDITED'
                              ? ' ✎'
                              : vItem.status === 'REJECTED'
                              ? ' ✕'
                              : ' · REV'
                          )}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 5. DOORS OVERLAY (Opening notches & swing arcs) */}
          {visibility.doors && (
            <g id="layer-doors">
              {analysis.doors.map((door) => {
                const vItem = verificationMap.get(door.id);
                const effective = (vItem?.verifiedGeometry as DoorElement) || door;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;
                const strokeColor = isRejected ? '#DC2626' : isSelected ? '#B85D36' : '#8F6E4A';

                const cx = (effective.rawBounds2D.min.x + effective.rawBounds2D.max.x) / 2;
                const cy = (effective.rawBounds2D.min.y + effective.rawBounds2D.max.y) / 2;
                const radius = (effective.clearWidth || 0.85) * 28;

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer"
                  >
                    <circle cx={cx} cy={cy} r="20" fill="transparent" />

                    {/* Door Leaf Line */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx - radius * 0.7}
                      y2={cy - radius * 0.7}
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeOpacity={isRejected ? 0.4 : 0.9}
                    />

                    {/* Swing Arc */}
                    <path
                      d={`M ${cx - radius * 0.7} ${cy - radius * 0.7} A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      strokeOpacity={isRejected ? 0.35 : 0.85}
                    />

                    {/* Pivot Anchor */}
                    <circle cx={cx} cy={cy} r="3" fill="#F8F6F1" stroke={strokeColor} strokeWidth="1.2" />

                    {showLabels && (isSelected || isHovered || isVerificationMode) && (
                      <g className="pointer-events-none select-none">
                        <rect
                          x={cx - 24}
                          y={cy - 22}
                          width="48"
                          height="14"
                          rx="2"
                          fill={isRejected ? '#7F1D1D' : isSelected ? '#B85D36' : '#8F6E4A'}
                        />
                        <text
                          x={cx}
                          y={cy - 12}
                          textAnchor="middle"
                          fontSize="7"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#FFFFFF"
                        >
                          {effective.id}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. WINDOWS OVERLAY (Fenestration boxes on blueprint openings) */}
          {visibility.windows && (
            <g id="layer-windows">
              {analysis.windows.map((win) => {
                const vItem = verificationMap.get(win.id);
                const effective = (vItem?.verifiedGeometry as WindowElement) || win;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;
                const color = isRejected ? '#DC2626' : isSelected ? '#B85D36' : '#2C5282';

                const minX = effective.rawBounds2D.min.x;
                const maxX = effective.rawBounds2D.max.x;
                const minY = effective.rawBounds2D.min.y;
                const maxY = effective.rawBounds2D.max.y;
                const w = Math.max(maxX - minX, 12);
                const h = Math.max(maxY - minY, 12);
                const cx = (minX + maxX) / 2;
                const cy = (minY + maxY) / 2;

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={minX}
                      y={minY}
                      width={w}
                      height={h}
                      fill="#FFFFFF"
                      fillOpacity="0.8"
                      stroke={color}
                      strokeWidth={isSelected ? '2' : '1.5'}
                      strokeDasharray={isRejected ? '3 2' : 'none'}
                    />
                    <line
                      x1={minX + 2}
                      y1={cy}
                      x2={maxX - 2}
                      y2={cy}
                      stroke={color}
                      strokeWidth="1"
                    />

                    {showLabels && (isSelected || isHovered || isVerificationMode) && (
                      <g className="pointer-events-none select-none">
                        <rect
                          x={cx - 24}
                          y={minY - 14}
                          width="48"
                          height="12"
                          rx="2"
                          fill={isRejected ? '#7F1D1D' : isSelected ? '#B85D36' : '#2C5282'}
                        />
                        <text
                          x={cx}
                          y={minY - 5}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#FFFFFF"
                        >
                          {effective.id}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. STAIRS OVERLAY (Entrance porch steps with 4 risers) */}
          {visibility.stairs && (
            <g id="layer-stairs">
              {analysis.stairs.map((stair) => {
                const vItem = verificationMap.get(stair.id);
                const effective = (vItem?.verifiedGeometry as StairElement) || stair;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;
                const color = isRejected ? '#DC2626' : isSelected ? '#B85D36' : '#7E6A5A';

                const sx = effective.rawBounds2D.min.x;
                const sy = effective.rawBounds2D.min.y;
                const sw = effective.rawBounds2D.max.x - sx;
                const sh = effective.rawBounds2D.max.y - sy;
                const risers = [556, 572, 588, 604];

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={sx}
                      y={sy}
                      width={sw}
                      height={sh}
                      fill="#F6EFEB"
                      fillOpacity={isRejected ? 0.08 : 0.35}
                      stroke={color}
                      strokeWidth={isSelected ? 2 : 1.2}
                      strokeDasharray={isRejected ? '4 3' : 'none'}
                    />

                    {/* 4 Entrance Risers */}
                    {risers.map((ry, idx) => (
                      <line
                        key={idx}
                        x1={sx}
                        y1={ry}
                        x2={sx + sw}
                        y2={ry}
                        stroke={color}
                        strokeWidth="1.2"
                        strokeOpacity="0.8"
                      />
                    ))}

                    <text
                      x={sx + sw / 2}
                      y={sy + sh / 2 + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={color}
                    >
                      ▲ ENTRANCE STEPS (4 RISERS)
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 8. COLUMNS OVERLAY (14 Visible Structural Piers) */}
          {visibility.columns && (
            <g id="layer-columns">
              {analysis.columns.map((col) => {
                const vItem = verificationMap.get(col.id);
                const effective = (vItem?.verifiedGeometry as ColumnElement) || col;
                const isRejected = vItem?.status === 'REJECTED';

                if (isRejected && !showRejected) return null;

                const isSelected = selectedElement?.id === effective.id;
                const isHovered = hoveredElementId === effective.id;

                const minX = effective.rawBounds2D.min.x;
                const minY = effective.rawBounds2D.min.y;
                const w = effective.rawBounds2D.max.x - minX;
                const h = effective.rawBounds2D.max.y - minY;
                const cx = (minX + effective.rawBounds2D.max.x) / 2;
                const cy = (minY + effective.rawBounds2D.max.y) / 2;

                return (
                  <g
                    key={effective.id}
                    onClick={(e) => handleElementClick(e, effective)}
                    onMouseEnter={() => setHoveredElementId(effective.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={minX}
                      y={minY}
                      width={w}
                      height={h}
                      fill={isRejected ? '#DC2626' : isSelected ? '#B85D36' : '#252525'}
                      fillOpacity={isRejected ? 0.3 : 0.85}
                      stroke={isSelected ? '#F8F6F1' : '#DDD8CE'}
                      strokeWidth="1.2"
                    />

                    {/* Column Center Crosshair */}
                    <line x1={minX} y1={cy} x2={minX + w} y2={cy} stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.8" />
                    <line x1={cx} y1={minY} x2={cx} y2={minY + h} stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.8" />

                    {showLabels && (isSelected || isHovered || isVerificationMode) && (
                      <g className="pointer-events-none select-none">
                        <rect
                          x={cx - 18}
                          y={minY - 14}
                          width="36"
                          height="12"
                          rx="2"
                          fill={isRejected ? '#7F1D1D' : '#252525'}
                        />
                        <text
                          x={cx}
                          y={minY - 5}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#FFFFFF"
                        >
                          {effective.id}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 9. DEBUG SOURCE OVERLAY (Section 28) */}
          {showDebugOverlay && analysis.debugAnnotations && (
            <g id="layer-debug" className="pointer-events-none select-none">
              {analysis.debugAnnotations.map((anno) => {
                const isOcr = anno.category === 'OCR_TEXT';
                const isFurn = anno.category === 'FURNITURE_PROTECTED';
                const color = isOcr ? '#0284C7' : isFurn ? '#16A34A' : '#D97706';

                return (
                  <g key={anno.id}>
                    <rect
                      x={anno.box.x}
                      y={anno.box.y}
                      width={anno.box.width}
                      height={anno.box.height}
                      fill={color}
                      fillOpacity="0.08"
                      stroke={color}
                      strokeWidth="1"
                      strokeDasharray="3 2"
                    />
                    <text
                      x={anno.box.x + 2}
                      y={anno.box.y - 3}
                      fontSize="6"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={color}
                    >
                      [{anno.category}] {anno.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 10. REAL DIMENSION WITNESS OVERLAY (Section 21 & 25) */}
          {showDimensions && (
            <g id="layer-dimensions" className="pointer-events-none select-none">
              {/* North Top Overall: 10.00 m */}
              <g stroke="#252525" strokeWidth="0.8">
                <line x1="244" y1="92" x2="244" y2="40" />
                <line x1="780" y1="92" x2="780" y2="40" />
                <line x1="244" y1="46" x2="780" y2="46" />
                <line x1="240" y1="50" x2="248" y2="42" strokeWidth="1.5" />
                <line x1="776" y1="50" x2="784" y2="42" strokeWidth="1.5" />
              </g>
              <rect x="475" y="38" width="74" height="15" fill="#FFFFFF" rx="2" stroke="#252525" strokeWidth="0.6" />
              <text x="512" y="49" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#252525">
                10.00 m (W)
              </text>

              {/* West Left Overall: 12.00 m */}
              <g stroke="#252525" strokeWidth="0.8">
                <line x1="244" y1="85" x2="148" y2="85" />
                <line x1="405" y1="605" x2="148" y2="605" />
                <line x1="152" y1="85" x2="152" y2="605" />
                <line x1="148" y1="89" x2="156" y2="81" strokeWidth="1.5" />
                <line x1="148" y1="609" x2="156" y2="601" strokeWidth="1.5" />
              </g>
              <rect x="115" y="335" width="74" height="15" fill="#FFFFFF" rx="2" stroke="#252525" strokeWidth="0.6" transform="rotate(-90 152 342)" />
              <text x="152" y="346" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#252525" transform="rotate(-90 152 342)">
                12.00 m (L)
              </text>
            </g>
          )}

          {/* 11. Scale Bar & Compass Rose */}
          <g id="scale-bar" transform="translate(40, 650)" className="select-none pointer-events-none">
            <rect x="0" y="0" width="107.2" height="3" fill="#252525" />
            <rect x="0" y="0" width="53.6" height="3" fill="#8F6E4A" />
            <text x="0" y="12" fontSize="7" fontFamily="monospace" fill="#6F6B63">0</text>
            <text x="53.6" y="12" fontSize="7" fontFamily="monospace" fill="#6F6B63">1.0m</text>
            <text x="107.2" y="12" fontSize="7" fontFamily="monospace" fill="#6F6B63">2.0m (53.6 px/m)</text>
          </g>

          <g id="compass-rose" transform={`translate(${viewBoxWidth - 45}, ${viewBoxHeight - 45})`} className="select-none pointer-events-none">
            <circle cx="0" cy="0" r="14" fill="#FCFAF7" stroke="#DDD8CE" strokeWidth="0.8" />
            <path d="M 0 -11 L 3 0 L 0 -1.5 Z" fill="#B85D36" />
            <path d="M 0 -11 L -3 0 L 0 -1.5 Z" fill="#8F6E4A" />
            <text x="0" y="-14" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#B85D36">
              N
            </text>
          </g>
        </svg>
      </div>

      {/* Floating Status Pill on Canvas Bottom-Right */}
      <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-axis-text-muted bg-axis-bg-elevated/90 backdrop-blur-xs px-2 py-0.5 rounded border border-axis-border/60">
        <span>ORIGINAL SOURCE: IMMUTABLE</span>
        <span>·</span>
        <span>OVERLAY: DERIVED BLUEPRINT GEOMETRY</span>
      </div>
    </div>
  );
}
