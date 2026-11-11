'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Cpu,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/lib/constants/navigation';
import { useAxisProjectStore } from '@/store/project-store';
import { clientBlueprintStorage } from '@/lib/blueprint/blueprint-storage';
import {
  BlueprintAnalysis,
  AnalysisStatus,
  ArchitecturalElement,
  RoomElement,
} from '@/lib/types/architectural';
import {
  DEFAULT_PROTOTYPE_ANALYSIS,
  buildRealBlueprintAnalysis,
  buildDuplexAnalysis,
  buildVillaAnalysis,
} from '@/lib/constants/analysis-data';
import { analyzeBlueprint } from '@/lib/blueprint/analysis-engine';
import { detectBlueprintProfile, getBlueprintAssetUrl, BlueprintProfileKey } from '@/lib/blueprint/blueprint-detector';

// Part 06 Components
import { AnalysisCanvas } from '@/components/blueprint/analysis-canvas';
import { AnalysisToolbar } from '@/components/blueprint/analysis-toolbar';
import { AnalysisLegend, OverlayVisibilityState } from '@/components/blueprint/analysis-legend';
import { AnalysisSummary } from '@/components/blueprint/analysis-summary';
import { AnalysisDimensions } from '@/components/blueprint/analysis-dimensions';
import { AnalysisRooms } from '@/components/blueprint/analysis-rooms';
import { AnalysisElementDetail } from '@/components/blueprint/analysis-element-detail';
import { AnalysisPipeline } from '@/components/blueprint/analysis-pipeline';

// Part 07 Verification Workspace
import { VerificationWorkspace } from '@/components/blueprint/verification-workspace';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { RouteGuardView } from '@/components/projects/route-guard-view';
import { WorkflowStepper } from '@/components/projects/workflow-stepper';

export interface AnalysisWorkspaceViewProps {
  projectId: string;
  initialMode?: 'analysis' | 'review';
}

export function AnalysisWorkspaceView({
  projectId,
  initialMode = 'analysis',
}: AnalysisWorkspaceViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedMode = (searchParams?.get('mode') as 'analysis' | 'review') || initialMode;

  // Workspace Mode: 'analysis' (Stage 03) or 'review' (Stage 04 Verification)
  const [workspaceMode, setWorkspaceMode] = React.useState<'analysis' | 'review'>(resolvedMode);

  // Project Store bindings
  const projects = useAxisProjectStore((s) => s.projects);
  const currentBlueprint = useAxisProjectStore((s) => s.currentBlueprint);
  const project = projects.find((p) => p.id === projectId);
  const projectTitle = project?.title || projectId;

  const workflow = useProjectWorkflowStore((s) => s.getWorkflow(projectId));

  // Resolve Blueprint Metadata (No synthetic fallback for new projects without blueprints)
  const isCatalogProject =
    projectId === 'proj_residence_01' ||
    projectId === 'proj_studio_residence' ||
    projectId === 'proj_villa_north' ||
    projectId === 'proj_coastal_house' ||
    projectId === 'proj_urban_residence' ||
    projectId === 'proj_office_hub' ||
    projectId.toLowerCase().includes('residence') ||
    projectId.toLowerCase().includes('studio') ||
    projectId.toLowerCase().includes('villa');

  const detectedProfile = React.useMemo<BlueprintProfileKey>(() => {
    const candidate =
      (currentBlueprint && (currentBlueprint.projectId === projectId || !currentBlueprint.projectId) ? currentBlueprint : null) ||
      project?.blueprints?.[0];

    if (candidate?.profile && candidate.profile !== 'BUNGALOW_10x12') {
      return candidate.profile as BlueprintProfileKey;
    }

    return detectBlueprintProfile({
      id: candidate?.id,
      filename: candidate?.filename,
      name: candidate?.name,
      sourceUrl: candidate?.sourceUrl,
      sourceChecksum: candidate?.sourceChecksum,
      fileSize: candidate?.fileSize,
      projectId: candidate ? undefined : projectId,
    });
  }, [currentBlueprint, project?.blueprints, projectId]);

  const activeBlueprint = React.useMemo(() => {
    const raw =
      (currentBlueprint && (currentBlueprint.projectId === projectId || !currentBlueprint.projectId) ? currentBlueprint : null) ||
      project?.blueprints?.[0];
    if (raw) return raw;

    if (isCatalogProject) {
      const assetUrl = getBlueprintAssetUrl(detectedProfile);
      return {
        id: `bp-${projectId}`,
        projectId,
        name: `${projectTitle}_Level_01.png`,
        filename: assetUrl.split('/').pop() || 'blueprint.png',
        sourceUrl: assetUrl,
        uploadedAt: '2026-10-28T18:00:00Z',
        status: 'READY' as const,
        width: 1024,
        height: 682,
      };
    }
    return null;
  }, [currentBlueprint, projectId, project?.blueprints, isCatalogProject, projectTitle, detectedProfile]);

  const previewUrl =
    activeBlueprint?.sourceUrl ||
    (activeBlueprint?.id ? clientBlueprintStorage.getPreviewUrl(activeBlueprint.id) : null) ||
    getBlueprintAssetUrl(detectedProfile);

  // Project-derived initial analysis (prevents cross-project flash)
  const initialAnalysis = React.useMemo(() => {
    const bpId = activeBlueprint?.id || `bp-${projectId}`;
    if (detectedProfile === 'DUPLEX_12x10') return buildDuplexAnalysis(bpId);
    if (detectedProfile === 'VILLA_15x10') return buildVillaAnalysis(bpId);
    if (activeBlueprint?.analysis && activeBlueprint.analysis.walls?.length > 0) {
      return activeBlueprint.analysis;
    }
    return buildRealBlueprintAnalysis(bpId);
  }, [activeBlueprint, projectId, detectedProfile]);

  // Analysis Lifecycle State
  const [analysisStatus, setAnalysisStatus] = React.useState<AnalysisStatus>('PREPARING');
  const [progressPercent, setProgressPercent] = React.useState<number>(20);
  const [stageMessage, setStageMessage] = React.useState<string>('Reading source blueprint raster...');
  const [analysis, setAnalysis] = React.useState<BlueprintAnalysis>(initialAnalysis);

  React.useEffect(() => {
    setAnalysis(initialAnalysis);
  }, [initialAnalysis]);

  // Canvas Viewport State (for Analysis Mode)
  const [zoom, setZoom] = React.useState<number>(1.0);
  const [showGrid, setShowGrid] = React.useState<boolean>(true);
  const [showLabels, setShowLabels] = React.useState<boolean>(true);
  const [showDimensions, setShowDimensions] = React.useState<boolean>(true);
  const [showDebugOverlay, setShowDebugOverlay] = React.useState<boolean>(false);

  // Overlay Visibility State
  const [visibility, setVisibility] = React.useState<OverlayVisibilityState>({
    walls: true,
    doors: true,
    windows: true,
    rooms: true,
    stairs: true,
    columns: true,
  });

  // Interactive Selection State
  const [selectedElement, setSelectedElement] = React.useState<ArchitecturalElement | null>(null);
  const [selectedRoom, setSelectedRoom] = React.useState<RoomElement | null>(null);

  // Tab state for right information panel on smaller screens
  const [activeTab, setActiveTab] = React.useState<'elements' | 'dimensions' | 'spaces'>('elements');

  // Trigger analysis sequence on mount
  React.useEffect(() => {
    if (!activeBlueprint?.id) return;
    let isMounted = true;

    async function runAnalysis() {
      try {
        const result = await analyzeBlueprint(activeBlueprint!.id, {
          blueprint: activeBlueprint!,
          simulateDelay: true,
          delayMs: 900,
          onProgress: (stage, pct, msg) => {
            if (isMounted) {
              setAnalysisStatus(stage);
              setProgressPercent(pct);
              setStageMessage(msg);
            }
          },
        });
        if (isMounted) {
          setAnalysis(result);
          setAnalysisStatus('READY');
          // Update workflow state: Analysis completed and verification available (Section 07)
          const hasUnresolved =
            (result.unresolvedItemsCount || 0) > 0 ||
            (result.verificationQueue?.length || 0) > 0;
          useProjectWorkflowStore
            .getState()
            .setAnalysisState(projectId, hasUnresolved ? 'NEEDS_REVIEW' : 'COMPLETED');
        }
      } catch {
        if (isMounted) {
          setAnalysisStatus('FAILED');
          setStageMessage('Analysis failed to extract geometry');
          useProjectWorkflowStore
            .getState()
            .setAnalysisState(projectId, 'FAILED', 'Analysis failed to extract geometry from blueprint');
        }
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [activeBlueprint, projectId]);

  // Zoom Actions
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 3.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleResetZoom = () => setZoom(1.0);
  const handleFitScreen = () => setZoom(0.85);

  const toggleVisibility = (key: keyof OverlayVisibilityState) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectRoom = (room: RoomElement | null) => {
    setSelectedRoom(room);
    setSelectedElement(room);
  };

  const handleSelectElement = (element: ArchitecturalElement | null) => {
    setSelectedElement(element);
    if (element?.type === 'ROOM') {
      setSelectedRoom(element as RoomElement);
    } else {
      setSelectedRoom(null);
    }
  };

  const isReviewMode = workspaceMode === 'review';

  // Route Guard: Block access if no blueprint has been uploaded/ingested (Section 14 & 25)
  if (!activeBlueprint) {
    return (
      <RouteGuardView
        projectId={projectId}
        projectTitle={projectTitle}
        attemptedStage={isReviewMode ? 'VERIFICATION' : 'ANALYSIS'}
        reason="BLUEPRINT_REQUIRED"
        workflow={workflow}
      />
    );
  }

  return (
    <PageContainer maxWidth="full" className="space-y-6">
      {/* 1. Header & Navigation Datums */}
      <div className="space-y-1">
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS.LIST },
            { label: projectTitle.toUpperCase(), href: ROUTES.PROJECTS.DETAIL(projectId) },
            {
              label: isReviewMode ? 'DETECTION VERIFICATION' : 'BLUEPRINT ANALYSIS',
            },
          ]}
        />
      </div>

      {/* Workflow Stepper */}
      <div className="bg-white border border-axis-border rounded-lg p-2.5 shadow-xs">
        <WorkflowStepper
          projectId={projectId}
          workflow={workflow}
          currentActiveStage={isReviewMode ? 'VERIFICATION' : 'ANALYSIS'}
        />
      </div>

      {/* 2. Top Banner / Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-axis-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-axis-text-primary">
              {isReviewMode ? 'Detection Verification & Review' : 'Architectural Analysis'}
            </h1>
            <StatusBadge
              status={
                isReviewMode
                  ? 'NEEDS_REVIEW'
                  : analysisStatus === 'READY'
                  ? 'COMPLETED'
                  : 'PROCESSING'
              }
              size="sm"
            />
          </div>

          <p className="text-xs sm:text-sm text-axis-text-secondary mt-1">
            {isReviewMode
              ? 'Review detected architectural elements before they become part of the validated building model.'
              : 'Review how AXIS interprets the uploaded architectural source drawing.'}
          </p>

          {/* Technical Metadata Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-axis-text-muted mt-2">
            <span>
              PROJECT: <strong className="text-axis-text-primary">{projectTitle}</strong>
            </span>
            <span>·</span>
            <span>
              SOURCE:{' '}
              <strong className="text-axis-text-primary">
                {activeBlueprint.filename || activeBlueprint.name}
              </strong>
            </span>
            <span>·</span>
            <span>
              ANALYSIS:{' '}
              <strong className="text-axis-text-primary">SOURCE-DERIVED</strong>
            </span>
            <span>·</span>
            <span>
              EXTENTS:{' '}
              <strong className="text-axis-accent font-semibold">10.00m × 12.00m</strong>
            </span>
          </div>
        </div>

        {/* Top Action Buttons & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Workspace Mode Quick Switcher */}
          <div className="flex items-center p-0.5 bg-axis-surface rounded-axis-sm border border-axis-border text-xs font-mono mr-1">
            <button
              type="button"
              onClick={() => setWorkspaceMode('analysis')}
              className={`px-3 py-1 rounded transition-colors ${
                !isReviewMode
                  ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs'
                  : 'text-axis-text-secondary hover:text-axis-text-primary'
              }`}
            >
              Analysis
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('review')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                isReviewMode
                  ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs'
                  : 'text-axis-text-secondary hover:text-axis-text-primary'
              }`}
            >
              <span>Verification</span>
              <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
            </button>
          </div>

          <Link href={ROUTES.PROJECTS.BLUEPRINT(projectId)}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Source
            </Button>
          </Link>

          {!isReviewMode ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setWorkspaceMode('review')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              disabled={analysisStatus !== 'READY'}
            >
              Start Verification
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                useProjectWorkflowStore.getState().setVerificationCompleted(projectId);
                router.push(ROUTES.PROJECTS.WORKSPACE(projectId));
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-axis-terracotta hover:bg-[#b85d32] text-white font-medium"
            >
              Proceed to 3D Reconstruction
            </Button>
          )}
        </div>
      </div>

      {/* 3. Stage Pipeline Progress Indicator */}
      <AnalysisPipeline
        status={analysisStatus}
        activeStage={workspaceMode}
        onSelectStage={(stage) => setWorkspaceMode(stage)}
      />

      {/* 4. Preparation Loading State Banner */}
      {analysisStatus === 'PREPARING' || analysisStatus === 'ANALYZING' ? (
        <Card className="p-4 bg-axis-bg-elevated border-axis-border shadow-axis-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-axis-accent animate-spin shrink-0" />
              <div>
                <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-axis-text-primary">
                  {stageMessage}
                </h3>
                <p className="text-[11px] text-axis-text-secondary">
                  Calibrating coordinates, extracting wall centerlines and room polygons...
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48 bg-axis-surface rounded-full h-2 overflow-hidden border border-axis-border">
              <div
                className="bg-axis-accent h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Card>
      ) : null}

      {/* Section 43: Analysis Partial / Scale Discrepancy Banner */}
      {analysis.unresolvedItemsCount > 0 && (
        <Card className="p-3.5 bg-amber-500/10 border-amber-500/30 text-xs shadow-axis-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-semibold text-amber-900 font-mono uppercase tracking-wide mr-2">
                  ANALYSIS PARTIAL
                </span>
                <span className="text-axis-text-secondary">
                  AXIS could not reliably resolve all architectural elements from this blueprint. No synthetic geometry has been substituted. Review unresolved regions before reconstruction.
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWorkspaceMode('review')}
              className="font-mono text-xs border-amber-500/40 text-amber-900 hover:bg-amber-500/10 shrink-0"
            >
              View Unresolved Elements ({analysis.unresolvedItemsCount})
            </Button>
          </div>
        </Card>
      )}

      {/* 5. WORKSPACE SWITCHER */}
      {isReviewMode ? (
        <VerificationWorkspace
          analysis={analysis}
          projectId={projectId}
          previewUrl={previewUrl}
        />
      ) : (
        /* Part 06 Analysis Workspace Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Blueprint Canvas & Toolbar (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <AnalysisCanvas
              analysis={analysis}
              previewUrl={previewUrl}
              visibility={visibility}
              showGrid={showGrid}
              showLabels={showLabels}
              showDimensions={showDimensions}
              showDebugOverlay={showDebugOverlay}
              zoom={zoom}
              onZoomChange={setZoom}
              selectedElement={selectedElement}
              onSelectElement={handleSelectElement}
              selectedRoomId={selectedRoom?.id || null}
              onSelectRoom={handleSelectRoom}
            />

            {/* Floating Canvas Toolbar & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <AnalysisToolbar
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
                onFitScreen={handleFitScreen}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid((g) => !g)}
                showLabels={showLabels}
                onToggleLabels={() => setShowLabels((l) => !l)}
                showDimensions={showDimensions}
                onToggleDimensions={() => setShowDimensions((d) => !d)}
                showDebugOverlay={showDebugOverlay}
                onToggleDebugOverlay={() => setShowDebugOverlay((d) => !d)}
              />

              <div className="font-mono text-[10px] text-axis-text-muted flex items-center gap-2">
                <span>DRAG TO PAN</span>
                <span>·</span>
                <span>WHEEL TO ZOOM</span>
                <span>·</span>
                <span>CLICK TO INSPECT</span>
              </div>
            </div>

            {/* Architectural Layer Legend & Visibility Toggles */}
            <AnalysisLegend
              visibility={visibility}
              onToggle={toggleVisibility}
              counts={{
                walls: analysis.walls?.length || 0,
                doors: analysis.doors?.length || 0,
                windows: analysis.windows?.length || 0,
                rooms: analysis.rooms?.length || 0,
                stairs: analysis.stairs?.length || 0,
                columns: analysis.columns?.length || 0,
              }}
            />
          </div>

          {/* Right Column: Technical Inspector & Summary Panels (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Tabs for mobile view switching */}
            <div className="flex lg:hidden border-b border-axis-border mb-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('elements')}
                className={`flex-1 py-1.5 text-center border-b-2 ${
                  activeTab === 'elements'
                    ? 'border-axis-accent text-axis-accent font-semibold'
                    : 'border-transparent text-axis-text-muted'
                }`}
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dimensions')}
                className={`flex-1 py-1.5 text-center border-b-2 ${
                  activeTab === 'dimensions'
                    ? 'border-axis-accent text-axis-accent font-semibold'
                    : 'border-transparent text-axis-text-muted'
                }`}
              >
                Calibration
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('spaces')}
                className={`flex-1 py-1.5 text-center border-b-2 ${
                  activeTab === 'spaces'
                    ? 'border-axis-accent text-axis-accent font-semibold'
                    : 'border-transparent text-axis-text-muted'
                }`}
              >
                Spaces ({analysis.rooms.length})
              </button>
            </div>

            {/* Selected Element Detail Inspector */}
            <div className={activeTab === 'elements' ? 'block' : 'hidden lg:block'}>
              <AnalysisElementDetail
                element={selectedElement}
                onClose={() => setSelectedElement(null)}
              />
            </div>

            {/* Analysis Summary Primitives Table */}
            <div className={activeTab === 'elements' ? 'block' : 'hidden lg:block'}>
              <AnalysisSummary analysis={analysis} />
            </div>

            {/* Calibration & Scale Inspector */}
            <div className={activeTab === 'dimensions' ? 'block' : 'hidden lg:block'}>
              <AnalysisDimensions analysis={analysis} />
            </div>

            {/* Spaces / Enclosed Regions List */}
            <div className={activeTab === 'spaces' ? 'block' : 'hidden lg:block'}>
              <AnalysisRooms
                rooms={analysis.rooms}
                selectedRoomId={selectedRoom?.id || null}
                onSelectRoom={handleSelectRoom}
              />
            </div>

            {/* Stage 04 Verification CTA */}
            <Card className="bg-axis-surface/60 border-axis-border p-4 space-y-3">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-axis-text-primary uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-axis-accent" />
                <span>Stage 04: Detection Verification</span>
              </div>
              <p className="text-xs text-axis-text-secondary leading-relaxed">
                {analysis.detections.totalDetected} detected architectural primitives are ready for quality control. Review flagged tolerances, adjust dimensions, and confirm geometry before 3D reconstruction.
              </p>
              <div className="pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setWorkspaceMode('review')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Enter Verification Mode (Stage 04)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
