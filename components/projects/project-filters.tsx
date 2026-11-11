'use client';

import * as React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { BuildingType } from '@/lib/types/architectural';
import { AxisStatusType } from '@/lib/types/status';
import { cn } from '@/lib/utils';

export type SortOption = 'modified' | 'name' | 'created' | 'status';

export interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalMatches: number;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  totalMatches,
}: ProjectFiltersProps) {
  const buildingTypes = ['All', 'Residential', 'Commercial', 'Office', 'Other'];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Ready', value: 'READY' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Needs Review', value: 'NEEDS_REVIEW' },
    { label: 'Generating', value: 'GENERATING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Failed', value: 'FAILED' },
  ];

  const sortOptions = [
    { label: 'Recently Modified', value: 'modified' },
    { label: 'Project Name', value: 'name' },
    { label: 'Date Created', value: 'created' },
    { label: 'Pipeline Status', value: 'status' },
  ];

  return (
    <div className="space-y-3 p-4 rounded-axis-md border border-axis-border bg-axis-bg-elevated shadow-axis-xs select-none">
      {/* Top Controls Row: Search Input + Select Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Field */}
        <div className="sm:col-span-5 relative">
          <Input
            placeholder="Search by project name or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-axis-text-muted" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="pointer-events-auto text-axis-text-muted hover:text-axis-text-primary p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : undefined
            }
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="sm:col-span-4">
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="sm:col-span-3">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            options={sortOptions}
          />
        </div>
      </div>

      {/* Bottom Filter Row: Building Type Pills + Match Count */}
      <div className="pt-2 border-t border-axis-border/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-mono uppercase text-axis-text-muted mr-1">
            TYPE:
          </span>
          {buildingTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded-axis-xs transition-colors whitespace-nowrap',
                selectedType === type
                  ? 'bg-axis-accent text-white font-medium shadow-axis-xs'
                  : 'bg-axis-surface/60 text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface border border-axis-border/80'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="font-mono text-[11px] text-axis-text-muted">
          <span>MATCHES: </span>
          <span className="text-axis-text-primary font-semibold">{totalMatches} PROJECTS</span>
        </div>
      </div>
    </div>
  );
}
