'use client';

import * as React from 'react';
import { FileText, Eye, Maximize2, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BlueprintPreviewProps {
  file: File;
  previewUrl?: string;
  onDimensionsLoaded?: (width: number, height: number) => void;
  className?: string;
}

export function BlueprintPreview({
  file,
  previewUrl,
  onDimensionsLoaded,
  className,
}: BlueprintPreviewProps) {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const [naturalDimensions, setNaturalDimensions] = React.useState<{ width: number; height: number } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNaturalDimensions({ width: w, height: h });
    if (onDimensionsLoaded) {
      onDimensionsLoaded(w, h);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[380px] sm:min-h-[440px] rounded-axis-md border border-axis-border bg-axis-bg-elevated p-4 flex flex-col justify-between select-none shadow-axis-xs overflow-hidden',
        className
      )}
    >
      {/* Top Preview Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-axis-border/80 text-[10px] font-mono text-axis-text-muted">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
          <span className="font-semibold text-axis-text-primary uppercase">
            {isPdf ? 'PDF DOCUMENT PREVIEW' : 'PLAN PREVIEW · ORIGINAL SCALE'}
          </span>
        </div>

        {naturalDimensions && (
          <span className="text-axis-text-secondary bg-axis-surface px-1.5 py-0.5 rounded border border-axis-border">
            {naturalDimensions.width} × {naturalDimensions.height} px
          </span>
        )}
      </div>

      {/* Main Preview Container */}
      <div className="relative flex-1 flex items-center justify-center p-4 my-2 overflow-hidden bg-axis-surface/30 rounded-axis-xs border border-axis-border/60">
        {/* Subtle CAD grid overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #DDD8CE 1px, transparent 1px),
              linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {isPdf ? (
          /* Clean Technical PDF Document Display */
          <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-sm space-y-4">
            <div className="w-16 h-20 rounded-axis-xs bg-axis-bg-elevated border-2 border-axis-border flex flex-col items-center justify-center shadow-axis-sm relative">
              <span className="absolute top-1 left-1 text-[8px] font-mono text-axis-accent font-bold px-1 rounded bg-axis-accent/10">
                PDF
              </span>
              <FileText className="w-8 h-8 text-axis-text-muted mt-2" />
              <div className="w-10 h-1 bg-axis-border rounded-full mt-2" />
              <div className="w-8 h-1 bg-axis-border/60 rounded-full mt-1" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-axis-text-primary break-all">
                {file.name}
              </p>
              <p className="text-[11px] font-mono text-axis-text-muted">
                ARCHITECTURAL VECTOR DOCUMENT
              </p>
            </div>

            <div className="px-3 py-1 rounded bg-axis-surface border border-axis-border text-[10px] font-mono text-axis-text-secondary">
              First-stage rasterization & scale calibration scheduled
            </div>
          </div>
        ) : previewUrl ? (
          /* Actual High-Res Raster Floor Plan Preview */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={file.name}
            onLoad={handleImageLoad}
            className="max-h-[340px] sm:max-h-[400px] w-auto h-auto max-w-full object-contain rounded shadow-axis-xs"
          />
        ) : (
          <div className="flex flex-col items-center text-axis-text-muted text-xs">
            <Compass className="w-6 h-6 mb-2 animate-spin text-axis-accent" />
            <span>Loading blueprint preview...</span>
          </div>
        )}
      </div>

      {/* Bottom Architectural Calibration & Preservation Notice */}
      <div className="pt-2 border-t border-axis-border/60 flex items-center justify-between text-[10px] font-mono text-axis-text-muted">
        <span>ASPECT: CONSTRAINED</span>
        <span>PREVIEW ENGINE: CLIENT-SAFE</span>
        <span>ORIENTATION: 0°</span>
      </div>
    </div>
  );
}
