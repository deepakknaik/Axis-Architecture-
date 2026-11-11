'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Layers,
  RefreshCw,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ROUTES } from '@/lib/constants/navigation';
import { WorkflowStage, ProjectWorkflowState } from '@/store/project-workflow-store';

export type GuardBlockReason =
  | 'BLUEPRINT_REQUIRED'
  | 'ANALYSIS_REQUIRED'
  | 'VERIFICATION_REQUIRED'
  | 'RECONSTRUCTION_REQUIRED'
  | 'MODEL_STALE'
  | 'WALKTHROUGH_BLOCKED';

export interface RouteGuardViewProps {
  projectId: string;
  projectTitle: string;
  attemptedStage: WorkflowStage;
  reason: GuardBlockReason;
  workflow?: ProjectWorkflowState;
  onReconstruct?: () => void;
  className?: string;
}

export function RouteGuardView({
  projectId,
  projectTitle,
  attemptedStage,
  reason,
  workflow,
  onReconstruct,
  className = '',
}: RouteGuardViewProps) {
  let title = 'Prerequisite Stage Required';
  let description = 'This architectural stage is locked until upstream dependencies are validated.';
  let primaryLabel = 'Go to Prerequisite';
  let primaryHref = ROUTES.PROJECTS.DETAIL(projectId);
  let icon = <Lock className="w-8 h-8 text-stone-500" />;
  let cardBorder = 'border-stone-300';
  let badgeColor = 'bg-stone-100 text-stone-800 border-stone-300';

  switch (reason) {
    case 'BLUEPRINT_REQUIRED':
      title = 'Source Blueprint Ingestion Required';
      description =
        'Architectural analysis requires an ingested, format-validated, and cryptographically verified blueprint plan. No blueprint is currently associated with this project.';
      primaryLabel = 'Upload Architectural Blueprint';
      primaryHref = ROUTES.PROJECTS.BLUEPRINT(projectId);
      icon = <UploadCloud className="w-8 h-8 text-axis-terracotta" />;
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
      break;

    case 'ANALYSIS_REQUIRED':
      title = 'Blueprint Analysis Required';
      description =
        'Detection review and 3D reconstruction require vector extraction from the source drawing. The uploaded blueprint has not yet undergone computer vision analysis.';
      primaryLabel = 'Run Architectural Analysis';
      primaryHref = ROUTES.PROJECTS.ANALYSIS(projectId);
      icon = <Layers className="w-8 h-8 text-axis-terracotta" />;
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
      break;

    case 'VERIFICATION_REQUIRED':
      title = 'Human Verification Review Required';
      description =
        'Strict Data Boundary: The 3D reconstruction engine only consumes verified geometry. Priority architectural detections or uncertain primitives must be inspected and validated before synthesis.';
      primaryLabel = 'Review Architectural Detections';
      primaryHref = `${ROUTES.PROJECTS.ANALYSIS(projectId)}?mode=review`;
      icon = <FileCheck className="w-8 h-8 text-axis-terracotta" />;
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
      break;

    case 'RECONSTRUCTION_REQUIRED':
      title = '3D Reconstruction Required';
      description =
        'The interactive 3D spatial model has not yet been generated from the verified geometry dataset. Run the parametric reconstruction engine to extrude real-scale building geometry.';
      primaryLabel = 'Launch 3D Reconstruction';
      primaryHref = ROUTES.PROJECTS.WORKSPACE(projectId);
      icon = <Layers className="w-8 h-8 text-axis-terracotta" />;
      badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
      break;

    case 'MODEL_STALE':
      title = 'Building Model Out of Date';
      description =
        'Upstream Invalidation: Verified architectural primitives have been updated since this 3D model was extruded. The current 3D geometry no longer reflects the verified source truth.';
      primaryLabel = 'Reconstruct 3D Model';
      primaryHref = '#';
      icon = <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />;
      cardBorder = 'border-amber-400 bg-amber-50/30';
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
      break;

    case 'WALKTHROUGH_BLOCKED':
      title = 'Walkthrough Navigation Unavailable';
      description =
        'First-person architectural walkthrough requires a validated 3D building envelope with complete floor slabs and wall collision boundaries.';
      primaryLabel = 'Return to Inspection View';
      primaryHref = ROUTES.PROJECTS.WORKSPACE(projectId);
      icon = <AlertTriangle className="w-8 h-8 text-stone-600" />;
      break;
  }

  return (
    <PageContainer maxWidth="narrow" className={`space-y-6 py-8 ${className}`}>
      <Breadcrumb
        items={[
          { label: 'Projects', href: ROUTES.PROJECTS.LIST },
          { label: projectTitle, href: ROUTES.PROJECTS.DETAIL(projectId) },
          { label: `Stage: ${attemptedStage}` },
        ]}
      />

      <Card className={`bg-white border ${cardBorder} shadow-axis-md p-6 sm:p-8 text-center max-w-xl mx-auto`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center shadow-xs">
            {icon}
          </div>

          <div className="space-y-2">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold border ${badgeColor}`}
            >
              PREREQUISITE GATE ACTIVE
            </span>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              {title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {reason === 'MODEL_STALE' && onReconstruct ? (
              <Button
                variant="primary"
                size="md"
                onClick={onReconstruct}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs"
              >
                Reconstruct 3D Model Now
              </Button>
            ) : (
              <Link href={primaryHref} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto text-xs"
                >
                  {primaryLabel}
                </Button>
              </Link>
            )}

            <Link href={ROUTES.PROJECTS.DETAIL(projectId)} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Compass className="w-4 h-4 text-stone-500" />}
                className="w-full sm:w-auto text-xs"
              >
                Project Overview
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
