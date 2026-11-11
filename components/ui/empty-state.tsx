import * as React from 'react';
import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-axis-md border border-dashed border-axis-border bg-axis-surface/20 min-h-[220px]',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-axis-surface border border-axis-border flex items-center justify-center text-axis-text-muted mb-4 shadow-axis-xs">
        {icon || <Compass className="w-5 h-5 text-axis-accent" />}
      </div>
      <h3 className="text-sm font-medium text-axis-text-primary tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-axis-text-secondary max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-5">
          <Button
            size="sm"
            variant={action.variant || 'secondary'}
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
