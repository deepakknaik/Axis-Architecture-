'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  ScanLine,
  Box,
  Compass,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  FileText,
  Ruler,
  Footprints,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/lib/constants/navigation';
import { useAxisProjectStore } from '@/store/project-store';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { WorkflowStepper } from '@/components/projects/workflow-stepper';
import { formatShortChecksum } from '@/lib/blueprint/checksum';

export default function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const store = useAxisProjectStore();
  const project = store.getProjectById(projectId);
  const workflowStore = useProjectWorkflowStore();
  const workflow = workflowStore.getWorkflow(projectId);

  const title = project?.title || projectId;
  const buildingType = project?.buildingType || 'Residential';
  const floorsCount = project?.floorsCount || 1;
  const units = project?.settings?.defaultScaleUnit || 'METRIC';

  // Resolve Blueprint from Project
  const activeBlueprint = project?.blueprints?.[0];

  // Dynamic Next Stage and Action derivation
  let nextActionLabel = 'Upload Architectural Blueprint';
  let nextActionHref = ROUTES.PROJECTS.BLUEPRINT(projectId);
  let nextActionIcon = <UploadCloud className="w-4 h-4" />;
  let stageHeadline = 'Blueprint Upload Required';
  let stageDescription =
    'Import an architectural floor plan drawing so AXIS can prepare it for computer vision analysis and 3D reconstruction.';

  if (workflow.stageStatuses.WORKSPACE === 'AVAILABLE') {
    nextActionLabel = 'Open 3D Spatial Workspace';
    nextActionHref = ROUTES.PROJECTS.WORKSPACE(projectId);
    nextActionIcon = <Box className="w-4 h-4" />;
    stageHeadline = '3D Building Model Ready';
    stageDescription =
      'Real-scale 1:1 parametric 3D model generated from verified architectural primitives. Ready for spatial inspection and first-person walkthrough.';
  } else if (workflow.stageStatuses.RECONSTRUCTION === 'AVAILABLE') {
    nextActionLabel = 'Launch 3D Reconstruction';
    nextActionHref = ROUTES.PROJECTS.WORKSPACE(projectId);
    nextActionIcon = <Layers className="w-4 h-4" />;
    stageHeadline = 'Verification Complete — Ready for 3D';
    stageDescription =
      'All architectural detections have been validated. The reconstruction gate is unlocked to synthesize the canonical 3D model.';
  } else if (workflow.stageStatuses.VERIFICATION === 'AVAILABLE' || workflow.stageStatuses.VERIFICATION === 'NEEDS_REVIEW') {
    nextActionLabel = 'Review Architectural Detections';
    nextActionHref = `${ROUTES.PROJECTS.ANALYSIS(projectId)}?mode=review`;
    nextActionIcon = <FileCheck className="w-4 h-4" />;
    stageHeadline = 'Human Verification Review Required';
    stageDescription =
      'Vector elements (walls, doors, windows, spaces) have been detected. Inspect and confirm primitives to ensure spatial accuracy before 3D generation.';
  } else if (workflow.stageStatuses.ANALYSIS === 'AVAILABLE') {
    nextActionLabel = 'Begin Architectural Analysis';
    nextActionHref = ROUTES.PROJECTS.ANALYSIS(projectId);
    nextActionIcon = <ScanLine className="w-4 h-4" />;
    stageHeadline = 'Blueprint Ready for Vector Analysis';
    stageDescription =
      'Source drawing has been securely ingested with SHA-256 integrity verification. Run analysis to detect walls, fenestrations, and room boundaries.';
  }

  // Model is stale warning
  const isModelStale = workflow.reconstructionStatus === 'STALE';

  return (
    <PageContainer maxWidth="default" className="space-y-6">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Projects', href: ROUTES.PROJECTS.LIST },
          { label: title },
        ]}
      />

      {/* 2. Project Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-axis-border gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-axis-text-muted uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-axis-terracotta" />
            <span>ID: {projectId}</span>
            <span>·</span>
            <span>TYPE: {buildingType}</span>
            <span>·</span>
            <span>LEVELS: {floorsCount}</span>
            <span>·</span>
            <span>UNITS: {units}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-axis-text-primary">
              {title}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200 font-semibold">
              {workflow.currentStage}
            </span>
          </div>
          <p className="text-xs text-axis-text-secondary mt-1 max-w-2xl">
            {project?.description ||
              'Parametric architectural project envelope coordinating immutable source blueprints, verified spatial primitives, and real-scale 3D geometry.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={ROUTES.PROJECTS.LIST}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              All Projects
            </Button>
          </Link>
          <Link href={nextActionHref}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={nextActionIcon}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-medium text-xs shadow-sm"
            >
              {nextActionLabel}
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Interactive Architectural Workflow Stepper */}
      <Card className="bg-white border-axis-border p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-axis-terracotta" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
              Architectural Workflow Pipeline
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            Click available stages to navigate
          </span>
        </div>
        <WorkflowStepper projectId={projectId} workflow={workflow} />
      </Card>

      {/* 4. Model Stale Warning Alert if upstream changed */}
      {isModelStale && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 flex-1">
            <p className="font-bold uppercase tracking-wide">
              BUILDING MODEL OUT OF DATE (STALE GEOMETRY)
            </p>
            <p className="text-amber-800 leading-relaxed">
              Upstream architectural detections were modified in Human Review after the 3D model was generated.
              The 3D model must be regenerated to reflect the verified source truth.
            </p>
          </div>
          <Link href={ROUTES.PROJECTS.WORKSPACE(projectId)}>
            <Button variant="primary" size="sm" className="text-xs whitespace-nowrap">
              Regenerate Model
            </Button>
          </Link>
        </div>
      )}

      {/* 5. Two-Column Workspace Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Stage & Next Action Card */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-white border-axis-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-axis-terracotta">
                Current Stage Focus: {workflow.currentStage}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                {stageHeadline}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                {stageDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-3">
              <Link href={nextActionHref}>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={nextActionIcon}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="text-xs font-semibold px-5"
                >
                  {nextActionLabel}
                </Button>
              </Link>

              {activeBlueprint && (
                <Link href={ROUTES.PROJECTS.BLUEPRINT(projectId)}>
                  <Button variant="outline" size="md" className="text-xs">
                    Inspect Blueprint
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Source Blueprint Asset Card */}
          <Card className="bg-white border-axis-border p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-axis-terracotta" />
                <span>Source Blueprint Asset</span>
              </span>
              {activeBlueprint ? (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                  INGESTED & VERIFIED
                </span>
              ) : (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200 font-medium">
                  NOT UPLOADED
                </span>
              )}
            </div>

            {activeBlueprint ? (
              <div className="text-xs space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-sans">Filename:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[260px]">
                    {activeBlueprint.name || activeBlueprint.filename}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-sans">SHA-256 Digest:</span>
                  <span className="text-stone-800 text-[11px]">
                    {formatShortChecksum(activeBlueprint.sourceChecksum || 'sha256-verified', 10, 10)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-sans">Dimensions:</span>
                  <span className="text-stone-800">
                    {activeBlueprint.width || 1024} × {activeBlueprint.height || 682} px
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-stone-500">
                  No architectural drawing has been associated with this project.
                </p>
                <Link href={ROUTES.PROJECTS.BLUEPRINT(projectId)}>
                  <Button variant="outline" size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>
                    Upload Drawing
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Technical Traceability & Stage Status Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white border-axis-border p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-stone-200">
              <ShieldCheck className="w-4 h-4 text-axis-terracotta" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900">
                Architectural Traceability Audit
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Source Blueprint:</span>
                  <span className="font-bold text-stone-800">
                    {workflow.activeBlueprintId || 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500 font-sans">Ingestion Status:</span>
                  <span className="text-emerald-700 font-semibold">{workflow.ingestionStatus}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Analysis Engine:</span>
                  <span className="font-bold text-stone-800">{workflow.analysisStatus}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500 font-sans">Version:</span>
                  <span className="text-stone-700">v{workflow.versions.analysisVersion}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">Human Verification:</span>
                  <span className="font-bold text-stone-800">{workflow.verificationStatus}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500 font-sans">Audit Version:</span>
                  <span className="text-stone-700">v{workflow.versions.verificationVersion}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-sans">3D Reconstruction:</span>
                  <span className={`font-bold ${isModelStale ? 'text-amber-600' : 'text-stone-800'}`}>
                    {workflow.reconstructionStatus}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500 font-sans">Source Audit Ref:</span>
                  <span className="text-stone-700">
                    v{workflow.versions.sourceVerificationVersion}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
