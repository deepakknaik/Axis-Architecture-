'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuildingModel } from '@/lib/reconstruction/types';
import { drawerSlideRightVariants } from '@/lib/constants/motion';

export interface BlueprintComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  blueprintUrl: string;
  blueprintName: string;
  model: BuildingModel;
  selectedElementId: string | null;
  projectId: string;
}

export function BlueprintComparisonDrawer({
  isOpen,
  onClose,
  blueprintUrl,
  blueprintName,
  model,
  selectedElementId,
  projectId,
}: BlueprintComparisonDrawerProps) {
  const [zoom, setZoom] = React.useState(1.0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={drawerSlideRightVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-0 right-0 w-[480px] h-full bg-white/95 backdrop-blur-md border-l border-axis-border shadow-2xl z-20 flex flex-col"
        >
          {/* Header */}
      <div className="flex-none p-3 border-b border-axis-border flex items-center justify-between bg-stone-50/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-axis-terracotta" />
          <div>
            <h3 className="text-xs font-bold text-stone-900 tracking-tight">
              2D Blueprint ↔ 3D Model Comparison
            </h3>
            <p className="text-[10px] text-stone-500 font-mono truncate max-w-[280px]">
              {blueprintName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1.0)}
            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/60"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 ml-1"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blueprint Raster Viewer */}
      <div className="flex-1 overflow-auto p-4 bg-[#F5F2EB] flex items-center justify-center relative">
        <div
          className="transition-transform duration-150 origin-center border border-stone-300 shadow-md bg-white rounded overflow-hidden"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blueprintUrl}
            alt={blueprintName}
            className="max-w-[420px] h-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Bottom Information / Traceability Bar */}
      <div className="flex-none p-3 border-t border-axis-border bg-stone-50 text-[11px] space-y-2">
        <div className="flex items-center justify-between font-mono">
          <span className="text-stone-500">Selected Primitive:</span>
          <span className="font-bold text-stone-900">
            {selectedElementId || 'None (Click element in 3D to inspect)'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-stone-500">
          <span>Authoritative Scale:</span>
          <span className="font-mono font-medium text-stone-800">
            {model.metadata.pixelsPerMeter.toFixed(1)} px/m (1:1 Metric)
          </span>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
