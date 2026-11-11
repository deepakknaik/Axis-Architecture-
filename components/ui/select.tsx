import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: Array<{ label: string; value: string | number; disabled?: boolean }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'flex h-9 w-full appearance-none rounded-axis-xs border border-axis-border bg-axis-bg-elevated px-3 py-1.5 pr-8 text-sm text-axis-text-primary shadow-axis-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent focus-visible:border-axis-accent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-axis-surface/40',
            error && 'border-status-failed-border focus-visible:ring-status-failed-dot',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-axis-text-muted" />
        {error && <p className="mt-1 text-xs text-status-failed-text">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
