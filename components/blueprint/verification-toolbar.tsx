'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FastForward,
  Eye,
  EyeOff,
  Keyboard,
  ShieldCheck,
  ArrowRight,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface VerificationToolbarProps {
  onPrevious: () => void;
  onNext: () => void;
  onNextUnreviewed: () => void;
  onVerifyAll?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  hasUnreviewed: boolean;
  showRejected: boolean;
  onToggleShowRejected: () => void;
  onProceedToReconstruction?: () => void;
  className?: string;
}

export function VerificationToolbar({
  onPrevious,
  onNext,
  onNextUnreviewed,
  onVerifyAll,
  hasPrevious,
  hasNext,
  hasUnreviewed,
  showRejected,
  onToggleShowRejected,
  onProceedToReconstruction,
  className,
}: VerificationToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Detection Verification Navigation Toolbar"
      className={cn(
        'flex flex-wrap items-center justify-between gap-2.5 p-2 bg-axis-bg-elevated/95 backdrop-blur-md border border-axis-border rounded-axis-md shadow-axis-xs select-none',
        className
      )}
    >
      {/* Navigation Buttons: Previous / Next / Next Unreviewed */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPrevious}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          title="Previous Element (P)"
          aria-label="Previous Element"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          title="Next Element (N)"
          aria-label="Next Element"
        >
          Next
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNextUnreviewed}
          disabled={!hasUnreviewed}
          leftIcon={<FastForward className="w-3.5 h-3.5" />}
          title="Jump to Next Unreviewed Detection"
          className="ml-1"
        >
          Next Unreviewed
        </Button>

        {onVerifyAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onVerifyAll}
            disabled={!hasUnreviewed}
            leftIcon={<CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            title="Verify and confirm all remaining detections at once"
            className="border-emerald-600/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold ml-1 shadow-xs"
          >
            Verify All at Once
          </Button>
        )}
      </div>

      {/* Show Rejected Toggle & Keyboard Hints */}
      <div className="flex items-center gap-2">
        {/* Show Rejected Toggle (Section 29) */}
        <button
          type="button"
          onClick={onToggleShowRejected}
          aria-pressed={showRejected}
          aria-label={`Show rejected detections (${showRejected ? 'Visible' : 'Hidden'})`}
          title={`Show Rejected Detections (${showRejected ? 'ON' : 'OFF'})`}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wide border transition-all focus:outline-none focus:ring-1 focus:ring-axis-accent',
            showRejected
              ? 'bg-red-500/10 text-red-700 border-red-500/30 font-semibold'
              : 'bg-transparent text-axis-text-muted border-axis-border hover:bg-axis-surface text-axis-text-secondary'
          )}
        >
          {showRejected ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Rejected ({showRejected ? 'Shown' : 'Hidden'})</span>
        </button>

        {onProceedToReconstruction && (
          <Button
            variant="primary"
            size="sm"
            onClick={onProceedToReconstruction}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="bg-axis-terracotta hover:bg-[#b85d32] text-white font-mono text-xs shadow-xs"
            title="Approve Verified Detections and Proceed to 3D Reconstruction"
          >
            <span>Proceed to 3D</span>
          </Button>
        )}

        {/* Subtle Keyboard Shortcuts Hint (Section 35) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-axis-surface/60 border border-axis-border/60 font-mono text-[10px] text-axis-text-muted">
          <Keyboard className="w-3 h-3 text-axis-accent" />
          <span>[C] Confirm</span>
          <span>·</span>
          <span>[A] Verify All</span>
          <span>·</span>
          <span>[E] Edit</span>
          <span>·</span>
          <span>[R] Reject</span>
          <span>·</span>
          <span>[N] Next</span>
        </div>
      </div>
    </div>
  );
}
