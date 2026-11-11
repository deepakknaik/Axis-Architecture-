import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-axis-text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded-axis-xs border border-axis-border bg-axis-bg-elevated px-3 py-1.5 text-sm text-axis-text-primary shadow-axis-xs placeholder:text-axis-text-muted transition-colors',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent focus-visible:border-axis-accent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-axis-surface/40',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-status-failed-border focus-visible:ring-status-failed-dot',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-axis-text-muted pointer-events-none">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-status-failed-text">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
