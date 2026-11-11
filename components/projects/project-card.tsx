'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MoreVertical,
  ArrowUpRight,
  Edit2,
  Copy,
  Archive,
  Layers,
  Clock,
} from 'lucide-react';
import { Project } from '@/lib/types/architectural';
import { AxisStatusType } from '@/lib/types/status';
import { StatusBadge } from '@/components/ui/status-badge';
import { Dropdown } from '@/components/ui/dropdown';
import { BlueprintThumbnail } from './blueprint-thumbnail';
import { ROUTES } from '@/lib/constants/navigation';
import { useAxisProjectStore } from '@/store/project-store';
import { cardHoverTransition } from '@/lib/constants/motion';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const router = useRouter();
  const archiveProject = useAxisProjectStore((s) => s.archiveProject);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Map architectural status safely to AxisStatusType
  const statusKey: AxisStatusType = (
    project.status === 'PLANNING' || project.status === 'READY'
      ? 'READY'
      : project.status === 'ANALYSIS' || project.status === 'ANALYZING'
      ? 'ANALYZING'
      : project.status === 'REVIEW' || project.status === 'NEEDS_REVIEW'
      ? 'NEEDS_REVIEW'
      : project.status === 'VERIFIED'
      ? 'VERIFIED'
      : project.status === 'GENERATING'
      ? 'GENERATING'
      : project.status === 'COMPLETED' || project.status === 'RECONSTRUCTED'
      ? 'COMPLETED'
      : project.status === 'FAILED'
      ? 'FAILED'
      : 'PROCESSING'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={() => router.push(ROUTES.PROJECTS.DETAIL(project.id))}
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.008 }}
      transition={cardHoverTransition}
      className={cn(
        'group relative flex flex-col rounded-axis-md border border-axis-border bg-axis-bg-elevated shadow-axis-xs hover:shadow-axis-md hover:border-axis-border-strong transition-all duration-200 cursor-pointer select-none overflow-hidden',
        className
      )}
    >
      {/* Toast Feedback for mock actions */}
      {toastMessage && (
        <div className="absolute top-3 left-3 right-3 z-30 p-2 rounded-axis-xs bg-[#252525] text-axis-bg text-center font-mono text-[11px] shadow-axis-md animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

      {/* Blueprint Visual Thumbnail with Micro-Zoom */}
      <div className="overflow-hidden">
        <div className="transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <BlueprintThumbnail
            variant={project.thumbnailVariant || 'default'}
            codeName={project.codeName || `PRJ-${project.id.slice(-4).toUpperCase()}`}
          />
        </div>
      </div>

      {/* Project Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider block mb-0.5">
                {project.buildingType || 'Residential'}
              </span>
              <h3 className="text-sm font-semibold tracking-tight text-axis-text-primary group-hover:text-axis-accent transition-colors line-clamp-1">
                {project.title}
              </h3>
            </div>

            {/* Stop propagation on dropdown click */}
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    aria-label={`Options for ${project.title}`}
                    className="p-1 rounded text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                }
                items={[
                  {
                    id: 'open',
                    label: 'Open Project',
                    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
                    onClick: () => router.push(ROUTES.PROJECTS.DETAIL(project.id)),
                  },
                  {
                    id: 'rename',
                    label: 'Rename',
                    icon: <Edit2 className="w-3.5 h-3.5" />,
                    onClick: () => showToast(`Rename '${project.title}' (Prototype)`),
                  },
                  {
                    id: 'duplicate',
                    label: 'Duplicate Project',
                    icon: <Copy className="w-3.5 h-3.5" />,
                    onClick: () => showToast(`Project duplicated as copy`),
                  },
                  {
                    id: 'archive',
                    label: 'Archive',
                    icon: <Archive className="w-3.5 h-3.5" />,
                    destructive: true,
                    onClick: () => {
                      archiveProject(project.id);
                      showToast(`Archived ${project.title}`);
                    },
                  },
                ]}
              />
            </div>
          </div>

          {project.description && (
            <p className="text-xs text-axis-text-secondary line-clamp-2 mt-1 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Project Card Footer: Floors, Modified Time, Status */}
        <div className="pt-3 border-t border-axis-border/60 flex items-center justify-between text-[11px] text-axis-text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <Layers className="w-3 h-3 text-axis-accent" />
              <span>{project.floorsCount || 2} Floors</span>
            </span>
            <span className="flex items-center gap-1 text-[10px]">
              <Clock className="w-3 h-3" />
              <span>{project.lastModified || 'Recent'}</span>
            </span>
          </div>

          <StatusBadge status={statusKey} size="sm" showIcon={false} />
        </div>
      </div>
    </motion.div>
  );
}
