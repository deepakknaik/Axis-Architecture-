'use client';

import * as React from 'react';
import {
  Ruler,
  Maximize2,
  Compass,
  Layers,
  Scale,
  Building2,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlueprintAnalysis } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface AnalysisDimensionsProps {
  analysis: BlueprintAnalysis;
  className?: string;
}

export function AnalysisDimensions({ analysis, className }: AnalysisDimensionsProps) {
  const { dimensions, scaleInfo, orientation, floorInfo } = analysis;

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Spatial Dimensions & Calibration
          </CardTitle>
        </div>
        <span className="font-mono text-[10px] text-axis-text-muted">
          CAD METRIC
        </span>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Building Extents */}
        <div>
          <span className="font-mono text-[10px] font-semibold text-axis-text-muted uppercase tracking-wider block mb-2">
            BUILDING EXTENTS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-axis-surface/60 border border-axis-border/80">
              <span className="text-[10px] text-axis-text-muted block">Overall Width</span>
              <span className="font-mono text-sm font-semibold text-axis-text-primary">
                {dimensions.widthMeters ? `${dimensions.widthMeters.toFixed(2)} m` : 'UNKNOWN'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-axis-surface/60 border border-axis-border/80">
              <span className="text-[10px] text-axis-text-muted block">Overall Length</span>
              <span className="font-mono text-sm font-semibold text-axis-text-primary">
                {dimensions.lengthMeters ? `${dimensions.lengthMeters.toFixed(2)} m` : 'UNKNOWN'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-axis-surface/60 border border-axis-border/80">
              <span className="text-[10px] text-axis-text-muted block">Std. Wall Thickness</span>
              <span className="font-mono text-xs font-semibold text-axis-text-primary">
                {dimensions.wallThicknessMeters ? `${dimensions.wallThicknessMeters.toFixed(2)} m` : 'UNKNOWN'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-axis-surface/60 border border-axis-border/80">
              <span className="text-[10px] text-axis-text-muted block">Gross Floor Footprint</span>
              <span className="font-mono text-xs font-semibold text-axis-text-primary">
                {dimensions.totalGrossAreaSqMeters ? `${dimensions.totalGrossAreaSqMeters.toFixed(1)} m²` : 'UNKNOWN'}
              </span>
            </div>
          </div>
        </div>

        {/* Drawing Scale & Units */}
        <div className="pt-2 border-t border-axis-border/60">
          <span className="font-mono text-[10px] font-semibold text-axis-text-muted uppercase tracking-wider block mb-2">
            DRAWING SCALE
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Project Units</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {scaleInfo.projectUnits}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Drawing Scale</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {scaleInfo.drawingScale}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Scale Status</span>
              <span
                className={cn(
                  'font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase',
                  scaleInfo.status === 'RESOLVED'
                    ? 'bg-status-verified-bg text-status-verified-dot border border-status-verified-border'
                    : 'bg-status-flagged-bg text-status-flagged-dot border border-status-flagged-border'
                )}
              >
                {scaleInfo.status}
              </span>
            </div>
          </div>
        </div>

        {/* Orientation & Floor Levels */}
        <div className="pt-2 border-t border-axis-border/60">
          <span className="font-mono text-[10px] font-semibold text-axis-text-muted uppercase tracking-wider block mb-2">
            ORIENTATION & LEVELS
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">North Datum</span>
              <span className="font-mono font-medium text-axis-text-primary flex items-center gap-1">
                <span className="text-axis-accent font-bold">↑</span> N ({orientation.northAngleDegrees}°)
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Primary Entrance</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {orientation.entranceDirection}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Orientation Status</span>
              <span
                className={cn(
                  'font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase',
                  orientation.status === 'RESOLVED'
                    ? 'bg-status-verified-bg text-status-verified-dot border border-status-verified-border'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                )}
              >
                {orientation.status}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Ground Level</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {floorInfo.groundFloors} (L01)
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-axis-text-secondary">Additional Floors</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {floorInfo.additionalFloors}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
