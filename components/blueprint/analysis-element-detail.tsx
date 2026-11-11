'use client';

import * as React from 'react';
import {
  Info,
  AlertTriangle,
  X,
  Compass,
  CheckCircle2,
  Tag,
  Ruler,
  Maximize2,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ArchitecturalElement,
  WallElement,
  DoorElement,
  WindowElement,
  RoomElement,
  StairElement,
  ColumnElement,
} from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface AnalysisElementDetailProps {
  element: ArchitecturalElement | null;
  onClose: () => void;
  className?: string;
}

export function AnalysisElementDetail({
  element,
  onClose,
  className,
}: AnalysisElementDetailProps) {
  if (!element) return null;

  const isWall = element.type === 'WALL';
  const isDoor = element.type === 'DOOR';
  const isWindow = element.type === 'WINDOW';
  const isRoom = element.type === 'ROOM';
  const isStair = element.type === 'STAIR';
  const isColumn = element.type === 'COLUMN';

  const wall = isWall ? (element as WallElement) : null;
  const door = isDoor ? (element as DoorElement) : null;
  const windowElem = isWindow ? (element as WindowElement) : null;
  const room = isRoom ? (element as RoomElement) : null;
  const stair = isStair ? (element as StairElement) : null;
  const column = isColumn ? (element as ColumnElement) : null;

  const isFlagged = element.status === 'FLAGGED' || !!element.metadata?.uncertaintyReason;
  const uncertaintyReason = (element.metadata?.uncertaintyReason as string) || null;

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-sm', className)}>
      <CardHeader className="py-2.5 px-3.5 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-axis-accent/15 text-axis-accent border border-axis-accent/30 shrink-0">
            {element.type}
          </span>
          <CardTitle className="text-xs font-mono font-medium text-axis-text-primary truncate">
            {element.id}
          </CardTitle>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Element Details"
          className="p-1 rounded text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3 text-xs">
        {/* Flagged Review Required Callout (Section 28) */}
        {isFlagged && (
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>REVIEW REQUIRED</span>
            </div>
            <p className="text-[11px] leading-tight text-axis-text-secondary">
              {uncertaintyReason || 'Potentially uncertain element geometry. Review required in the next stage.'}
            </p>
          </div>
        )}

        {/* Dynamic Metric Rows */}
        <div className="space-y-1.5">
          {wall && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Length</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {wall.dimensions.width.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Thickness</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {wall.thickness.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Classification</span>
                <span className="font-mono font-medium text-axis-text-primary">
                  {wall.classification}
                </span>
              </div>
              {wall.metadata?.material && (
                <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                  <span className="text-axis-text-muted">Material</span>
                  <span className="font-mono text-axis-text-secondary truncate max-w-[160px]">
                    {String(wall.metadata.material)}
                  </span>
                </div>
              )}
            </>
          )}

          {door && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Clear Width</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {door.clearWidth.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Clear Height</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {door.clearHeight.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Swing Arc</span>
                <span className="font-mono font-medium text-axis-text-primary">
                  {door.swingDirection || 'STANDARD'}
                </span>
              </div>
              {door.metadata?.roomName && (
                <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                  <span className="text-axis-text-muted">Assigned Space</span>
                  <span className="font-mono text-axis-text-secondary truncate max-w-[160px]">
                    {String(door.metadata.roomName)}
                  </span>
                </div>
              )}
            </>
          )}

          {windowElem && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Window Width</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {windowElem.windowWidth.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Sill Height</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {windowElem.sillHeight.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Fenestration Type</span>
                <span className="font-mono font-medium text-axis-text-primary">
                  {windowElem.windowType}
                </span>
              </div>
            </>
          )}

          {room && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Room Function</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {room.name}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Dimensions</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {room.dimensions.width.toFixed(2)} × {room.dimensions.length.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Calculated Area</span>
                <span className="font-mono font-semibold text-axis-accent">
                  {room.calculatedAreaSqMeters.toFixed(1)} m²
                </span>
              </div>
              {room.metadata?.finish && (
                <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                  <span className="text-axis-text-muted">Floor Finish</span>
                  <span className="font-mono text-axis-text-secondary truncate max-w-[160px]">
                    {String(room.metadata.finish)}
                  </span>
                </div>
              )}
            </>
          )}

          {stair && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Flight Risers</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {stair.flightCount} Risers @ {stair.riserHeight}m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Tread Depth</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {stair.treadDepth} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Direction Vector</span>
                <span className="font-mono font-bold text-axis-accent">
                  ↑ {stair.direction} (Connecting L02)
                </span>
              </div>
            </>
          )}

          {column && (
            <>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Structural Section</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {column.diameterOrWidth.toFixed(2)} × {(column.depth || column.diameterOrWidth).toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Grid Datum</span>
                <span className="font-mono font-semibold text-axis-text-primary">
                  {String(column.metadata?.gridDatum || 'Grid Intersect')}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                <span className="text-axis-text-muted">Material Spec</span>
                <span className="font-mono text-axis-text-secondary">
                  {column.structuralMaterial}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between py-0.5">
            <span className="text-axis-text-muted">Analysis Status</span>
            <span className="font-mono text-[10px] uppercase font-semibold text-axis-accent">
              ANALYSIS PREVIEW
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
