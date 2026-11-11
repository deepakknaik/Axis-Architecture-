'use client';

import * as React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

export interface NavigationItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  collapsed?: boolean;
  active?: boolean;
  datum?: string;
  onClick?: () => void;
}

export function NavigationItem({
  href,
  label,
  icon: Icon,
  badge,
  collapsed = false,
  active = false,
  datum,
  onClick,
}: NavigationItemProps) {
  const content = (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-axis-xs transition-all duration-150 select-none outline-none focus-visible:ring-1 focus-visible:ring-axis-accent',
        active
          ? 'bg-axis-accent/10 text-axis-text-primary font-semibold'
          : 'text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60',
        collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : 'w-full'
      )}
    >
      {/* CAD Left Active Indicator */}
      {active && (
        <span
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-axis-accent rounded-r transition-all',
            collapsed ? 'left-0.5 h-5' : 'left-0 h-4'
          )}
          aria-hidden="true"
        />
      )}

      {/* Navigation Icon */}
      <Icon
        className={cn(
          'w-4 h-4 shrink-0 transition-colors',
          active
            ? 'text-axis-accent'
            : 'text-axis-text-secondary group-hover:text-axis-text-primary'
        )}
      />

      {/* Label and Badge (when expanded) */}
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="truncate tracking-tight">{label}</span>
          {badge !== undefined && (
            <span
              className={cn(
                'ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded border',
                active
                  ? 'bg-axis-accent/15 text-axis-accent border-axis-accent/30 font-semibold'
                  : 'bg-axis-surface text-axis-text-muted border-axis-border/80'
              )}
            >
              {badge}
            </span>
          )}
          {datum && !badge && (
            <span className="font-mono text-[9px] text-axis-text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {datum}
            </span>
          )}
        </div>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
