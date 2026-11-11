'use client';

import * as React from 'react';
import { Loader2, ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export interface BlueprintIngestionProgressProps {
  progressPercent: number;
  stageMessage: string;
  subtaskDetail: string;
}

export function BlueprintIngestionProgress({
  progressPercent,
  stageMessage,
  subtaskDetail,
}: BlueprintIngestionProgressProps) {
  return (
    <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-sm p-6 select-none max-w-xl mx-auto">
      <CardContent className="space-y-5 p-0">
        <div className="flex items-center justify-between pb-3 border-b border-axis-border">
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-axis-accent animate-spin" />
            <h3 className="text-sm font-semibold tracking-tight text-axis-text-primary">
              {stageMessage}
            </h3>
          </div>
          <span className="font-mono text-xs font-semibold text-axis-accent">
            {progressPercent}%
          </span>
        </div>

        {/* Engineering Pipeline Progress Bar */}
        <Progress
          value={progressPercent}
          variant="terracotta"
          label={subtaskDetail}
        />

        {/* Milestone Indicators */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2">
          <div className="p-2 rounded bg-axis-surface/50 border border-axis-border/80 flex items-center gap-1.5">
            <span className={progressPercent >= 30 ? 'text-status-completed-dot' : 'text-axis-text-muted'}>
              ✓
            </span>
            <span className="truncate">Source Validated</span>
          </div>

          <div className="p-2 rounded bg-axis-surface/50 border border-axis-border/80 flex items-center gap-1.5">
            <span className={progressPercent >= 70 ? 'text-status-completed-dot' : 'text-axis-text-muted'}>
              {progressPercent >= 70 ? '✓' : '…'}
            </span>
            <span className="truncate">SHA-256 Verified</span>
          </div>

          <div className="p-2 rounded bg-axis-surface/50 border border-axis-border/80 flex items-center gap-1.5">
            <span className={progressPercent >= 100 ? 'text-status-completed-dot' : 'text-axis-text-muted'}>
              {progressPercent >= 100 ? '✓' : '…'}
            </span>
            <span className="truncate">Workspace Ready</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
