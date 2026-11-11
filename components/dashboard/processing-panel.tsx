'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, ArrowUpRight, CheckCircle2, Box, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { ROUTES } from '@/lib/constants/navigation';

export interface ActiveProcessingItem {
  id: string;
  projectName: string;
  stageName: string;
  progressPercent: number;
  subtask: string;
  estimatedRemaining: string;
}

export function ProcessingPanel() {
  const activeTask: ActiveProcessingItem = {
    id: 'proj_villa_north',
    projectName: 'Villa North',
    stageName: 'Architectural 3D Reconstruction',
    progressPercent: 74,
    subtask: 'Extruding parametric wall meshes & door void booleans',
    estimatedRemaining: '~45s remaining',
  };

  return (
    <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-axis-accent animate-ping" />
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-axis-text-muted">
              ACTIVE PROCESSING QUEUE
            </CardTitle>
          </div>
          <StatusBadge status="GENERATING" size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-axis-text-primary text-sm">
              {activeTask.projectName}
            </span>
            <Link
              href={ROUTES.PROJECTS.DETAIL(activeTask.id)}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-axis-accent hover:underline"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-axis-text-secondary leading-snug">
            {activeTask.stageName}
          </p>
        </div>

        {/* Progress Bar Component */}
        <Progress
          value={activeTask.progressPercent}
          showPercentage
          label={activeTask.subtask}
          variant="terracotta"
        />

        <div className="pt-2 border-t border-axis-border/60 flex items-center justify-between text-[10px] font-mono text-axis-text-muted">
          <span>TASK ID: REC-9082</span>
          <span>{activeTask.estimatedRemaining}</span>
        </div>
      </CardContent>
    </Card>
  );
}
