'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FolderKanban, Loader2, CheckCircle2, HardDrive, Compass } from 'lucide-react';
import { Project } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';
import {
  fadeUpVariants,
  staggerContainerVariants,
  cardHoverTransition,
} from '@/lib/constants/motion';

export interface DashboardStatsProps {
  projects: Project[];
}

export function DashboardStats({ projects }: DashboardStatsProps) {
  const shouldReduceMotion = useReducedMotion();

  // Derive counts dynamically from active projects
  const totalProjects = projects.filter((p) => p.status !== 'ARCHIVED').length;
  const processingCount = projects.filter(
    (p) => p.status === 'PROCESSING' || p.status === 'ANALYZING' || p.status === 'GENERATING'
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === 'COMPLETED' || p.status === 'RECONSTRUCTED'
  ).length;

  const stats = [
    {
      label: 'PROJECTS',
      value: String(totalProjects).padStart(2, '0'),
      caption: 'Total architectural projects',
      icon: FolderKanban,
      datum: 'DIR-01',
      trend: '+1 this week',
    },
    {
      label: 'PROCESSING',
      value: String(processingCount).padStart(2, '0'),
      caption: 'Currently being analyzed',
      icon: Loader2,
      datum: 'QUEUE-LIVE',
      pulse: processingCount > 0,
      trend: 'Active pipeline',
    },
    {
      label: 'COMPLETED',
      value: String(completedCount).padStart(2, '0'),
      caption: 'Spatial models generated',
      icon: CheckCircle2,
      datum: 'RECON-3D',
      trend: 'Ready for export',
    },
    {
      label: 'STORAGE',
      value: '2.4 GB',
      caption: 'Project CAD & mesh assets',
      icon: HardDrive,
      datum: 'TIER-01',
      trend: '48% of quota',
    },
  ];

  return (
    <motion.div
      variants={staggerContainerVariants(0.05, 0.05)}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={fadeUpVariants}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            transition={cardHoverTransition}
            className="p-4 rounded-axis-md border border-axis-border bg-axis-bg-elevated shadow-axis-xs hover:border-axis-border-strong hover:shadow-axis-sm transition-colors duration-150 flex flex-col justify-between space-y-3"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between text-axis-text-muted">
              <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
                {stat.label}
              </span>
              <Icon
                className={cn(
                  'w-4 h-4 text-axis-text-muted/80',
                  stat.pulse && 'animate-spin text-axis-accent'
                )}
              />
            </div>

            {/* Middle: Large Metric Value */}
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-medium tracking-tight text-axis-text-primary">
                {stat.value}
              </div>
              <p className="text-[11px] text-axis-text-secondary mt-0.5 line-clamp-1">
                {stat.caption}
              </p>
            </div>

            {/* Bottom: Technical Datum */}
            <div className="pt-2 border-t border-axis-border/60 flex items-center justify-between text-[10px] font-mono text-axis-text-muted/70">
              <span>{stat.datum}</span>
              <span className="text-axis-text-muted">{stat.trend}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
