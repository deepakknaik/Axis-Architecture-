'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Check,
  Lock,
  AlertCircle,
  Clock,
  ArrowRight,
  Footprints,
  Box,
  Layers,
  FileCheck,
  ScanLine,
  UploadCloud,
  Compass,
} from 'lucide-react';
import {
  WorkflowStage,
  WorkflowStageStatus,
  ProjectWorkflowState,
} from '@/store/project-workflow-store';
import { ROUTES } from '@/lib/constants/navigation';

export interface WorkflowStepperProps {
  projectId: string;
  workflow: ProjectWorkflowState;
  currentActiveStage?: WorkflowStage;
  className?: string;
}

interface StepDefinition {
  key: WorkflowStage;
  number: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  getHref: (projectId: string) => string;
}

const WORKFLOW_STEPS: StepDefinition[] = [
  {
    key: 'PROJECT',
    number: '01',
    label: 'Project',
    sublabel: 'Specification',
    icon: Compass,
    getHref: (pId) => ROUTES.PROJECTS.DETAIL(pId),
  },
  {
    key: 'UPLOAD',
    number: '02',
    label: 'Upload',
    sublabel: 'Ingestion & Hash',
    icon: UploadCloud,
    getHref: (pId) => ROUTES.PROJECTS.BLUEPRINT(pId),
  },
  {
    key: 'ANALYSIS',
    number: '03',
    label: 'Analysis',
    sublabel: 'Vector Extraction',
    icon: ScanLine,
    getHref: (pId) => ROUTES.PROJECTS.ANALYSIS(pId),
  },
  {
    key: 'VERIFICATION',
    number: '04',
    label: 'Verify',
    sublabel: 'Human-in-the-Loop',
    icon: FileCheck,
    getHref: (pId) => `${ROUTES.PROJECTS.ANALYSIS(pId)}?mode=review`,
  },
  {
    key: 'RECONSTRUCTION',
    number: '05',
    label: 'Reconstruct',
    sublabel: 'Parametric Gate',
    icon: Layers,
    getHref: (pId) => ROUTES.PROJECTS.WORKSPACE(pId),
  },
  {
    key: 'WORKSPACE',
    number: '06',
    label: '3D Model',
    sublabel: 'Spatial Viewport',
    icon: Box,
    getHref: (pId) => ROUTES.PROJECTS.WORKSPACE(pId),
  },
  {
    key: 'WALKTHROUGH',
    number: '07',
    label: 'Walkthrough',
    sublabel: '1.65m Eye-Level',
    icon: Footprints,
    getHref: (pId) => `${ROUTES.PROJECTS.WORKSPACE(pId)}?mode=walkthrough`,
  },
];

export function WorkflowStepper({
  projectId,
  workflow,
  currentActiveStage,
  className = '',
}: WorkflowStepperProps) {
  // Calculate verified progress along steps
  const completedIdx = WORKFLOW_STEPS.map((s) => workflow.stageStatuses[s.key] === 'COMPLETED');
  let lastCompleted = -1;
  for (let i = 0; i < completedIdx.length; i++) {
    if (completedIdx[i]) lastCompleted = i;
  }
  const progressRatio = lastCompleted >= 0 ? lastCompleted / (WORKFLOW_STEPS.length - 1) : 0;

  return (
    <div className={`w-full overflow-x-auto py-2 select-none ${className}`}>
      <div className="flex items-center min-w-[760px] justify-between relative px-2">
        {/* Background Inactive Connecting Drafting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-stone-200 z-0 pointer-events-none" />

        {/* Active Progress Drafting Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[1.5px] bg-emerald-500/80 z-0 pointer-events-none transition-all duration-500 ease-out"
          style={{ width: `calc((100% - 3rem) * ${progressRatio})` }}
        />

        {WORKFLOW_STEPS.map((step, idx) => {
          const status: WorkflowStageStatus = workflow.stageStatuses[step.key] || 'LOCKED';
          const isCurrent = currentActiveStage ? currentActiveStage === step.key : workflow.currentStage === step.key;
          const isInteractive = status === 'AVAILABLE' || status === 'COMPLETED' || status === 'NEEDS_REVIEW';
          const href = step.getHref(projectId);

          // Render step circle styling based on status
          let circleBg = 'bg-stone-100 text-stone-400 border-stone-300';
          let badgeText = status;
          let badgeClass = 'text-stone-400 bg-stone-100';

          if (isCurrent) {
            circleBg = 'bg-axis-terracotta text-white border-axis-terracotta ring-4 ring-axis-terracotta/20';
            badgeClass = 'text-axis-terracotta bg-axis-terracotta/10 font-bold';
          } else if (status === 'COMPLETED') {
            circleBg = 'bg-emerald-50 text-emerald-700 border-emerald-500';
            badgeClass = 'text-emerald-700 bg-emerald-50 font-semibold';
          } else if (status === 'AVAILABLE') {
            circleBg = 'bg-white text-stone-800 border-stone-600 hover:border-axis-terracotta';
            badgeClass = 'text-stone-700 bg-stone-100 font-medium';
          } else if (status === 'NEEDS_REVIEW') {
            circleBg = 'bg-amber-50 text-amber-700 border-amber-500';
            badgeClass = 'text-amber-700 bg-amber-50 font-bold';
          } else if (status === 'PROCESSING') {
            circleBg = 'bg-amber-50 text-amber-800 border-amber-400 animate-pulse';
            badgeClass = 'text-amber-800 bg-amber-100 font-bold';
          } else if (status === 'FAILED') {
            circleBg = 'bg-red-50 text-red-600 border-red-400';
            badgeClass = 'text-red-700 bg-red-100 font-bold';
          }

          const content = (
            <div className="flex flex-col items-center group relative z-10">
              {/* Stepper Node Circle */}
              <div
                className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono text-xs transition-all ${circleBg}`}
              >
                {status === 'COMPLETED' && !isCurrent ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : status === 'LOCKED' ? (
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <span className="font-bold">{step.number}</span>
                )}
              </div>

              {/* Step Labels */}
              <div className="mt-2 text-center">
                <span
                  className={`block text-xs font-mono tracking-tight transition-colors ${
                    isCurrent
                      ? 'font-bold text-stone-900'
                      : isInteractive
                      ? 'font-medium text-stone-800 group-hover:text-axis-terracotta'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="block text-[9px] font-mono text-stone-500">
                  {step.sublabel}
                </span>
                <span
                  className={`inline-block mt-0.5 px-1 py-0.2 rounded text-[8px] font-mono uppercase tracking-wider ${badgeClass}`}
                >
                  {status}
                </span>
              </div>
            </div>
          );

          if (isInteractive) {
            return (
              <Link
                key={step.key}
                href={href}
                className="cursor-pointer focus:outline-none"
                title={`${step.number} ${step.label} — ${status}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={step.key}
              className="cursor-not-allowed opacity-80"
              title={`${step.number} ${step.label} — Prerequisite Required (Locked)`}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
