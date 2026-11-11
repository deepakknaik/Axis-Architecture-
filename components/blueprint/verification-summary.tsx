'use client';

import * as React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerificationProgress } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface VerificationSummaryProps {
  progress: VerificationProgress;
  onContinueToReconstruction?: () => void;
  onVerifyAll?: () => void;
  className?: string;
}

export function VerificationSummary({
  progress,
  onContinueToReconstruction,
  onVerifyAll,
  className,
}: VerificationSummaryProps) {
  const [showNextStageInfo, setShowNextStageInfo] = React.useState(false);

  const percent =
    progress.totalDetections > 0
      ? Math.round((progress.reviewedCount / progress.totalDetections) * 100)
      : 0;

  const validatedCount = progress.confirmedCount + progress.editedCount;

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Verification Summary
          </CardTitle>
        </div>
        <span
          className={cn(
            'font-mono text-[9px] uppercase px-1.5 py-0.2 rounded font-bold border',
            progress.isComplete
              ? 'bg-status-verified-bg text-status-verified-dot border-status-verified-border'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          )}
        >
          {progress.isComplete ? 'VERIFIED' : 'UNVERIFIED'}
        </span>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Progress Bar & Main Count */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-axis-text-secondary font-medium">Review Completion</span>
            <span className="font-mono text-sm font-semibold text-axis-text-primary">
              {progress.reviewedCount} / {progress.totalDetections}{' '}
              <span className="text-xs text-axis-text-muted">({percent}%)</span>
            </span>
          </div>
          <div className="w-full bg-axis-surface rounded-full h-2 overflow-hidden border border-axis-border">
            <div
              className={cn(
                'h-full transition-all duration-300 rounded-full',
                progress.isComplete ? 'bg-status-verified-dot' : 'bg-axis-accent'
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Counter Pills Grid (Section 8 & 36) */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded bg-axis-surface/60 border border-axis-border/80">
            <span className="text-[10px] text-axis-text-muted uppercase block">Confirmed</span>
            <span className="font-mono text-base font-semibold text-status-verified-dot">
              {progress.confirmedCount}
            </span>
          </div>
          <div className="p-2 rounded bg-axis-surface/60 border border-axis-border/80">
            <span className="text-[10px] text-axis-text-muted uppercase block">Edited</span>
            <span className="font-mono text-base font-semibold text-axis-accent">
              {progress.editedCount}
            </span>
          </div>
          <div className="p-2 rounded bg-axis-surface/60 border border-axis-border/80">
            <span className="text-[10px] text-axis-text-muted uppercase block">Rejected</span>
            <span className="font-mono text-base font-semibold text-red-600">
              {progress.rejectedCount}
            </span>
          </div>
          <div className="p-2 rounded bg-axis-surface/60 border border-axis-border/80">
            <span className="text-[10px] text-axis-text-muted uppercase block">Remaining</span>
            <span className="font-mono text-base font-semibold text-axis-text-primary">
              {progress.remainingCount}
            </span>
          </div>
        </div>

        {/* Validated Elements Metric */}
        <div className="flex justify-between items-center py-2 px-3 rounded bg-axis-surface-subtle border border-axis-border font-mono text-[11px]">
          <span className="text-axis-text-secondary uppercase">VALIDATED FOR MODEL:</span>
          <span className="font-bold text-axis-text-primary">
            {validatedCount} / {progress.totalDetections}
          </span>
        </div>

        {/* Category Breakdown (Section 37) */}
        <div className="space-y-1.5 pt-1 border-t border-axis-border/60">
          <span className="font-mono text-[10px] font-semibold text-axis-text-muted uppercase tracking-wider block mb-1">
            CATEGORY PROGRESS
          </span>
          {Object.values(progress.categories).map((cat) => (
            <div key={cat.type} className="flex justify-between py-0.5 text-[11px]">
              <span className="text-axis-text-secondary">{cat.type}</span>
              <span className="font-mono text-axis-text-primary">
                {cat.reviewed} / {cat.total}{' '}
                {cat.reviewed === cat.total ? (
                  <span className="text-status-verified-dot font-bold ml-1">✓</span>
                ) : (
                  <span className="text-axis-text-muted ml-1">({cat.total - cat.reviewed} rem)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Validation Completion & Gated Next Step (Section 38 & 39) */}
        {progress.isComplete ? (
          <div className="p-3 rounded bg-status-verified-bg/60 border border-status-verified-border space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-status-verified-dot uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFICATION COMPLETE</span>
            </div>
            <p className="text-[11px] text-axis-text-secondary leading-relaxed">
              All architectural primitives validated. Data contract is ready for downstream 3D reconstruction in Part 08.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setShowNextStageInfo(true);
                onContinueToReconstruction?.();
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Continue to Reconstruction
            </Button>
            {showNextStageInfo && (
              <div className="p-2 rounded bg-axis-bg-elevated border border-axis-border text-[10px] font-mono text-axis-text-muted animate-in fade-in">
                RECONSTRUCTION ENGINE: READY FOR NEXT STAGE (PART 08)
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>REVIEW IN PROGRESS</span>
            </div>
            <p className="text-[11px] text-axis-text-secondary leading-relaxed">
              {progress.remainingCount} architectural detections pending review. You can review remaining items, verify all at once, or proceed directly to 3D reconstruction.
            </p>
            <div className="space-y-1.5 pt-1">
              {onVerifyAll && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-emerald-600/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
                  onClick={onVerifyAll}
                  leftIcon={<CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                >
                  Verify All at Once ({progress.remainingCount} remaining)
                </Button>
              )}
              {onContinueToReconstruction && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs bg-axis-terracotta hover:bg-[#b85d32] text-white"
                  onClick={onContinueToReconstruction}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Approve Remaining & Continue to 3D
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
