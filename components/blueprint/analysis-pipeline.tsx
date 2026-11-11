'use client';

import * as React from 'react';
import { Check, ArrowRight, ShieldCheck, Cpu, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisStatus } from '@/lib/types/architectural';

export interface AnalysisPipelineProps {
  status: AnalysisStatus;
  activeStage?: 'analysis' | 'review';
  onSelectStage?: (stage: 'analysis' | 'review') => void;
  className?: string;
}

export function AnalysisPipeline({
  status,
  activeStage = 'analysis',
  onSelectStage,
  className,
}: AnalysisPipelineProps) {
  const isAnalyzing = status === 'PREPARING' || status === 'ANALYZING';
  const isReady = status === 'READY' || status === 'NEEDS_REVIEW' || status === 'VERIFIED';
  const inReviewMode = activeStage === 'review';

  const stages = [
    {
      num: '01',
      title: 'SOURCE',
      sub: 'Binary Ingested',
      state: 'COMPLETE' as const,
      icon: FileText,
      clickable: false,
    },
    {
      num: '02',
      title: 'VALIDATE',
      sub: 'SHA-256 Verified',
      state: 'COMPLETE' as const,
      icon: ShieldCheck,
      clickable: false,
    },
    {
      num: '03',
      title: 'ANALYZE',
      sub: isAnalyzing ? 'Processing...' : 'Detections Extracted',
      state: isAnalyzing ? ('ACTIVE' as const) : !inReviewMode ? ('ACTIVE' as const) : ('COMPLETE' as const),
      icon: Cpu,
      clickable: isReady,
      stageId: 'analysis' as const,
    },
    {
      num: '04',
      title: 'REVIEW',
      sub: inReviewMode ? 'Verification Active' : 'Human Verification',
      state: inReviewMode ? ('ACTIVE' as const) : isReady ? ('NEXT' as const) : ('PENDING' as const),
      icon: Eye,
      clickable: isReady,
      stageId: 'review' as const,
    },
  ];

  return (
    <div
      aria-label="Architectural Processing Pipeline"
      className={cn(
        'w-full bg-axis-bg-elevated/90 border border-axis-border rounded-axis-md p-3 sm:p-4 shadow-axis-xs',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
        {stages.map((stage, idx) => {
          const isComplete = stage.state === 'COMPLETE';
          const isActive = stage.state === 'ACTIVE';
          const isNext = stage.state === 'NEXT';

          return (
            <React.Fragment key={stage.num}>
              <div
                onClick={() => {
                  if (stage.clickable && stage.stageId && onSelectStage) {
                    onSelectStage(stage.stageId);
                  }
                }}
                className={cn(
                  'flex items-center gap-3 py-1 px-2.5 rounded transition-colors select-none flex-1',
                  isActive && 'bg-axis-surface/90 border border-axis-accent/30',
                  isNext && 'bg-axis-surface-subtle/50',
                  isComplete && 'opacity-90',
                  stage.clickable && onSelectStage && 'cursor-pointer hover:bg-axis-surface hover:opacity-100'
                )}
              >
                {/* Badge Number / Icon */}
                <div
                  className={cn(
                    'w-7 h-7 rounded flex items-center justify-center font-mono text-[11px] font-medium shrink-0 transition-all',
                    isComplete && 'bg-axis-accent/15 text-axis-accent border border-axis-accent/30',
                    isActive && 'bg-axis-accent text-white shadow-axis-xs animate-pulse',
                    isNext && 'bg-axis-surface text-axis-text-primary border border-axis-border font-semibold',
                    stage.state === 'PENDING' && 'bg-axis-surface-subtle text-axis-text-muted border border-axis-border/40'
                  )}
                >
                  {isComplete ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : stage.num}
                </div>

                {/* Text Labels */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'font-mono text-xs font-semibold tracking-wider uppercase',
                        isActive ? 'text-axis-accent' : isComplete ? 'text-axis-text-primary' : 'text-axis-text-secondary'
                      )}
                    >
                      {stage.title}
                    </span>
                    {isComplete && (
                      <span className="font-mono text-[10px] text-axis-accent font-bold">✓</span>
                    )}
                    {isNext && (
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-axis-accent/10 text-axis-accent font-semibold uppercase tracking-widest border border-axis-accent/20">
                        NEXT
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-axis-text-muted truncate">
                    {stage.sub}
                  </p>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden sm:flex items-center justify-center text-axis-border px-1">
                  <ArrowRight className="w-3.5 h-3.5 text-axis-text-muted/40" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
