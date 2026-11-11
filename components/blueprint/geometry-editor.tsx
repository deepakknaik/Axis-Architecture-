'use client';

import * as React from 'react';
import {
  Ruler,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ArchitecturalElement,
  WallElement,
  DoorElement,
  WindowElement,
  RoomElement,
  StairElement,
  ColumnElement,
} from '@/lib/types/architectural';
import { verificationEngine } from '@/lib/blueprint/verification-engine';
import { cn } from '@/lib/utils';

export interface GeometryEditorProps {
  element: ArchitecturalElement;
  onApply: (updatedElement: ArchitecturalElement, summary: string) => void;
  onCancel: () => void;
  className?: string;
}

export function GeometryEditor({
  element,
  onApply,
  onCancel,
  className,
}: GeometryEditorProps) {
  // Working draft copy of the element
  const [draft, setDraft] = React.useState<ArchitecturalElement>(() =>
    JSON.parse(JSON.stringify(element))
  );
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Re-sync draft if element changes
  React.useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(element)));
    setValidationError(null);
  }, [element]);

  // Handle number input changes safely
  const handleDimensionChange = (key: 'width' | 'length' | 'height' | 'thickness', val: string) => {
    const num = parseFloat(val);
    setDraft((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [key]: num,
      },
    }));
  };

  const handleApply = () => {
    const check = verificationEngine.validateGeometry(draft);
    if (!check.valid) {
      setValidationError(check.error || 'Invalid geometry values.');
      return;
    }

    // Build changes summary
    let summary = `Updated ${draft.type} geometry`;
    if (draft.type === 'WALL') {
      const w = draft as WallElement;
      summary = `Wall thickness adjusted to ${w.thickness.toFixed(2)}m (Length: ${w.dimensions.width.toFixed(2)}m)`;
    } else if (draft.type === 'DOOR') {
      const d = draft as DoorElement;
      summary = `Door clear width adjusted to ${d.clearWidth.toFixed(2)}m (${d.swingDirection || 'standard'} swing)`;
    } else if (draft.type === 'WINDOW') {
      const win = draft as WindowElement;
      summary = `Window width adjusted to ${win.windowWidth.toFixed(2)}m (Sill: ${win.sillHeight.toFixed(2)}m)`;
    } else if (draft.type === 'ROOM') {
      const r = draft as RoomElement;
      summary = `Room designated as ${r.name} (${r.roomFunction})`;
    }

    onApply(draft, summary);
  };

  return (
    <div className={cn('p-3.5 bg-axis-surface-subtle border border-axis-accent/40 rounded-axis-sm space-y-3', className)}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-axis-border">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-axis-accent uppercase">
          <Sliders className="w-3.5 h-3.5" />
          <span>EDITING GEOMETRY · {draft.id}</span>
        </div>
        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-axis-accent/15 text-axis-accent font-semibold uppercase">
          PARAMETRIC CAD
        </span>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block font-mono text-[10px] uppercase">INVALID GEOMETRY</span>
            <p className="text-[11px] leading-tight text-red-800">{validationError}</p>
          </div>
        </div>
      )}

      {/* Type-Specific Parametric Controls */}
      <div className="space-y-2.5 text-xs">
        {draft.type === 'WALL' && (() => {
          const wall = draft as WallElement;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Wall Thickness (m)
                  </label>
                  <select
                    value={wall.thickness}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value);
                      setDraft({
                        ...wall,
                        thickness: t,
                        dimensions: { ...wall.dimensions, thickness: t },
                      });
                    }}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="0.10">0.10 m (Stud Partition)</option>
                    <option value="0.12">0.12 m (Drywall Demising)</option>
                    <option value="0.15">0.15 m (Internal Masonry)</option>
                    <option value="0.20">0.20 m (Shear / Core)</option>
                    <option value="0.23">0.23 m (Standard Exterior)</option>
                    <option value="0.30">0.30 m (Heavy Load-Bearing)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Classification
                  </label>
                  <select
                    value={wall.classification}
                    onChange={(e) =>
                      setDraft({
                        ...wall,
                        classification: e.target.value as any,
                      })
                    }
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="EXTERIOR">EXTERIOR</option>
                    <option value="LOAD_BEARING">LOAD_BEARING</option>
                    <option value="PARTITION">PARTITION</option>
                    <option value="INTERIOR">INTERIOR</option>
                    <option value="CURTAIN">CURTAIN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Length (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    value={wall.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Height (m)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="1.0"
                    value={wall.height}
                    onChange={(e) => {
                      const h = parseFloat(e.target.value);
                      setDraft({
                        ...wall,
                        height: h,
                        dimensions: { ...wall.dimensions, height: h },
                      });
                    }}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {draft.type === 'DOOR' && (() => {
          const door = draft as DoorElement;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Clear Width (m)
                  </label>
                  <select
                    value={door.clearWidth}
                    onChange={(e) => {
                      const w = parseFloat(e.target.value);
                      setDraft({
                        ...door,
                        clearWidth: w,
                        dimensions: { ...door.dimensions, width: w },
                      });
                    }}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="0.75">0.75 m (Narrow / Utility)</option>
                    <option value="0.80">0.80 m (Standard Internal)</option>
                    <option value="0.85">0.85 m (Bed / Bath)</option>
                    <option value="0.90">0.90 m (Accessible / Code)</option>
                    <option value="1.00">1.00 m (Main Entrance)</option>
                    <option value="1.80">1.80 m (Double Patio)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Swing Direction
                  </label>
                  <select
                    value={door.swingDirection || 'LEFT'}
                    onChange={(e) =>
                      setDraft({
                        ...door,
                        swingDirection: e.target.value as any,
                      })
                    }
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="LEFT">LEFT (Clockwise)</option>
                    <option value="RIGHT">RIGHT (Counter-clockwise)</option>
                    <option value="INWARD">INWARD</option>
                    <option value="OUTWARD">OUTWARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                  Door Leaf Type
                </label>
                <select
                  value={door.doorType}
                  onChange={(e) => setDraft({ ...door, doorType: e.target.value as any })}
                  className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                >
                  <option value="SINGLE_SWING">Single Swing Leaf</option>
                  <option value="DOUBLE_SWING">Double Swing French</option>
                  <option value="POCKET">Pocket Sliding Recessed</option>
                  <option value="SLIDING">Surface Bypass Sliding</option>
                </select>
              </div>
            </div>
          );
        })()}

        {draft.type === 'WINDOW' && (() => {
          const win = draft as WindowElement;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Opening Width (m)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0.4"
                    max="6.0"
                    value={win.windowWidth}
                    onChange={(e) => {
                      const w = parseFloat(e.target.value);
                      setDraft({
                        ...win,
                        windowWidth: w,
                        dimensions: { ...win.dimensions, width: w },
                      });
                    }}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Sill Height (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="2.5"
                    value={win.sillHeight}
                    onChange={(e) => setDraft({ ...win, sillHeight: parseFloat(e.target.value) })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                  Fenestration Type
                </label>
                <select
                  value={win.windowType}
                  onChange={(e) => setDraft({ ...win, windowType: e.target.value as any })}
                  className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                >
                  <option value="CASEMENT">Casement (Side Hinged)</option>
                  <option value="FIXED">Fixed Picture Glazing</option>
                  <option value="SLIDING">Horizontal Sliding Track</option>
                  <option value="AWNING">Awning (Top Hinged)</option>
                  <option value="CLERESTORY">High Level Clerestory</option>
                </select>
              </div>
            </div>
          );
        })()}

        {draft.type === 'ROOM' && (() => {
          const room = draft as RoomElement;
          return (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => setDraft({ ...room, name: e.target.value })}
                  className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Function
                  </label>
                  <select
                    value={room.roomFunction}
                    onChange={(e) => setDraft({ ...room, roomFunction: e.target.value as any })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="LIVING">LIVING</option>
                    <option value="KITCHEN">KITCHEN</option>
                    <option value="BEDROOM">BEDROOM</option>
                    <option value="BATHROOM">BATHROOM</option>
                    <option value="OFFICE">OFFICE</option>
                    <option value="CORRIDOR">CORRIDOR</option>
                    <option value="CUSTOM">CUSTOM</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Area (m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={room.calculatedAreaSqMeters}
                    onChange={(e) =>
                      setDraft({
                        ...room,
                        calculatedAreaSqMeters: parseFloat(e.target.value),
                      })
                    }
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {draft.type === 'STAIR' && (() => {
          const stair = draft as StairElement;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Riser Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={stair.flightCount}
                    onChange={(e) => setDraft({ ...stair, flightCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Direction
                  </label>
                  <select
                    value={stair.direction}
                    onChange={(e) => setDraft({ ...stair, direction: e.target.value as any })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  >
                    <option value="UP">UP (Ascending)</option>
                    <option value="DOWN">DOWN (Descending)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Tread Depth (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.2"
                    value={stair.treadDepth}
                    onChange={(e) => setDraft({ ...stair, treadDepth: parseFloat(e.target.value) })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Riser Height (m)
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    min="0.1"
                    value={stair.riserHeight}
                    onChange={(e) => setDraft({ ...stair, riserHeight: parseFloat(e.target.value) })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {draft.type === 'COLUMN' && (() => {
          const col = draft as ColumnElement;
          return (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Width (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.15"
                    value={col.diameterOrWidth}
                    onChange={(e) => setDraft({ ...col, diameterOrWidth: parseFloat(e.target.value) })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                    Depth (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.15"
                    value={col.depth || col.diameterOrWidth}
                    onChange={(e) => setDraft({ ...col, depth: parseFloat(e.target.value) })}
                    className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-axis-text-muted uppercase block mb-1">
                  Structural Material
                </label>
                <select
                  value={col.structuralMaterial || 'CONCRETE'}
                  onChange={(e) => setDraft({ ...col, structuralMaterial: e.target.value as any })}
                  className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent font-mono"
                >
                  <option value="CONCRETE">Reinforced Concrete (RC Pier)</option>
                  <option value="STEEL">Structural Steel Section</option>
                  <option value="TIMBER">Glulam / Heavy Timber</option>
                  <option value="COMPOSITE">Composite Core</option>
                </select>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-axis-border">
        <Button variant="outline" size="sm" onClick={onCancel} leftIcon={<X className="w-3 h-3" />}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleApply}
          leftIcon={<Check className="w-3 h-3" />}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
