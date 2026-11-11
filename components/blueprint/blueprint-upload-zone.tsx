'use client';

import * as React from 'react';
import { FileUp, AlertCircle, Compass, FileText } from 'lucide-react';
import { validateBlueprintFile } from '@/lib/blueprint/file-validation';
import { cn } from '@/lib/utils';

export interface BlueprintUploadZoneProps {
  onFileSelect: (file: File) => void;
  errorMessage?: string | null;
  onErrorDismiss?: () => void;
  className?: string;
}

export function BlueprintUploadZone({
  onFileSelect,
  errorMessage,
  onErrorDismiss,
  className,
}: BlueprintUploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('w-full space-y-4 select-none', className)}>
      {/* Error Feedback Banner */}
      {errorMessage && (
        <div
          className="p-4 rounded-axis-md bg-status-failed-bg border border-status-failed-border text-status-failed-text text-xs flex items-start justify-between gap-3 shadow-axis-xs animate-in fade-in duration-150"
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs mb-0.5">Validation Rejected</p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          {onErrorDismiss && (
            <button
              type="button"
              onClick={onErrorDismiss}
              className="text-xs font-mono underline hover:no-underline shrink-0"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Main Architectural Drop Zone */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Drop architectural blueprint here, or press Enter to choose file"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative w-full min-h-[340px] sm:min-h-[380px] rounded-axis-lg border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-8 sm:p-12 text-center outline-none focus-visible:ring-2 focus-visible:ring-axis-accent',
          isDragOver
            ? 'border-axis-accent bg-axis-accent/5 shadow-axis-md scale-[1.005]'
            : 'border-axis-border bg-axis-surface/25 hover:border-axis-border-strong hover:bg-axis-surface/40 shadow-axis-xs'
        )}
      >
        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Architectural Drafting Corner Registration Ticks */}
        <div className={cn("absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 transition-all duration-200", isDragOver ? "border-axis-accent opacity-100" : "border-axis-border-strong opacity-60")} />
        <div className={cn("absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 transition-all duration-200", isDragOver ? "border-axis-accent opacity-100" : "border-axis-border-strong opacity-60")} />
        <div className={cn("absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 transition-all duration-200", isDragOver ? "border-axis-accent opacity-100" : "border-axis-border-strong opacity-60")} />
        <div className={cn("absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 transition-all duration-200", isDragOver ? "border-axis-accent opacity-100" : "border-axis-border-strong opacity-60")} />

        {/* Subtle Background CAD Grid */}
        <div
          className="absolute inset-4 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, #DDD8CE 1px, transparent 1px),
              linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Central Content */}
        <div className="relative z-10 flex flex-col items-center max-w-md space-y-4">
          <div
            className={cn(
              'w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-200 shadow-axis-xs',
              isDragOver
                ? 'bg-axis-accent text-white border-axis-accent'
                : 'bg-axis-bg-elevated text-axis-accent border-axis-border'
            )}
          >
            <FileUp className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-medium tracking-tight text-axis-text-primary">
              {isDragOver ? 'Drop blueprint to import' : 'Drop architectural blueprint here'}
            </h3>
            <p className="text-xs text-axis-text-secondary leading-relaxed">
              or <span className="text-axis-accent font-semibold underline underline-offset-2">choose a file</span> from your workstation
            </p>
          </div>

          {/* Technical Format Badge & Limit Specifications */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-axis-border bg-axis-bg-elevated/80 font-mono text-[10px] text-axis-text-muted">
              <span>PDF · PNG · JPG · JPEG</span>
              <span className="text-axis-border-strong">·</span>
              <span className="text-axis-text-primary font-medium">MAX 50 MB</span>
            </div>

            <p className="text-[11px] text-axis-text-muted/70 font-mono">
              IMMUTABLE SOURCE INGESTION ENGINE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
