import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-axis-lg bg-axis-surface/70 backdrop-blur-[2px] transition-colors',
          bordered && 'border border-axis-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';

export const PanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between px-4 py-3 border-b border-axis-border/80 bg-axis-bg-subtle/40 rounded-t-axis-lg',
      className
    )}
    {...props}
  />
));
PanelHeader.displayName = 'PanelHeader';

export const PanelBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 space-y-3', className)} {...props} />
));
PanelBody.displayName = 'PanelBody';
