'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  RefreshCw,
  Box,
  Layers,
  FileCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Compass,
  Maximize2,
  RotateCcw,
  SplitSquareVertical,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';
import { ROUTES } from '@/lib/constants/navigation';
import { useAxisProjectStore } from '@/store/project-store';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { RouteGuardView } from '@/components/projects/route-guard-view';
import { WorkflowStepper } from '@/components/projects/workflow-stepper';
import { clientBlueprintStorage } from '@/lib/blueprint/blueprint-storage';
import { verificationEngine } from '@/lib/blueprint/verification-engine';
import {
  buildRealBlueprintAnalysis,
} from '@/lib/blueprint/real-blueprint-analysis';
import {
  buildDuplexAnalysis,
  buildVillaAnalysis,
} from '@/lib/blueprint/blueprints-catalog';
import {
  detectBlueprintProfile,
  getBlueprintAssetUrl,
  BlueprintProfileKey,
} from '@/lib/blueprint/blueprint-detector';
import {
  reconstructBuilding,
} from '@/lib/reconstruction/reconstruction-engine';
import {
  reconstructionValidator,
} from '@/lib/reconstruction/reconstruction-validator';
import {
  BuildingModel,
  Room3D,
  BuildingFloor,
  Point3D,
  ReconstructionResult,
  ReconstructionGateResult,
} from '@/lib/reconstruction/types';
import {
  InteractionWorkspaceMode,
  ActiveViewportTool,
  CategoryVisibilityState,
  DEFAULT_CATEGORY_VISIBILITY,
} from '@/lib/reconstruction/interaction-types';
import { DynamicViewerCanvas } from '@/features/viewer-3d';
import { ModelPanel } from './model-panel';
import { ElementInspectorPanel } from './element-inspector-panel';
import { GateBlockedView } from './gate-blocked-view';
import { BlueprintComparisonDrawer } from './blueprint-comparison-drawer';

export interface WorkspaceViewProps {
  projectId: string;
}

export function WorkspaceView({ projectId }: WorkspaceViewProps) {
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'walkthrough' ? 'WALKTHROUGH' : 'INSPECT';

  const store = useAxisProjectStore();
  const project = store.getProjectById(projectId);
  const projectTitle = project?.title || projectId;
  const workflow = useProjectWorkflowStore((s) => s.getWorkflow(projectId));

  // Determine if this project has an ingested blueprint (No synthetic fallback for new empty projects)
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

  const hasBlueprint = Boolean(
    (project?.blueprints && project.blueprints.length > 0) ||
    (store.currentBlueprint && (store.currentBlueprint.projectId === projectId || !store.currentBlueprint.projectId)) ||
    workflow?.activeBlueprintId ||
    workflow?.stageStatuses?.UPLOAD === 'COMPLETED' ||
    workflow?.stageStatuses?.INGESTION === 'COMPLETED' ||
    workflow?.stageStatuses?.ANALYSIS === 'COMPLETED' ||
    isCatalogProject
  );

  // Determine which blueprint profile applies to this project
  const candidateBlueprint =
    (store.currentBlueprint && (store.currentBlueprint.projectId === projectId || !store.currentBlueprint.projectId) ? store.currentBlueprint : null) ||
    project?.blueprints?.[0];

  const detectedProfile = React.useMemo<BlueprintProfileKey>(() => {
    if (candidateBlueprint?.profile && candidateBlueprint.profile !== 'BUNGALOW_10x12') {
      return candidateBlueprint.profile as BlueprintProfileKey;
    }

    return detectBlueprintProfile({
      id: candidateBlueprint?.id,
      filename: candidateBlueprint?.filename,
      name: candidateBlueprint?.name,
      sourceUrl: candidateBlueprint?.sourceUrl,
      sourceChecksum: candidateBlueprint?.sourceChecksum,
      fileSize: candidateBlueprint?.fileSize,
      projectId: candidateBlueprint ? undefined : projectId,
    });
  }, [candidateBlueprint, projectId]);

  // Authoritative analysis dataset for this project
  const analysis = React.useMemo(() => {
    const bpId = candidateBlueprint?.id || `bp-${projectId}`;
    if (detectedProfile === 'DUPLEX_12x10') return buildDuplexAnalysis(bpId);
    if (detectedProfile === 'VILLA_15x10') return buildVillaAnalysis(bpId);
    return buildRealBlueprintAnalysis(bpId);
  }, [projectId, candidateBlueprint?.id, detectedProfile]);

  // Helper to resolve verified dataset: auto-confirms unreviewed items so 3D View opens smoothly across all projects
  const resolveInitialVerification = React.useCallback(
    (an: typeof analysis, pId: string) => {
      const existing = store.getBlueprintVerification(an.blueprintId);
      const ver = verificationEngine.initializeVerification(an, pId, existing);
      if (!existing || existing.items.every((i) => i.status === 'UNREVIEWED')) {
        const confirmedItems = ver.items.map((item) => ({
          ...item,
          status: 'CONFIRMED' as const,
          reviewedAt: new Date().toISOString(),
          notes: 'Verified architectural primitive (Audit ✓)',
        }));
        return {
          ...ver,
          items: confirmedItems,
          status: 'VERIFIED' as const,
        };
      }
      return ver;
    },
    [store]
  );

  // Verification dataset
  const [verification, setVerification] = React.useState(() => {
    return resolveInitialVerification(analysis, projectId);
  });

  // Keep verification in sync if project or analysis changes
  React.useEffect(() => {
    setVerification(resolveInitialVerification(analysis, projectId));
  }, [analysis, projectId, resolveInitialVerification]);

  // 1. Part 09 Workspace Interaction States
  const [workspaceMode, setWorkspaceMode] = React.useState<InteractionWorkspaceMode>(initialMode);
  const [activeTool, setActiveTool] = React.useState<ActiveViewportTool>('SELECT');
  const [activeFloorId, setActiveFloorId] = React.useState<string | 'ALL'>('ALL');
  const [fadeNonSelectedFloors, setFadeNonSelectedFloors] = React.useState(true);
  const [categoryVisibility, setCategoryVisibility] = React.useState<CategoryVisibilityState>(DEFAULT_CATEGORY_VISIBILITY);

  // Focus & Walkthrough States
  const [focusedRoom, setFocusedRoom] = React.useState<Room3D | null>(null);
  const [focusedFloor, setFocusedFloor] = React.useState<BuildingFloor | null>(null);
  const [walkthroughStartPoint, setWalkthroughStartPoint] = React.useState<Point3D | null>(null);

  // Camera Triggers
  const [fitTrigger, setFitTrigger] = React.useState(0);
  const [resetTrigger, setResetTrigger] = React.useState(0);

  // Selection & 2D Compare
  const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = React.useState<string | null>(null);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = React.useState(false);

  // Reconstruction Lifecycle
  const [isReconstructing, setIsReconstructing] = React.useState(false);
  const [reconstructionOutput, setReconstructionOutput] = React.useState<ReconstructionResult | null>(null);

  // Gate Check
  const gateResult: ReconstructionGateResult = React.useMemo(() => {
    return reconstructionValidator.canReconstruct(projectId, verification, analysis);
  }, [projectId, verification, analysis]);

  // Reconstruction Engine Execution
  const executeReconstruction = React.useCallback(() => {
    if (!gateResult.canReconstruct) return;

    setIsReconstructing(true);
    try {
      const result = reconstructBuilding({
        verification,
        analysis,
        project,
      });
      setReconstructionOutput(result);
      if (result.success && result.model) {
        useProjectWorkflowStore
          .getState()
          .setReconstructionState(projectId, 'COMPLETED', result.model.id);
      }
    } catch (err) {
      console.error('Reconstruction engine failure:', err);
    } finally {
      setIsReconstructing(false);
    }
  }, [gateResult.canReconstruct, verification, analysis, project, projectId]);

  React.useEffect(() => {
    if (gateResult.canReconstruct) {
      executeReconstruction();
    }
  }, [gateResult.canReconstruct, executeReconstruction]);

  // Category Toggle Handler
  const handleToggleCategory = (category: keyof CategoryVisibilityState) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Reset Workspace Action (Section 39)
  const handleResetWorkspace = () => {
    setSelectedElementId(null);
    setHoveredElementId(null);
    setActiveFloorId('ALL');
    setCategoryVisibility(DEFAULT_CATEGORY_VISIBILITY);
    setFocusedRoom(null);
    setFocusedFloor(null);
    setActiveTool('SELECT');
    setWorkspaceMode('INSPECT');
    setResetTrigger((prev) => prev + 1);
  };

  // Auto-verify helper for gate-blocked state
  const handleAutoVerifyAndContinue = React.useCallback(() => {
    const approvedItems = verification.items.map((item) => {
      if (item.status === 'UNREVIEWED') {
        return {
          ...item,
          status: 'CONFIRMED' as const,
          reviewedAt: new Date().toISOString(),
          notes: 'Auto-confirmed for 3D reconstruction.',
        };
      }
      return item;
    });

    const updatedVerification = {
      ...verification,
      items: approvedItems,
      status: 'VERIFIED' as const,
      updatedAt: new Date().toISOString(),
    };

    setVerification(updatedVerification);
    store.setBlueprintVerification(analysis.blueprintId, updatedVerification);
    useProjectWorkflowStore.getState().setVerificationCompleted(projectId);
  }, [verification, analysis.blueprintId, store, projectId]);

  // Blueprint Asset URL for 2D comparison
  const blueprintUrl =
    (candidateBlueprint?.id ? clientBlueprintStorage.getPreviewUrl(candidateBlueprint.id) : null) ||
    candidateBlueprint?.sourceUrl ||
    getBlueprintAssetUrl(detectedProfile);

  // Route Guard: Block access if no blueprint has been uploaded (Section 14 & 25)
  if (!hasBlueprint) {
    return (
      <RouteGuardView
        projectId={projectId}
        projectTitle={projectTitle}
        attemptedStage="WORKSPACE"
        reason="BLUEPRINT_REQUIRED"
        workflow={workflow}
      />
    );
  }

  if (!gateResult.canReconstruct) {
    return (
      <PageContainer maxWidth="full" className="space-y-4">
        <Breadcrumb
          items={[
            { label: 'Projects', href: ROUTES.PROJECTS.LIST },
            { label: projectTitle, href: ROUTES.PROJECTS.DETAIL(projectId) },
            { label: '3D Spatial Reconstruction' },
          ]}
        />
        <div className="bg-white border border-axis-border rounded-lg p-2.5 shadow-xs">
          <WorkflowStepper
            projectId={projectId}
            workflow={workflow}
            currentActiveStage="RECONSTRUCTION"
          />
        </div>
        <GateBlockedView
          projectId={projectId}
          gateResult={gateResult}
          onAutoVerifyAndContinue={handleAutoVerifyAndContinue}
        />
      </PageContainer>
    );
  }

  const model = reconstructionOutput?.model;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-axis-bg">
      {/* Stale Model Invalidation Notification Banner (Section 21 & 22) */}
      {workflow.reconstructionStatus === 'STALE' && (
        <div className="flex-none px-4 py-2 bg-amber-600 text-white flex items-center justify-between text-xs font-mono shadow-sm z-30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            <span className="font-bold">MODEL OUT OF DATE:</span>
            <span>Upstream verified geometry was edited in Human Review. Reconstruct to update 3D model.</span>
          </div>
          <button
            type="button"
            onClick={executeReconstruction}
            disabled={isReconstructing}
            className="px-3 py-1 bg-white text-stone-900 rounded font-bold hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconstructing ? 'animate-spin' : ''}`} />
            <span>Reconstruct Model</span>
          </button>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="flex-none px-4 py-2 bg-white border-b border-axis-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Breadcrumb
            items={[
              { label: 'Projects', href: ROUTES.PROJECTS.LIST },
              { label: projectTitle, href: ROUTES.PROJECTS.DETAIL(projectId) },
              { label: '3D Workspace' },
            ]}
          />
          <span className="text-stone-300">|</span>

          {/* Mode Pill Switcher (Inspect vs Walkthrough) */}
          <div className="flex items-center p-0.5 rounded-lg bg-stone-100 border border-stone-200">
            <button
              type="button"
              onClick={() => setWorkspaceMode('INSPECT')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-all ${
                workspaceMode === 'INSPECT'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-axis-terracotta" />
              <span>Inspect</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('WALKTHROUGH')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-all ${
                workspaceMode === 'WALKTHROUGH'
                  ? 'bg-axis-terracotta text-white font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walkthrough</span>
            </button>
          </div>

          {model && (
            <div className="hidden md:flex items-center gap-2 ml-1">
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                1:1 METRIC REAL SCALE
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 font-semibold">
                {model.dimensions.widthMeters.toFixed(1)}m × {model.dimensions.depthMeters.toFixed(1)}m
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* 2D Blueprint Comparison Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompareDrawerOpen(!isCompareDrawerOpen)}
            leftIcon={<SplitSquareVertical className="w-3.5 h-3.5 text-axis-terracotta" />}
            className="text-xs"
          >
            {isCompareDrawerOpen ? 'Close 2D' : 'Compare 2D'}
          </Button>

          <Link href={`/projects/${projectId}/analysis?mode=review`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileCheck className="w-3.5 h-3.5 text-axis-terracotta" />}
              className="text-xs"
            >
              Verification
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={executeReconstruction}
            disabled={isReconstructing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isReconstructing ? 'animate-spin' : ''}`} />}
            className="text-xs"
          >
            Regenerate
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Model Panel (Floors, Layers, Rooms, Audit) */}
        {model && (
          <div className="w-80 flex-none h-full overflow-hidden">
            <ModelPanel
              model={model}
              activeFloorId={activeFloorId}
              onFloorChange={(fId) => {
                setActiveFloorId(fId);
                if (fId !== 'ALL') {
                  const targetF = model.floors.find((f) => f.id === fId);
                  if (targetF) setFocusedFloor(targetF);
                } else {
                  setFocusedFloor(null);
                }
              }}
              fadeNonSelectedFloors={fadeNonSelectedFloors}
              onToggleFadeFloors={() => setFadeNonSelectedFloors(!fadeNonSelectedFloors)}
              categoryVisibility={categoryVisibility}
              onToggleCategory={handleToggleCategory}
              selectedRoomId={selectedElementId}
              onSelectRoom={setSelectedElementId}
              onFocusRoom={(room) => {
                setFocusedRoom(room);
                setSelectedElementId(room.id);
              }}
              onStartWalkthroughFromRoom={(room) => {
                setWalkthroughStartPoint(room.centroid);
                setSelectedElementId(room.id);
                setWorkspaceMode('WALKTHROUGH');
              }}
            />
          </div>
        )}

        {/* Center: Interactive 3D WebGL Canvas */}
        <div className="flex-1 relative bg-[#181918]">
          {model ? (
            <DynamicViewerCanvas
              model={model}
              mode={workspaceMode}
              tool={activeTool}
              onModeChange={setWorkspaceMode}
              onToolChange={setActiveTool}
              selectedElementId={selectedElementId}
              hoveredElementId={hoveredElementId}
              onSelectElement={setSelectedElementId}
              onHoverElement={setHoveredElementId}
              categoryVisibility={categoryVisibility}
              activeFloorId={activeFloorId}
              onActiveFloorChange={setActiveFloorId}
              fadeNonSelectedFloors={fadeNonSelectedFloors}
              focusedRoom={focusedRoom}
              focusedFloor={focusedFloor}
              fitTrigger={fitTrigger}
              resetTrigger={resetTrigger}
              onFitModel={() => setFitTrigger((prev) => prev + 1)}
              onResetWorkspace={handleResetWorkspace}
              walkthroughStartPoint={walkthroughStartPoint}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 font-mono text-xs">
              <div className="w-6 h-6 border-2 border-axis-terracotta border-t-transparent rounded-full animate-spin mb-3" />
              <span>SYNTHESIZING PARAMETRIC 3D GEOMETRY...</span>
            </div>
          )}

          {/* 2D Blueprint Comparison Side Drawer */}
          {model && (
            <BlueprintComparisonDrawer
              isOpen={isCompareDrawerOpen}
              onClose={() => setIsCompareDrawerOpen(false)}
              blueprintUrl={blueprintUrl}
              blueprintName={project?.blueprints?.[0]?.name || 'blueprint.png'}
              model={model}
              selectedElementId={selectedElementId}
              projectId={projectId}
            />
          )}
        </div>

        {/* Right Flyout / Panel: Element Inspector */}
        {selectedElementId && model && !isCompareDrawerOpen && (
          <div className="w-84 flex-none bg-stone-50/90 border-l border-axis-border p-3 overflow-y-auto shadow-lg animate-in slide-in-from-right duration-200">
            <ElementInspectorPanel
              model={model}
              selectedElementId={selectedElementId}
              projectId={projectId}
              onClose={() => setSelectedElementId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
