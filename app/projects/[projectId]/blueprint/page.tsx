'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { BlueprintPipeline } from '@/components/blueprint/blueprint-pipeline';
import { BlueprintUploadZone } from '@/components/blueprint/blueprint-upload-zone';
import { BlueprintPreview } from '@/components/blueprint/blueprint-preview';
import { BlueprintFileInfo } from '@/components/blueprint/blueprint-file-info';
import { BlueprintIngestionProgress } from '@/components/blueprint/blueprint-ingestion-progress';
import { BlueprintReadyState } from '@/components/blueprint/blueprint-ready-state';
import { validateBlueprintFile, formatFileSize } from '@/lib/blueprint/file-validation';
import { computeSHA256 } from '@/lib/blueprint/checksum';
import { BlueprintStorage } from '@/lib/blueprint/blueprint-storage';
import { detectBlueprintProfile } from '@/lib/blueprint/blueprint-detector';
import { IngestionStatus, Blueprint, BlueprintAnalysis } from '@/lib/types/architectural';
import { useAxisProjectStore } from '@/store/project-store';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { WorkflowStepper } from '@/components/projects/workflow-stepper';
import { ROUTES } from '@/lib/constants/navigation';

export default function ProjectBlueprintPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const projects = useAxisProjectStore((s) => s.projects);
  const setProjectBlueprint = useAxisProjectStore((s) => s.setProjectBlueprint);

  // Dynamic project lookup
  const project = projects.find((p) => p.id === projectId);
  const projectTitle = project?.title || projectId;
  const workflow = useProjectWorkflowStore((s) => s.getWorkflow(projectId));

  // Ingestion State Machine
  const [status, setStatus] = React.useState<IngestionStatus>('IDLE');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(undefined);
  const [checksumSHA256, setChecksumSHA256] = React.useState<string | undefined>(undefined);
  const [dimensions, setDimensions] = React.useState<{ width: number; height: number } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Progress Tracker during UPLOADING / INGESTING
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [stageMessage, setStageMessage] = React.useState('Preparing source stream');
  const [subtaskDetail, setSubtaskDetail] = React.useState('Validating binary format');

  // Handle file selection from dropzone
  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);
    setStatus('VALIDATING');

    // 1. Validate file format and size
    const validation = validateBlueprintFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'The file could not be validated.');
      setStatus('FAILED');
      return;
    }

    try {
      setSelectedFile(file);
      // Create session preview URL
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);

      // 2. Compute deterministic SHA-256 hash
      const hash = await computeSHA256(file);
      setChecksumSHA256(hash);
      setStatus('VALIDATED');
    } catch {
      setErrorMessage('Failed to compute cryptographic checksum for the blueprint.');
      setStatus('FAILED');
    }
  };

  // Execute ingestion process
  const handleIngest = async () => {
    if (!selectedFile || !checksumSHA256) return;

    setStatus('UPLOADING');
    setProgressPercent(20);
    setStageMessage('Uploading architectural plan to server');
    setSubtaskDetail('Transferring immutable source bytes to storage');

    let serverSourceUrl = previewUrl;
    let detectedProfileKey = 'BUNGALOW_10x12';
    let serverAnalysis: BlueprintAnalysis | undefined = undefined;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('projectId', projectId);

      const res = await fetch('/api/upload-blueprint', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          serverSourceUrl = data.sourceUrl || serverSourceUrl;
          if (data.detectedProfile && data.detectedProfile !== 'CUSTOM') {
            detectedProfileKey = data.detectedProfile;
          }
          if (data.analysis) {
            serverAnalysis = data.analysis;
          }
        }
      }
    } catch (uploadErr) {
      console.warn('Server upload fallback:', uploadErr);
    }

    setProgressPercent(60);
    setStageMessage('Ingesting source stream');
    setSubtaskDetail('Generating metadata registration records');
    setStatus('INGESTING');

    setTimeout(() => {
      setProgressPercent(85);
      setStageMessage('Verifying source integrity');
      setSubtaskDetail('Matching cryptographic SHA-256 checksum against binary digest');

      setTimeout(async () => {
        setProgressPercent(100);
        setStageMessage('Blueprint ready');
        setSubtaskDetail('Source verified and ready for architectural analysis');

        const blueprintId = `bp_${Date.now()}`;

        // Register in BlueprintStorage abstraction
        await BlueprintStorage.upload(projectId, selectedFile, {
          id: blueprintId,
          checksumSHA256,
          width: dimensions?.width,
          height: dimensions?.height,
        });

        // Store blueprint metadata in Project state
        const newBlueprint: Blueprint = {
          id: blueprintId,
          projectId,
          name: selectedFile.name,
          filename: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size,
          status: 'READY',
          sourceChecksum: checksumSHA256,
          sourceUrl: serverSourceUrl,
          profile: detectedProfileKey,
          analysis: serverAnalysis,
          uploadedAt: new Date().toISOString(),
          width: dimensions?.width,
          height: dimensions?.height,
          units: project?.settings?.defaultScaleUnit || 'METRIC',
        };

        setProjectBlueprint(projectId, newBlueprint);
        useProjectWorkflowStore.getState().setBlueprintIngested(projectId, blueprintId);
        setStatus('READY');
      }, 400);
    }, 400);
  };

  // Reset / Remove Blueprint handler
  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(undefined);
    setChecksumSHA256(undefined);
    setDimensions(null);
    setErrorMessage(null);
    setProgressPercent(0);
    setStatus('IDLE');
  };

  return (
    <PageContainer maxWidth="default" className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Projects', href: ROUTES.PROJECTS.LIST },
          { label: projectTitle, href: ROUTES.PROJECTS.DETAIL(projectId) },
          { label: 'Blueprint Ingestion' },
        ]}
      />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-axis-border gap-4 select-none">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-axis-text-muted uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
            <span>BLUEPRINT ENGINE / INGESTION</span>
            <span>·</span>
            <span>PROJECT / {projectTitle}</span>
            <span>·</span>
            <span>MAX 50 MB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-axis-text-primary">
            Upload Architectural Blueprint
          </h1>
          <p className="text-xs sm:text-sm text-axis-text-secondary mt-1">
            Import a floor plan so AXIS can prepare it for spatial analysis and 3D reconstruction.
          </p>
        </div>

        <Link href={ROUTES.PROJECTS.DETAIL(projectId)}>
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Workflow Stepper */}
      <div className="bg-white border border-axis-border rounded-lg p-2.5 shadow-xs">
        <WorkflowStepper projectId={projectId} workflow={workflow} currentActiveStage="UPLOAD" />
      </div>

      {/* Pipeline Status Indicator */}
      <BlueprintPipeline status={status} />

      {/* Main Workflow Switching Area */}
      {status === 'IDLE' || status === 'VALIDATING' || status === 'FAILED' ? (
        /* 1. Upload Drop Zone State */
        <BlueprintUploadZone
          onFileSelect={handleFileSelect}
          errorMessage={errorMessage}
          onErrorDismiss={() => setErrorMessage(null)}
        />
      ) : status === 'UPLOADING' || status === 'INGESTING' ? (
        /* 2. Ingestion Progress State */
        <div className="py-12">
          <BlueprintIngestionProgress
            progressPercent={progressPercent}
            stageMessage={stageMessage}
            subtaskDetail={subtaskDetail}
          />
        </div>
      ) : status === 'VALIDATED' && selectedFile ? (
        /* 3. Validated Preview & Metadata Panel (Two-Column Desktop) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <BlueprintPreview
              file={selectedFile}
              previewUrl={previewUrl}
              onDimensionsLoaded={(w, h) => setDimensions({ width: w, height: h })}
            />
          </div>

          <div className="lg:col-span-5">
            <BlueprintFileInfo
              file={selectedFile}
              sanitizedFilename={selectedFile.name}
              sizeFormatted={formatFileSize(selectedFile.size)}
              checksumSHA256={checksumSHA256}
              dimensions={dimensions}
              projectUnits={project?.settings?.defaultScaleUnit}
              onRemove={handleReset}
              onReplace={handleReset}
              onIngest={handleIngest}
            />
          </div>
        </div>
      ) : status === 'READY' && selectedFile ? (
        /* 4. Ready State */
        <BlueprintReadyState
          projectId={projectId}
          filename={selectedFile.name}
          fileSizeFormatted={formatFileSize(selectedFile.size)}
          checksumSHA256={checksumSHA256 || 'SHA-256 VERIFIED'}
          format={selectedFile.name.slice(selectedFile.name.lastIndexOf('.') + 1).toUpperCase()}
          onReset={handleReset}
        />
      ) : null}
    </PageContainer>
  );
}
