'use client';

import * as React from 'react';
import {
  Layers,
  DoorOpen,
  Square,
  Compass,
  CheckSquare,
  SquareDashed,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface OverlayVisibilityState {
  walls: boolean;
  doors: boolean;
  windows: boolean;
  rooms: boolean;
  stairs: boolean;
  columns: boolean;
}

export interface AnalysisLegendProps {
  visibility: OverlayVisibilityState;
  onToggle: (key: keyof OverlayVisibilityState) => void;
  counts: {
    WALL?: number;
    DOOR?: number;
    WINDOW?: number;
    ROOM?: number;
    STAIR?: number;
    COLUMN?: number;
    walls?: number;
    doors?: number;
    windows?: number;
    rooms?: number;
    stairs?: number;
    columns?: number;
  };
  className?: string;
}

export function AnalysisLegend({
  visibility,
  onToggle,
  counts,
  className,
}: AnalysisLegendProps) {
  const categories: Array<{
    key: keyof OverlayVisibilityState;
    label: string;
    count: number;
    colorBadge: string;
    dotColor: string;
    description: string;
  }> = [
    {
      key: 'walls',
      label: 'Walls',
      count: counts.WALL ?? counts.walls ?? 0,
      colorBadge: 'border-[#B85D36] text-[#B85D36]',
      dotColor: 'bg-[#B85D36]',
      description: 'Load-bearing & partition centerlines',
    },
    {
      key: 'doors',
      label: 'Doors',
      count: counts.DOOR ?? counts.doors ?? 0,
      colorBadge: 'border-[#8F6E4A] text-[#8F6E4A]',
      dotColor: 'bg-[#8F6E4A]',
      description: 'Opening notches & 90° swing arcs',
    },
    {
      key: 'windows',
      label: 'Windows',
      count: counts.WINDOW ?? counts.windows ?? 0,
      colorBadge: 'border-[#4A6B82] text-[#4A6B82]',
      dotColor: 'bg-[#4A6B82]',
      description: 'Exterior fenestrations & dual glazing',
    },
    {
      key: 'rooms',
      label: 'Rooms',
      count: counts.ROOM ?? counts.rooms ?? 0,
      colorBadge: 'border-[#A88B74] text-[#A88B74]',
      dotColor: 'bg-[#A88B74]',
      description: 'Demised spaces & calculated sq.m',
    },
    {
      key: 'stairs',
      label: 'Stairs',
      count: counts.STAIR ?? counts.stairs ?? 0,
      colorBadge: 'border-[#7E6A5A] text-[#7E6A5A]',
      dotColor: 'bg-[#7E6A5A]',
      description: 'Vertical risers, treads & UP vectors',
    },
    {
      key: 'columns',
      label: 'Columns',
      count: counts.COLUMN ?? counts.columns ?? 0,
      colorBadge: 'border-[#5A554E] text-[#5A554E]',
      dotColor: 'bg-[#5A554E]',
      description: 'Structural RC piers & grid datums',
    },
  ];

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Element Overlays
          </CardTitle>
        </div>
        <span className="font-mono text-[10px] text-axis-text-muted">
          6 Active Classes
        </span>
      </CardHeader>

      <CardContent className="p-2 space-y-1">
        {categories.map((cat) => {
          const isVisible = visibility[cat.key];

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onToggle(cat.key)}
              aria-pressed={isVisible}
              aria-label={`Toggle ${cat.label} overlay (Currently ${isVisible ? 'Visible' : 'Hidden'})`}
              className={cn(
                'w-full flex items-center justify-between p-2 rounded text-left transition-all group focus:outline-none focus:ring-1 focus:ring-axis-accent',
                isVisible
                  ? 'bg-axis-surface/60 hover:bg-axis-surface'
                  : 'bg-transparent hover:bg-axis-surface-subtle opacity-50'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Checkbox indicator */}
                <div
                  className={cn(
                    'w-4 h-4 rounded-sm flex items-center justify-center border transition-colors',
                    isVisible
                      ? 'bg-axis-surface border-axis-border text-axis-accent'
                      : 'border-axis-border/60 text-transparent'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-xs transition-opacity',
                      cat.dotColor,
                      isVisible ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs font-medium tracking-tight',
                        isVisible ? 'text-axis-text-primary' : 'text-axis-text-muted line-through'
                      )}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-axis-text-muted truncate">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Count pill */}
              <div
                className={cn(
                  'font-mono text-[11px] px-2 py-0.5 rounded border font-semibold shrink-0 ml-2',
                  isVisible
                    ? 'bg-axis-surface-subtle text-axis-text-primary border-axis-border'
                    : 'bg-transparent text-axis-text-muted border-axis-border/40'
                )}
              >
                {cat.count}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
