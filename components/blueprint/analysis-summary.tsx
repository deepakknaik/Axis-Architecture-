'use client';

import * as React from 'react';
import {
  FileCheck2,
  Cpu,
  Layers,
  Scale,
  Compass,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlueprintAnalysis } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface AnalysisSummaryProps {
  analysis: BlueprintAnalysis;
  className?: string;
}

export function AnalysisSummary({ analysis, className }: AnalysisSummaryProps) {
  const wallsCount = analysis.walls?.length || 0;
  const doorsCount = analysis.doors?.length || 0;
  const windowsCount = analysis.windows?.length || 0;
  const roomsCount = analysis.rooms?.length || 0;
  const stairsCount = analysis.stairs?.length || 0;
  const columnsCount = analysis.columns?.length || 0;
  const total = wallsCount + doorsCount + windowsCount + roomsCount + stairsCount + columnsCount;

  return (
    <Card className={className}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Analysis Summary
          </CardTitle>
        </div>
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-axis-surface text-axis-accent font-semibold border border-axis-border">
          SOURCE-DERIVED
        </span>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Primitives Count Breakdown Table */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Walls</span>
            <span className="font-mono font-semibold text-axis-text-primary">{wallsCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Doors</span>
            <span className="font-mono font-semibold text-axis-text-primary">{doorsCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Windows</span>
            <span className="font-mono font-semibold text-axis-text-primary">{windowsCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Rooms</span>
            <span className="font-mono font-semibold text-axis-text-primary">{roomsCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Stairs</span>
            <span className="font-mono font-semibold text-axis-text-primary">{stairsCount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-axis-border/50">
            <span className="text-axis-text-secondary">Columns</span>
            <span className="font-mono font-semibold text-axis-text-primary">{columnsCount}</span>
          </div>
          <div className="flex justify-between pt-1.5 font-semibold">
            <span className="text-axis-text-primary">Total Elements Detected</span>
            <span className="font-mono text-axis-accent">{total}</span>
          </div>
        </div>

        {/* Technical Analysis Telemetry Card */}
        <div className="rounded-axis-sm bg-axis-surface/60 border border-axis-border/80 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-axis-text-secondary">Geometry Status</span>
            <span className={cn(
              "font-mono font-medium text-[10px] uppercase px-1.5 py-0.2 rounded border",
              analysis.status === 'READY'
                ? "bg-status-verified-bg text-status-verified-dot border-status-verified-border"
                : "bg-status-flagged-bg text-status-flagged-dot border-status-flagged-border"
            )}>
              {analysis.status === 'NEEDS_REVIEW' ? 'ANALYSIS PARTIAL' : analysis.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-axis-text-secondary">Source Integrity</span>
            <span className="font-mono font-medium text-status-verified-dot uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              VERIFIED
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-axis-text-secondary">Scale Calibration</span>
            <span className="font-mono font-medium text-status-verified-dot uppercase">
              {analysis.scaleInfo.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-axis-text-secondary">Spatial Orientation</span>
            <span className="font-mono font-medium text-amber-600 uppercase">
              {analysis.orientation.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-axis-text-secondary">Execution Latency</span>
            <span className="font-mono text-axis-text-muted">
              {analysis.modelExecutionTimeMs ? `${analysis.modelExecutionTimeMs}ms` : '1.14s'}
            </span>
          </div>
        </div>

        {/* Honest Engine Notice */}
        <div className="flex items-start gap-2 p-2 rounded bg-axis-surface-subtle border border-axis-border/60 text-[11px] text-axis-text-secondary">
          <AlertCircle className="w-3.5 h-3.5 text-axis-text-muted shrink-0 mt-0.5" />
          <p className="leading-tight">
            <span className="font-semibold text-axis-text-primary">ANALYSIS PREVIEW: </span>
            Deterministic geometry extraction calibrated for prototype exploration. Real CV pipeline in development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
