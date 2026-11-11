'use client';

import * as React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { IngestionStatus } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface BlueprintPipelineProps {
  status: IngestionStatus;
  className?: string;
}

export function BlueprintPipeline({ status, className }: BlueprintPipelineProps) {
  const stages = [
    { id: 1, key: 'SOURCE', label: '01 SOURCE', desc: 'Select Blueprint' },
    { id: 2, key: 'VALIDATE', label: '02 VALIDATE', desc: 'Format & Size' },
    { id: 3, key: 'VERIFY', label: '03 VERIFY', desc: 'SHA-256 Integrity' },
    { id: 4, key: 'READY', label: '04 READY', desc: 'Analysis Staging' },
  ];

  const getStageState = (stageId: number) => {
    switch (status) {
      case 'IDLE':
        return stageId === 1 ? 'active' : 'pending';
      case 'VALIDATING':
        return stageId === 2 ? 'active' : stageId < 2 ? 'completed' : 'pending';
      case 'VALIDATED':
        return stageId <= 2 ? 'completed' : stageId === 3 ? 'active' : 'pending';
      case 'UPLOADING':
      case 'INGESTING':
        return stageId <= 2 ? 'completed' : stageId === 3 ? 'active' : 'pending';
      case 'READY':
        return 'completed';
      case 'FAILED':
        return stageId === 2 ? 'failed' : stageId < 2 ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div
      className={cn(
        'w-full p-3 sm:p-4 rounded-axis-md border border-axis-border bg-axis-bg-elevated shadow-axis-xs select-none',
        className
      )}
    >
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {stages.map((stage, idx) => {
          const state = getStageState(stage.id);
          const isLast = idx === stages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Stage Indicator Circle */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-axis-xs flex items-center justify-center font-mono text-[10px] font-semibold shrink-0 transition-colors',
                    state === 'completed' &&
                      'bg-status-completed-bg text-status-completed-text border border-status-completed-border',
                    state === 'active' &&
                      'bg-axis-accent text-white shadow-axis-xs ring-2 ring-axis-accent/20',
                    state === 'failed' &&
                      'bg-status-failed-bg text-status-failed-text border border-status-failed-border',
                    state === 'pending' &&
                      'bg-axis-surface text-axis-text-muted border border-axis-border'
                  )}
                >
                  {state === 'completed' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>{stage.id}</span>
                  )}
                </div>

                {/* Stage Labels */}
                <div className="min-w-0">
                  <div
                    className={cn(
                      'font-mono text-[11px] font-semibold tracking-wider uppercase truncate',
                      state === 'active'
                        ? 'text-axis-accent'
                        : state === 'completed'
                        ? 'text-axis-text-primary'
                        : 'text-axis-text-muted'
                    )}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-axis-text-muted truncate hidden sm:block">
                    {stage.desc}
                  </div>
                </div>
              </div>

              {!isLast && (
                <ChevronRight className="w-4 h-4 text-axis-border-strong shrink-0 opacity-60" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
