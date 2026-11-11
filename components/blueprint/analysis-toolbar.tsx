'use client';

import * as React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Grid,
  Tag,
  Ruler,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalysisToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitScreen: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showDimensions: boolean;
  onToggleDimensions: () => void;
  showDebugOverlay?: boolean;
  onToggleDebugOverlay?: () => void;
  className?: string;
}

export function AnalysisToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitScreen,
  showGrid,
  onToggleGrid,
  showLabels,
  onToggleLabels,
  showDimensions,
  onToggleDimensions,
  showDebugOverlay = false,
  onToggleDebugOverlay,
  className,
}: AnalysisToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      role="toolbar"
      aria-label="Blueprint Canvas Navigation Toolbar"
      className={cn(
        'inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-axis-bg-elevated/95 backdrop-blur-md border border-axis-border rounded-axis-md shadow-axis-sm select-none',
        className
      )}
    >
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-axis-surface/60 rounded px-1 py-0.5 border border-axis-border/60">
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom Out"
          title="Zoom Out (Ctrl -)"
          className="p-1 rounded text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface-hover active:bg-axis-surface-active transition-colors focus:outline-none focus:ring-1 focus:ring-axis-accent"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          aria-label="Reset zoom to 100%"
          title="Reset zoom to 100%"
          className="px-2 py-0.5 font-mono text-[11px] font-semibold text-axis-text-primary hover:bg-axis-surface-hover rounded transition-colors focus:outline-none focus:ring-1 focus:ring-axis-accent min-w-[48px] text-center"
        >
          {zoomPercent}%
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom In"
          title="Zoom In (Ctrl +)"
          className="p-1 rounded text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface-hover active:bg-axis-surface-active transition-colors focus:outline-none focus:ring-1 focus:ring-axis-accent"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fit to View & Reset View */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onFitScreen}
          aria-label="Fit Blueprint to Screen"
          title="Fit Blueprint to Canvas"
          className="p-1.5 rounded text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface transition-colors border border-axis-border/60 focus:outline-none focus:ring-1 focus:ring-axis-accent"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          aria-label="Reset Pan & Zoom"
          title="Reset View Orientation"
          className="p-1.5 rounded text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface transition-colors border border-axis-border/60 focus:outline-none focus:ring-1 focus:ring-axis-accent"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-5 bg-axis-border/80 mx-0.5" />

      {/* Feature Toggles */}
      <div className="flex items-center gap-1">
        {/* Grid Toggle */}
        <button
          type="button"
          onClick={onToggleGrid}
          aria-pressed={showGrid}
          aria-label={`Toggle CAD Grid (Currently ${showGrid ? 'On' : 'Off'})`}
          title={`CAD Coordinate Grid (${showGrid ? 'ON' : 'OFF'})`}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wide border transition-all focus:outline-none focus:ring-1 focus:ring-axis-accent',
            showGrid
              ? 'bg-axis-accent/15 text-axis-accent border-axis-accent/40 font-semibold'
              : 'bg-transparent text-axis-text-muted border-axis-border hover:bg-axis-surface text-axis-text-secondary'
          )}
        >
          <Grid className="w-3 h-3" />
          <span>Grid</span>
        </button>

        {/* Labels Toggle */}
        <button
          type="button"
          onClick={onToggleLabels}
          aria-pressed={showLabels}
          aria-label={`Toggle Element & Room Labels (Currently ${showLabels ? 'On' : 'Off'})`}
          title={`Architectural Labels (${showLabels ? 'ON' : 'OFF'})`}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wide border transition-all focus:outline-none focus:ring-1 focus:ring-axis-accent',
            showLabels
              ? 'bg-axis-accent/15 text-axis-accent border-axis-accent/40 font-semibold'
              : 'bg-transparent text-axis-text-muted border-axis-border hover:bg-axis-surface text-axis-text-secondary'
          )}
        >
          <Tag className="w-3 h-3" />
          <span>Labels</span>
        </button>

        {/* Dimensions Toggle */}
        <button
          type="button"
          onClick={onToggleDimensions}
          aria-pressed={showDimensions}
          aria-label={`Toggle Dimension Chains (Currently ${showDimensions ? 'On' : 'Off'})`}
          title={`Dimension Extents (${showDimensions ? 'ON' : 'OFF'})`}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wide border transition-all focus:outline-none focus:ring-1 focus:ring-axis-accent',
            showDimensions
              ? 'bg-axis-accent/15 text-axis-accent border-axis-accent/40 font-semibold'
              : 'bg-transparent text-axis-text-muted border-axis-border hover:bg-axis-surface text-axis-text-secondary'
          )}
        >
          <Ruler className="w-3 h-3" />
          <span>Dim</span>
        </button>

        {/* Debug Source Overlay Toggle (Section 28) */}
        {onToggleDebugOverlay && (
          <button
            type="button"
            onClick={onToggleDebugOverlay}
            aria-pressed={showDebugOverlay}
            aria-label="Toggle Debug Source Overlay"
            title={`Debug Source Overlay (${showDebugOverlay ? 'ON' : 'OFF'})`}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wide border transition-all focus:outline-none focus:ring-1 focus:ring-axis-accent',
              showDebugOverlay
                ? 'bg-amber-600/20 text-amber-600 border-amber-600/40 font-semibold'
                : 'bg-transparent text-axis-text-muted border-axis-border hover:bg-axis-surface text-axis-text-secondary'
            )}
          >
            <Layers className="w-3 h-3" />
            <span>Debug</span>
          </button>
        )}
      </div>
    </div>
  );
}
