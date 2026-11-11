'use client';

import * as React from 'react';
import { Plus, Compass, Sparkles, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DashboardHeroProps {
  onNewProject: () => void;
  userName?: string;
}

export function DashboardHero({ onNewProject, userName = 'Deepak' }: DashboardHeroProps) {
  return (
    <div className="relative pb-6 border-b border-axis-border/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4 select-none">
      <div className="space-y-1.5 max-w-2xl">
        {/* Technical Label & Datum Stamps */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-axis-text-muted uppercase tracking-wider">
          <span className="flex items-center gap-1 text-axis-accent font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
            AXIS / WORKSPACE
          </span>
          <span className="text-axis-border-strong">·</span>
          <span>WORKSPACE / 01</span>
          <span className="text-axis-border-strong hidden md:inline">·</span>
          <span className="hidden md:inline">PROJECT ENGINE / READY</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-axis-text-primary leading-tight">
          Welcome back, {userName}.
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-xs sm:text-sm text-axis-text-secondary leading-relaxed">
          Manage your architectural projects, floor plan analysis runs, and dimensional 3D models.
        </p>
      </div>

      {/* Primary Action Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onNewProject}
          className="shadow-axis-sm"
        >
          New Project
        </Button>
      </div>
    </div>
  );
}
