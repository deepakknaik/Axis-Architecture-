import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  subtle?: boolean;
}

export function Divider({
  orientation = 'horizontal',
  label,
  subtle = false,
  className,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px self-stretch',
          subtle ? 'bg-axis-border-subtle' : 'bg-axis-border',
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        className={cn('relative flex items-center my-4', className)}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      >
        <div
          className={cn(
            'flex-grow border-t',
            subtle ? 'border-axis-border-subtle' : 'border-axis-border'
          )}
        />
        <span className="flex-shrink mx-3 text-[11px] font-mono uppercase tracking-wider text-axis-text-muted select-none">
          {label}
        </span>
        <div
          className={cn(
            'flex-grow border-t',
            subtle ? 'border-axis-border-subtle' : 'border-axis-border'
          )}
        />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        'w-full border-0 border-t my-3',
        subtle ? 'border-axis-border-subtle' : 'border-axis-border',
        className
      )}
      {...props}
    />
  );
}
