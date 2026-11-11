import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-axis-surface border border-axis-border text-axis-text-primary',
        subtle: 'bg-axis-bg-subtle border border-axis-border-subtle text-axis-text-secondary',
        accent: 'bg-axis-accent/15 border border-axis-accent/30 text-axis-accent',
        bronze: 'bg-[#8F6E4A]/15 border border-[#8F6E4A]/30 text-[#6E4F2E]',
        outline: 'border border-axis-border text-axis-text-secondary bg-transparent',
      },
      size: {
        sm: 'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-axis-xs gap-1',
        md: 'text-xs px-2.5 py-1 rounded-axis-sm gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
