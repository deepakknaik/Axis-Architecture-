'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'underline' && 'border-b border-axis-border gap-6',
        variant === 'pills' && 'p-1 bg-axis-surface rounded-axis-sm gap-1 border border-axis-border',
        className
      )}
      role="tablist"
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative inline-flex items-center gap-2 text-xs font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent',
              tab.disabled && 'opacity-40 cursor-not-allowed',
              variant === 'underline' && [
                'py-2.5 -mb-px border-b-2',
                isActive
                  ? 'border-axis-accent text-axis-text-primary'
                  : 'border-transparent text-axis-text-secondary hover:text-axis-text-primary hover:border-axis-border',
              ],
              variant === 'pills' && [
                'px-3 py-1.5 rounded-axis-xs',
                isActive
                  ? 'bg-axis-bg-elevated text-axis-text-primary shadow-axis-xs'
                  : 'text-axis-text-secondary hover:text-axis-text-primary',
              ]
            )}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded font-mono text-[10px]',
                  isActive
                    ? 'bg-axis-accent/15 text-axis-accent'
                    : 'bg-axis-surface/80 text-axis-text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
