'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Check,
  Edit3,
  Ban,
  AlertTriangle,
  Info,
  Maximize2,
  Tag,
  Ruler,
  CornerDownRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  VerificationItem,
  ArchitecturalElement,
  WallElement,
  DoorElement,
  WindowElement,
  RoomElement,
  StairElement,
  ColumnElement,
} from '@/lib/types/architectural';
import { GeometryEditor } from './geometry-editor';
import { cn } from '@/lib/utils';

export interface VerificationInspectorProps {
  item: VerificationItem | null;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onApplyEdit: (updatedElement: ArchitecturalElement, summary: string) => void;
  onConfirm: (elementId: string) => void;
  onPromptReject: (item: VerificationItem) => void;
  className?: string;
}

export function VerificationInspector({
  item,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onApplyEdit,
  onConfirm,
  onPromptReject,
  className,
}: VerificationInspectorProps) {
  if (!item) {
    return (
      <Card className={cn('bg-axis-bg-elevated border-axis-border p-6 text-center text-axis-text-muted', className)}>
        <p className="text-xs">Select an architectural detection from the queue or canvas to inspect and verify.</p>
      </Card>
    );
  }

  const activeElement = item.verifiedGeometry || item.originalDetection;
  const isConfirmed = item.status === 'CONFIRMED';
  const isEdited = item.status === 'EDITED';
  const isRejected = item.status === 'REJECTED';
  const isUnreviewed = item.status === 'UNREVIEWED';

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      {/* Header Bar */}
      <CardHeader className="py-2.5 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-axis-accent/15 text-axis-accent border border-axis-accent/30 shrink-0">
            {item.elementType}
          </span>
          <CardTitle className="text-xs font-mono font-medium text-axis-text-primary truncate">
            {item.elementId}
          </CardTitle>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            'font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold border tracking-wider',
            isConfirmed && 'bg-status-verified-bg text-status-verified-dot border-status-verified-border',
            isEdited && 'bg-axis-accent/15 text-axis-accent border-axis-accent/30',
            isRejected && 'bg-red-500/10 text-red-600 border-red-500/30',
            isUnreviewed && 'bg-amber-100 text-amber-800 border-amber-300'
          )}
        >
          {item.status}
        </span>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Semantic Consistency Banner (Section 11) */}
        <div className="flex items-center justify-between p-2.5 rounded bg-axis-surface/60 border border-axis-border/80 text-[11px]">
          <span className="text-axis-text-secondary">Analysis Consistency</span>
          <span
            className={cn(
              'font-mono font-semibold uppercase text-[10px] px-1.5 py-0.2 rounded border',
              item.confidenceLabel === 'HIGH_CONSISTENCY'
                ? 'bg-status-verified-bg text-status-verified-dot border-status-verified-border'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            )}
          >
            {item.confidenceLabel.replace('_', ' ')}
          </span>
        </div>

        {/* Review Reason Callout (Section 12) */}
        <div className="p-2.5 rounded bg-axis-surface-subtle border border-axis-border/70 space-y-1">
          <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider block font-semibold">
            AUDIT NOTE / REASON
          </span>
          <p className="text-[11px] text-axis-text-primary leading-tight">
            {item.reviewReason || 'Element requires human verification before building model compilation.'}
          </p>
        </div>

        {/* If Editing Mode is Active: Show Geometry Editor */}
        {isEditing ? (
          <GeometryEditor
            element={activeElement}
            onApply={onApplyEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            {/* Element Technical Properties Breakdown */}
            <div className="space-y-1.5 pt-1">
              <span className="font-mono text-[10px] font-semibold text-axis-text-muted uppercase tracking-wider block mb-1">
                CURRENT GEOMETRY PARAMETERS
              </span>

              {activeElement.type === 'WALL' && (() => {
                const wall = activeElement as WallElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Length</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {wall.dimensions.width.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Thickness</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {wall.thickness.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Classification</span>
                      <span className="font-mono font-medium text-axis-text-primary">
                        {wall.classification}
                      </span>
                    </div>
                  </>
                );
              })()}

              {activeElement.type === 'DOOR' && (() => {
                const door = activeElement as DoorElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Clear Width</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {door.clearWidth.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Clear Height</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {door.clearHeight.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Swing Arc</span>
                      <span className="font-mono font-medium text-axis-text-primary">
                        {door.swingDirection || 'STANDARD'}
                      </span>
                    </div>
                  </>
                );
              })()}

              {activeElement.type === 'WINDOW' && (() => {
                const win = activeElement as WindowElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Width</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {win.windowWidth.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Sill Height</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {win.sillHeight.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Fenestration</span>
                      <span className="font-mono font-medium text-axis-text-primary">
                        {win.windowType}
                      </span>
                    </div>
                  </>
                );
              })()}

              {activeElement.type === 'ROOM' && (() => {
                const room = activeElement as RoomElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Designation</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {room.name}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Area Footprint</span>
                      <span className="font-mono font-semibold text-axis-accent">
                        {room.calculatedAreaSqMeters.toFixed(1)} m²
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Function</span>
                      <span className="font-mono font-medium text-axis-text-primary">
                        {room.roomFunction}
                      </span>
                    </div>
                  </>
                );
              })()}

              {activeElement.type === 'STAIR' && (() => {
                const stair = activeElement as StairElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Riser Count</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {stair.flightCount} Risers @ {stair.riserHeight}m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Direction</span>
                      <span className="font-mono font-bold text-axis-accent">
                        ↑ {stair.direction} (Connecting L02)
                      </span>
                    </div>
                  </>
                );
              })()}

              {activeElement.type === 'COLUMN' && (() => {
                const col = activeElement as ColumnElement;
                return (
                  <>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Section Size</span>
                      <span className="font-mono font-semibold text-axis-text-primary">
                        {col.diameterOrWidth.toFixed(2)} × {(col.depth || col.diameterOrWidth).toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-axis-border/40">
                      <span className="text-axis-text-secondary">Material</span>
                      <span className="font-mono font-medium text-axis-text-primary">
                        {col.structuralMaterial}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* If Edited: Show delta indicator (Section 31) */}
            {isEdited && (
              <div className="p-2.5 rounded bg-axis-accent/10 border border-axis-accent/30 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-axis-accent uppercase">
                  <CornerDownRight className="w-3 h-3" />
                  <span>MODIFIED FROM ORIGINAL DETECTION</span>
                </div>
                <p className="text-[10px] text-axis-text-secondary">
                  The verified geometry will be passed to 3D reconstruction. Original prototype detection remains archived in audit trail.
                </p>
              </div>
            )}

            {/* Action Buttons: Confirm / Edit / Reject (Sections 17, 18, 28) */}
            <div className="space-y-2 pt-2 border-t border-axis-border">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-semibold"
                onClick={() => onConfirm(item.elementId)}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                {isConfirmed ? 'Re-Confirm Detection (C)' : 'Confirm Detection (C)'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={onStartEdit}
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit (E)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-red-700 hover:text-red-800 hover:bg-red-500/10"
                  onClick={() => onPromptReject(item)}
                  leftIcon={<Ban className="w-3.5 h-3.5" />}
                >
                  Reject (R)
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
