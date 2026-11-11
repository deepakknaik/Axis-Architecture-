import * as React from 'react';
import {
  CircleCheck,
  Loader2,
  ScanLine,
  AlertCircle,
  CheckCheck,
  Boxes,
  Check,
  XCircle,
} from 'lucide-react';
import { AxisStatusType } from '@/lib/types/status';
import { AXIS_STATUS_CONFIG } from '@/lib/constants/status';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: AxisStatusType;
  showIcon?: boolean;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const statusIcons: Record<AxisStatusType, React.ComponentType<{ className?: string }>> = {
  READY: CircleCheck,
  PROCESSING: Loader2,
  ANALYZING: ScanLine,
  NEEDS_REVIEW: AlertCircle,
  VERIFIED: CheckCheck,
  GENERATING: Boxes,
  COMPLETED: Check,
  FAILED: XCircle,
};

export function StatusBadge({
  status,
  showIcon = true,
  showDot = true,
  size = 'sm',
  className,
  ...props
}: StatusBadgeProps) {
  const config = AXIS_STATUS_CONFIG[status] || AXIS_STATUS_CONFIG.READY;
  const IconComponent = statusIcons[status];

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono border select-none transition-colors',
        size === 'sm' && 'text-[11px] px-2 py-0.5 rounded-axis-xs gap-1.5',
        size === 'md' && 'text-xs px-2.5 py-1 rounded-axis-sm gap-2',
        config.badgeClass,
        className
      )}
      title={config.description}
      {...props}
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)}
          aria-hidden="true"
        />
      )}
      {showIcon && IconComponent && (
        <IconComponent
          className={cn(
            'shrink-0',
            size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
            status === 'PROCESSING' && 'animate-spin'
          )}
        />
      )}
      <span className="tracking-tight">{config.label}</span>
    </span>
  );
}
