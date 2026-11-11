'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Project } from '@/lib/types/architectural';
import { ProjectCard } from '@/components/projects/project-card';
import { ROUTES } from '@/lib/constants/navigation';

export interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  // Show up to 3 active recent projects
  const recentList = projects
    .filter((p) => p.status !== 'ARCHIVED')
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-axis-accent" />
          <h2 className="text-base font-medium tracking-tight text-axis-text-primary">
            Recent Projects
          </h2>
          <span className="font-mono text-[10px] text-axis-text-muted bg-axis-surface px-1.5 py-0.5 rounded border border-axis-border">
            {recentList.length} ACTIVE
          </span>
        </div>

        <Link
          href={ROUTES.PROJECTS.LIST}
          className="inline-flex items-center gap-1 text-xs font-medium text-axis-text-secondary hover:text-axis-accent transition-colors"
        >
          <span>View all projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentList.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
