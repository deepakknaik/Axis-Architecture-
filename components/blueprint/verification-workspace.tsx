'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  BlueprintAnalysis,
  BlueprintVerification,
  VerificationItem,
  ArchitecturalElement,
  RoomElement,
} from '@/lib/types/architectural';
import { verificationEngine } from '@/lib/blueprint/verification-engine';
import { useAxisProjectStore } from '@/store/project-store';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { ROUTES } from '@/lib/constants/navigation';

// Verification Components
import { AnalysisCanvas } from './analysis-canvas';
import { ReviewQueue } from './review-queue';
import { VerificationInspector } from './verification-inspector';
import { VerificationToolbar } from './verification-toolbar';
import { VerificationSummary } from './verification-summary';
import { VerificationHistory } from './verification-history';
import { RejectDetectionDialog } from './reject-detection-dialog';
import { OverlayVisibilityState } from './analysis-legend';
import { cn } from '@/lib/utils';

export interface VerificationWorkspaceProps {
  analysis: BlueprintAnalysis;
  projectId: string;
  previewUrl?: string | null;
  className?: string;
}

export function VerificationWorkspace({
  analysis,
  projectId,
  previewUrl,
  className,
}: VerificationWorkspaceProps) {
  const router = useRouter();
  const store = useAxisProjectStore();

  // 1. Initialize or Load Persisted Verification State (Section 43)
  const [verification, setVerification] = React.useState<BlueprintVerification>(() => {
    const existing = store.getBlueprintVerification(analysis.blueprintId);
    return verificationEngine.initializeVerification(analysis, projectId, existing);
  });

  // Save changes to Zustand / localStorage whenever verification state mutates
  const persistVerification = React.useCallback(
    (newVer: BlueprintVerification) => {
      setVerification(newVer);
      store.setBlueprintVerification(analysis.blueprintId, newVer);

      // Check if all items reviewed
      const allReviewed = newVer.items.every((i) => i.status !== 'UNREVIEWED');
      if (allReviewed) {
        useProjectWorkflowStore.getState().setVerificationCompleted(projectId);
      }
    },
    [analysis.blueprintId, store, projectId]
  );

  // 2. Selection & Navigation State
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(() => {
    const firstPriority = verification.items.find((i) => i.isPriorityReview && i.status === 'UNREVIEWED');
    return firstPriority ? firstPriority.id : verification.items[0]?.id || null;
  });

  const selectedItem = React.useMemo(() => {
    return verification.items.find((i) => i.id === selectedItemId) || null;
  }, [verification.items, selectedItemId]);

  const selectedElement = React.useMemo(() => {
    if (!selectedItem) return null;
    return selectedItem.verifiedGeometry || selectedItem.originalDetection;
  }, [selectedItem]);

  // 3. Editing State
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [hasUnsavedEdits, setHasUnsavedEdits] = React.useState<boolean>(false);

  // 4. Reject Confirmation Dialog State
  const [rejectDialogItem, setRejectDialogItem] = React.useState<VerificationItem | null>(null);

  // 5. Canvas Settings
  const [zoom, setZoom] = React.useState<number>(1.0);
  const [showGrid, setShowGrid] = React.useState<boolean>(true);
  const [showLabels, setShowLabels] = React.useState<boolean>(true);
  const [showDimensions, setShowDimensions] = React.useState<boolean>(true);
  const [showRejected, setShowRejected] = React.useState<boolean>(false);

  const [visibility, setVisibility] = React.useState<OverlayVisibilityState>({
    walls: true,
    doors: true,
    windows: true,
    rooms: true,
    stairs: true,
    columns: true,
  });

  // Right column tab on mobile / tablet
  const [activeRightTab, setActiveRightTab] = React.useState<'queue' | 'inspector' | 'summary' | 'history'>('inspector');

  // 6. Navigation Actions (Section 33 & 34)
  const handleSelectQueueItem = (item: VerificationItem) => {
    if (isEditing && hasUnsavedEdits) {
      if (!window.confirm('You have unsaved edits on the current element. Discard changes and switch element?')) {
        return;
      }
    }
    setIsEditing(false);
    setHasUnsavedEdits(false);
    setSelectedItemId(item.id);
    setActiveRightTab('inspector');
  };

  const handleNext = React.useCallback(() => {
    if (isEditing && hasUnsavedEdits) {
      if (!window.confirm('You have unsaved edits. Discard and proceed?')) return;
    }
    setIsEditing(false);
    setHasUnsavedEdits(false);

    const idx = verification.items.findIndex((i) => i.id === selectedItemId);
    if (idx !== -1 && idx < verification.items.length - 1) {
      setSelectedItemId(verification.items[idx + 1].id);
    }
  }, [isEditing, hasUnsavedEdits, verification.items, selectedItemId]);

  const handlePrevious = React.useCallback(() => {
    if (isEditing && hasUnsavedEdits) {
      if (!window.confirm('You have unsaved edits. Discard and proceed?')) return;
    }
    setIsEditing(false);
    setHasUnsavedEdits(false);

    const idx = verification.items.findIndex((i) => i.id === selectedItemId);
    if (idx > 0) {
      setSelectedItemId(verification.items[idx - 1].id);
    }
  }, [isEditing, hasUnsavedEdits, verification.items, selectedItemId]);

  const handleNextUnreviewed = () => {
    if (isEditing && hasUnsavedEdits) {
      if (!window.confirm('You have unsaved edits. Discard and proceed?')) return;
    }
    setIsEditing(false);
    setHasUnsavedEdits(false);

    const next = verificationEngine.getNextUnreviewed(verification, selectedItem?.elementId);
    if (next) {
      setSelectedItemId(next.id);
      setActiveRightTab('inspector');
    }
  };

  // 7. Verification Actions: Confirm, Edit, Reject
  const handleConfirm = React.useCallback(
    (elementId: string) => {
      setIsEditing(false);
      setHasUnsavedEdits(false);
      const updated = verificationEngine.confirmDetection(verification, elementId);
      persistVerification(updated);

      // Automatically prompt next unreviewed for efficient workflow (Section 33)
      const next = verificationEngine.getNextUnreviewed(updated, elementId);
      if (next) {
        setSelectedItemId(next.id);
      }
    },
    [verification, persistVerification]
  );

  const handleApplyEdit = (updatedElement: ArchitecturalElement, summary: string) => {
    if (!selectedItem) return;
    const res = verificationEngine.editDetection(
      verification,
      selectedItem.elementId,
      updatedElement,
      summary
    );
    if (res.success) {
      persistVerification(res.verification);
      useProjectWorkflowStore.getState().setVerificationItemModified(projectId);
      setIsEditing(false);
      setHasUnsavedEdits(false);

      // Advance to next unreviewed
      const next = verificationEngine.getNextUnreviewed(res.verification, selectedItem.elementId);
      if (next) {
        setSelectedItemId(next.id);
      }
    }
  };

  const handleConfirmReject = (elementId: string, reason: string) => {
    const updated = verificationEngine.rejectDetection(verification, elementId, reason);
    persistVerification(updated);
    setRejectDialogItem(null);
    setIsEditing(false);
    setHasUnsavedEdits(false);

    // Advance to next unreviewed
    const next = verificationEngine.getNextUnreviewed(updated, elementId);
    if (next) {
      setSelectedItemId(next.id);
    }
  };

  // 7b. Action: Complete / Approve Verification and Navigate to 3D Reconstruction
  const handleProceedToReconstruction = React.useCallback(() => {
    // Approve any remaining unreviewed items
    const approvedItems = verification.items.map((item) => {
      if (item.status === 'UNREVIEWED') {
        return {
          ...item,
          status: 'CONFIRMED' as const,
          reviewedAt: new Date().toISOString(),
          notes: 'Confirmed for 3D reconstruction.',
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

    persistVerification(updatedVerification);
    useProjectWorkflowStore.getState().setVerificationCompleted(projectId);
    router.push(ROUTES.PROJECTS.WORKSPACE(projectId));
  }, [verification, persistVerification, projectId, router]);

  // 7c. Action: Verify All At Once (Batch consensus confirmation)
  const handleVerifyAllAtOnce = React.useCallback(() => {
    setIsEditing(false);
    setHasUnsavedEdits(false);
    const updated = verificationEngine.confirmAllDetections(verification);
    persistVerification(updated);
    useProjectWorkflowStore.getState().setVerificationCompleted(projectId);
  }, [verification, persistVerification, projectId]);

  // Derived progress
  const progress = React.useMemo(() => {
    return verificationEngine.getVerificationProgress(verification);
  }, [verification]);

  const currentIndex = verification.items.findIndex((i) => i.id === selectedItemId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < verification.items.length - 1;
  const hasUnreviewed = progress.remainingCount > 0;

  // 8. Keyboard Shortcuts Listener (Section 35)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is in an input, textarea or select
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        if (selectedItem && !isEditing) {
          e.preventDefault();
          handleConfirm(selectedItem.elementId);
        }
      } else if (e.key === 'a' || e.key === 'A') {
        if (!isEditing && hasUnreviewed) {
          e.preventDefault();
          handleVerifyAllAtOnce();
        }
      } else if (e.key === 'e' || e.key === 'E') {
        if (selectedItem && !isEditing) {
          e.preventDefault();
          setIsEditing(true);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedItem && !isEditing) {
          e.preventDefault();
          setRejectDialogItem(selectedItem);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'Escape') {
        if (isEditing) {
          e.preventDefault();
          setIsEditing(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, isEditing, hasUnreviewed, handleConfirm, handleVerifyAllAtOnce, handleNext, handlePrevious]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 1. Review Toolbar (Section 32–35) */}
      <VerificationToolbar
        onPrevious={handlePrevious}
        onNext={handleNext}
        onNextUnreviewed={handleNextUnreviewed}
        onVerifyAll={handleVerifyAllAtOnce}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        hasUnreviewed={hasUnreviewed}
        showRejected={showRejected}
        onToggleShowRejected={() => setShowRejected((r) => !r)}
        onProceedToReconstruction={handleProceedToReconstruction}
      />

      {/* 2. Main Workspace Grid: Blueprint Review Canvas (8 cols) + Review Panels (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas + Controls */}
        <div className="lg:col-span-8 space-y-3">
          <AnalysisCanvas
            analysis={analysis}
            previewUrl={previewUrl}
            visibility={visibility}
            showGrid={showGrid}
            showLabels={showLabels}
            showDimensions={showDimensions}
            zoom={zoom}
            onZoomChange={setZoom}
            selectedElement={selectedElement}
            onSelectElement={(elem) => {
              if (elem) {
                const target = verification.items.find((i) => i.elementId === elem.id);
                if (target) handleSelectQueueItem(target);
              }
            }}
            selectedRoomId={selectedElement?.type === 'ROOM' ? selectedElement.id : null}
            onSelectRoom={(room) => {
              if (room) {
                const target = verification.items.find((i) => i.elementId === room.id);
                if (target) handleSelectQueueItem(target);
              }
            }}
            verificationItems={verification.items}
            showRejected={showRejected}
            isVerificationMode={true}
          />

          {/* Canvas Status & Helper Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 font-mono text-[10px] text-axis-text-muted">
              <span>CANVAS: ACTIVE VERIFICATION MODE</span>
              <span>·</span>
              <span>
                CURRENT SELECTION:{' '}
                <strong className="text-axis-text-primary">
                  {selectedItem ? `${selectedItem.elementId} (${selectedItem.elementType})` : 'NONE'}
                </strong>
              </span>
            </div>

            <div className="font-mono text-[10px] text-axis-text-muted flex items-center gap-2">
              <span>[C] CONFIRM</span>
              <span>·</span>
              <span>[E] EDIT</span>
              <span>·</span>
              <span>[R] REJECT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Review Panels */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mobile / Tablet View Switcher */}
          <div className="flex lg:hidden items-center p-1 bg-axis-surface rounded-axis-sm border border-axis-border text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveRightTab('inspector')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeRightTab === 'inspector' ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs' : 'text-axis-text-secondary'
              }`}
            >
              Inspector
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('queue')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeRightTab === 'queue' ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs' : 'text-axis-text-secondary'
              }`}
            >
              Queue ({progress.remainingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('summary')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeRightTab === 'summary' ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs' : 'text-axis-text-secondary'
              }`}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('history')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeRightTab === 'history' ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs' : 'text-axis-text-secondary'
              }`}
            >
              History
            </button>
          </div>

          {/* 1. Element Detail Inspector (Sections 16, 17, 18) */}
          <div className={activeRightTab === 'inspector' ? 'block' : 'hidden lg:block'}>
            <VerificationInspector
              item={selectedItem}
              isEditing={isEditing}
              onStartEdit={() => setIsEditing(true)}
              onCancelEdit={() => setIsEditing(false)}
              onApplyEdit={handleApplyEdit}
              onConfirm={handleConfirm}
              onPromptReject={(item) => setRejectDialogItem(item)}
            />
          </div>

          {/* 2. Review Queue (Sections 7, 8, 53) */}
          <div className={activeRightTab === 'queue' ? 'block' : 'hidden lg:block'}>
            <ReviewQueue
              items={verification.items}
              selectedElementId={selectedItem?.elementId || null}
              onSelectItem={handleSelectQueueItem}
              onVerifyAll={handleVerifyAllAtOnce}
            />
          </div>

          {/* 3. Verification Summary & Progress (Sections 36–40) */}
          <div className={activeRightTab === 'summary' ? 'block' : 'hidden lg:block'}>
            <VerificationSummary
              progress={progress}
              onContinueToReconstruction={handleProceedToReconstruction}
              onVerifyAll={handleVerifyAllAtOnce}
            />
          </div>

          {/* 4. Audit Trail History (Section 42) */}
          <div className={activeRightTab === 'history' ? 'block' : 'hidden lg:block'}>
            <VerificationHistory
              history={verification.history}
              onSelectElement={(elemId) => {
                const item = verification.items.find((i) => i.elementId === elemId);
                if (item) handleSelectQueueItem(item);
              }}
            />
          </div>
        </div>
      </div>

      {/* Reject Detection Confirmation Dialog (Section 28) */}
      <RejectDetectionDialog
        isOpen={!!rejectDialogItem}
        item={rejectDialogItem}
        onConfirmReject={handleConfirmReject}
        onCancel={() => setRejectDialogItem(null)}
      />
    </div>
  );
}
