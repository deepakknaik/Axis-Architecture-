'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NavigationSectionProps {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function NavigationSection({
  title,
  collapsed = false,
  children,
  className,
}: NavigationSectionProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {title && !collapsed && (
        <div className="px-3 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-axis-text-muted uppercase font-semibold">
            {title}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-axis-border-strong opacity-40" />
        </div>
      )}
      {title && collapsed && (
        <div className="py-1 flex justify-center">
          <span className="w-4 h-px bg-axis-border" />
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
