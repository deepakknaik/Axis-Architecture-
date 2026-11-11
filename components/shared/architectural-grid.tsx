import React from 'react';
import { cn } from '@/lib/utils';

export interface ArchitecturalGridProps {
  className?: string;
  gridSize?: number;
  subtle?: boolean;
  withCrosshairs?: boolean;
  children?: React.ReactNode;
}

/**
 * ArchitecturalGrid provides a subtle CAD/drafting paper background texture.
 * Features ultra-soft tone intersections (#E5DFC) without distracting from foreground content.
 */
export function ArchitecturalGrid({
  className,
  gridSize = 32,
  subtle = true,
  withCrosshairs = false,
  children,
}: ArchitecturalGridProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          subtle ? 'opacity-40' : 'opacity-70'
        )}
        style={{
          backgroundImage: `
            linear-gradient(to right, #DDD8CE 1px, transparent 1px),
            linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      {withCrosshairs && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, #B85D36 1px, transparent 0)
            `,
            backgroundSize: `${gridSize * 4}px ${gridSize * 4}px`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Technical Datum Stamp / Coordinate Watermark for CAD aesthetics
 */
export function ArchitecturalCoordinateDatum({
  x = '00.000',
  y = '00.000',
  datum = 'REF-DATUM-01',
  scale = '1:100',
  className,
}: {
  x?: string;
  y?: string;
  datum?: string;
  scale?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 font-mono text-[10px] tracking-wider text-axis-text-muted/70 uppercase select-none',
        className
      )}
    >
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-axis-accent/50" />
        {datum}
      </span>
      <span>X: {x}</span>
      <span>Y: {y}</span>
      <span className="px-1.5 py-0.5 rounded border border-axis-border/80 bg-axis-surface/60">
        SCALE {scale}
      </span>
    </div>
  );
}
