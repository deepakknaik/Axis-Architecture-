'use client';

import * as React from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProjectEmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
}

export function ProjectEmptyState({ onClearFilters, searchQuery }: ProjectEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-axis-md border border-dashed border-axis-border bg-axis-surface/20 min-h-[300px]">
      {/* Blueprint Compass icon */}
      <div className="w-12 h-12 rounded-full bg-axis-surface border border-axis-border flex items-center justify-center text-axis-accent mb-4 shadow-axis-xs">
        <Compass className="w-6 h-6 animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider">
          PROJECT ARCHIVE FILTER
        </span>
        <h3 className="text-base font-medium tracking-tight text-axis-text-primary">
          No Architectural Projects Found
        </h3>
        <p className="text-xs text-axis-text-secondary leading-relaxed">
          {searchQuery
            ? `No project matching "${searchQuery}" with the current filter criteria.`
            : 'No projects match your active building type and status selections.'}
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
