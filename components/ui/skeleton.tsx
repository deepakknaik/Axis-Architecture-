import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

export function Skeleton({ className, subtle = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-axis-xs',
        subtle ? 'bg-axis-surface/40' : 'bg-axis-surface/80',
        className
      )}
      {...props}
    />
  );
}
