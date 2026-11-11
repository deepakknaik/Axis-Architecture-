'use client';

import React from 'react';
import { Box } from 'lucide-react';

export function ViewerCanvasStub() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-axis-surface/30 border border-axis-border rounded-axis-md p-6 text-center">
      <div className="space-y-2">
        <Box className="w-8 h-8 text-axis-accent mx-auto" />
        <p className="text-xs font-medium text-axis-text-primary">
          Three.js Spatial Engine Ready
        </p>
        <p className="text-[11px] text-axis-text-muted">
          WebGL Viewport pipeline initialized (React Three Fiber / Drei)
        </p>
      </div>
    </div>
  );
}
