import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'terracotta' | 'bronze' | 'neutral';
}

export function Progress({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'terracotta',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantBarClasses = {
    terracotta: 'bg-axis-accent',
    bronze: 'bg-axis-accent-bronze',
    neutral: 'bg-axis-text-primary',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-axis-text-secondary font-medium">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-axis-text-muted">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-axis-surface border border-axis-border/40"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out',
            variantBarClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
