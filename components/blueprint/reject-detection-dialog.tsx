'use client';

import * as React from 'react';
import { AlertTriangle, X, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerificationItem } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface RejectDetectionDialogProps {
  isOpen: boolean;
  item: VerificationItem | null;
  onConfirmReject: (elementId: string, reason: string) => void;
  onCancel: () => void;
}

export function RejectDetectionDialog({
  isOpen,
  item,
  onConfirmReject,
  onCancel,
}: RejectDetectionDialogProps) {
  const [reason, setReason] = React.useState<string>('Artifact or non-structural annotation line');

  React.useEffect(() => {
    if (isOpen) {
      setReason('Artifact or non-structural annotation line');
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-dialog-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-axis-text-primary/40 backdrop-blur-xs select-none animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-axis-bg-elevated border border-axis-border rounded-axis-md shadow-axis-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-axis-border bg-axis-surface-subtle">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 id="reject-dialog-title" className="text-sm font-semibold tracking-tight text-axis-text-primary">
              Reject Architectural Detection
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="p-1 rounded text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <p className="text-axis-text-primary font-medium">
              Reject detection <strong className="font-mono text-axis-accent">{item.elementId}</strong> ({item.elementType})?
            </p>
            <p className="text-axis-text-secondary leading-relaxed">
              This element will not be included in the downstream validated building model. The original detection data remains safely archived in the audit record.
            </p>
          </div>

          <div className="p-3 rounded bg-axis-surface/60 border border-axis-border/80 space-y-1.5">
            <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider block">
              REASON FOR REJECTION
            </span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-axis-bg-elevated border border-axis-border rounded px-2.5 py-1.5 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent"
            >
              <option value="Artifact or non-structural annotation line">Artifact or non-structural annotation line</option>
              <option value="Dimension leader misclassified as partition wall">Dimension leader misclassified as partition wall</option>
              <option value="Opening void incorrectly flagged on solid perimeter">Opening void incorrectly flagged on solid perimeter</option>
              <option value="Furniture or casework contour misclassified">Furniture or casework contour misclassified</option>
              <option value="Duplicate or overlapping detection segment">Duplicate or overlapping detection segment</option>
              <option value="Custom reviewer dismissal">Other / Custom rejection</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-axis-border bg-axis-surface-subtle">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onConfirmReject(item.elementId, reason)}
            leftIcon={<Ban className="w-3.5 h-3.5" />}
          >
            Reject Detection
          </Button>
        </div>
      </div>
    </div>
  );
}
