import * as React from 'react';
import { ArchitecturalCoordinateDatum } from '@/components/shared/architectural-grid';

export function Footer() {
  return (
    <footer className="w-full border-t border-axis-border bg-axis-surface/40 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-axis-text-muted">
          <span className="font-medium text-axis-text-primary">AXIS ARCHITECTURE</span>
          <span className="hidden sm:inline text-axis-border-strong">·</span>
          <span>Spatial Intelligence & Blueprint Reconstruction Platform</span>
          <span className="hidden sm:inline text-axis-border-strong">·</span>
          <span className="font-mono text-[11px]">FOUNDATION SPEC V1.0</span>
        </div>
        <ArchitecturalCoordinateDatum datum="AXIS-BASE-DATUM" scale="1:100" />
      </div>
    </footer>
  );
}
