import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent focus-visible:ring-offset-2 focus-visible:ring-offset-axis-bg disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-axis-accent text-axis-accent-foreground shadow-axis-xs hover:bg-axis-accent-hover active:bg-axis-accent-active',
        secondary:
          'bg-axis-surface border border-axis-border text-axis-text-primary shadow-axis-xs hover:bg-axis-surface-hover hover:border-axis-border-strong active:bg-axis-surface-active',
        outline:
          'border border-axis-border bg-transparent text-axis-text-primary hover:bg-axis-surface/60 hover:border-axis-border-strong active:bg-axis-surface',
        ghost:
          'bg-transparent text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/50 active:bg-axis-surface',
        destructive:
          'bg-status-failed-bg border border-status-failed-border text-status-failed-text hover:bg-red-100 active:bg-red-200',
        bronze:
          'bg-axis-accent-bronze text-white shadow-axis-xs hover:bg-[#7D5F3F] active:bg-[#6D5235]',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-axis-xs gap-1.5',
        md: 'h-9 px-4 text-sm rounded-axis-sm gap-2',
        lg: 'h-11 px-5 text-base rounded-axis-sm gap-2.5',
        iconSm: 'h-8 w-8 rounded-axis-xs p-0',
        iconMd: 'h-9 w-9 rounded-axis-sm p-0',
        iconLg: 'h-11 w-11 rounded-axis-sm p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-current" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: React.ReactNode;
  'aria-label': string;
  tooltip?: string;
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'iconMd',
      icon,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          icon
        )}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
