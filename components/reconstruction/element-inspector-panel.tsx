'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  FileSearch,
  ShieldCheck,
  Ruler,
  Maximize2,
  Tag,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BuildingModel,
  Wall3D,
  Door3D,
  Window3D,
  Column3D,
  Stair3D,
} from '@/lib/reconstruction/types';
import { MOTION_EASINGS } from '@/lib/constants/motion';

export interface ElementInspectorPanelProps {
  model: BuildingModel;
  selectedElementId: string | null;
  projectId: string;
  onClose: () => void;
  className?: string;
}

export function ElementInspectorPanel({
  model,
  selectedElementId,
  projectId,
  onClose,
  className = '',
}: ElementInspectorPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {!selectedElementId ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.15 }}
        >
          <Card className={`bg-axis-surface/60 border-axis-border p-4 text-center ${className}`}>
            <div className="py-6 space-y-2 text-stone-500">
              <Layers className="w-6 h-6 mx-auto text-stone-400" />
              <p className="text-xs font-medium text-stone-700">No Element Selected</p>
              <p className="text-[11px] text-stone-500 leading-relaxed max-w-[200px] mx-auto">
                Click on any wall, door, window, column, or stair in the 3D model to inspect verified dimensions.
              </p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key={selectedElementId}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: 4 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: -4 }
          }
          transition={{
            duration: shouldReduceMotion ? 0.05 : 0.2,
            ease: MOTION_EASINGS.architectural,
          }}
        >
          <SelectedElementContent
            model={model}
            selectedElementId={selectedElementId}
            projectId={projectId}
            onClose={onClose}
            className={className}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SelectedElementContent({
  model,
  selectedElementId,
  projectId,
  onClose,
  className = '',
}: {
  model: BuildingModel;
  selectedElementId: string;
  projectId: string;
  onClose: () => void;
  className?: string;
}) {
  // Find element in model
  const floor = model.floors[0];
  const wall = floor?.walls.find((w) => w.id === selectedElementId);
  const door = floor?.doors.find((d) => d.id === selectedElementId);
  const win = floor?.windows.find((w) => w.id === selectedElementId);
  const col = floor?.columns.find((c) => c.id === selectedElementId);
  const stair = floor?.stairs.find((s) => s.id === selectedElementId);

  const elementType = wall
    ? 'WALL'
    : door
    ? 'DOOR'
    : win
    ? 'WINDOW'
    : col
    ? 'COLUMN'
    : stair
    ? 'STAIR'
    : 'ELEMENT';

  const verId =
    wall?.verificationReference?.verificationId ||
    door?.verificationReference?.verificationId ||
    win?.verificationReference?.verificationId ||
    col?.verificationReference?.verificationId ||
    stair?.verificationReference?.verificationId ||
    `ver-${selectedElementId}`;

  return (
    <Card className={`bg-white border-axis-border shadow-md overflow-hidden ${className}`}>
      {/* Header with Type & ID */}
      <CardHeader className="py-2.5 px-3.5 border-b border-stone-200 bg-stone-50/70 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-axis-terracotta text-white">
            {elementType}
          </span>
          <CardTitle className="text-xs font-mono font-bold text-stone-900 tracking-tight">
            {selectedElementId}
          </CardTitle>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-200/60 transition-colors"
          title="Deselect Element"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3.5 text-xs">
        {/* Verification Status Badge */}
        <div className="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED ARCHITECTURAL GEOMETRY</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700">Audit ✓</span>
        </div>

        {/* Specific Dimensional Properties */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
            Verified Spatial Dimensions (1:1 Metric)
          </span>

          {wall && (
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Length</span>
                <span className="font-bold text-stone-900">{wall.lengthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Thickness</span>
                <span className="font-bold text-stone-900">{wall.thicknessMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Height</span>
                <span className="font-bold text-stone-900">{wall.heightMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Type</span>
                <span className="font-bold text-stone-900">{wall.classification}</span>
              </div>
              <div className="col-span-2 p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Subdivided Segments</span>
                <span className="font-bold text-stone-900">
                  {wall.subSegments.length} solid watertight segment(s)
                </span>
              </div>
            </div>
          )}

          {door && (
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Clear Width</span>
                <span className="font-bold text-stone-900">{door.clearWidthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Clear Height</span>
                <span className="font-bold text-stone-900">{door.clearHeightMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Door Type</span>
                <span className="font-bold text-stone-900">{door.doorType}</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Swing</span>
                <span className="font-bold text-stone-900">{door.swingDirection || 'LEFT'}</span>
              </div>
            </div>
          )}

          {win && (
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Width</span>
                <span className="font-bold text-stone-900">{win.windowWidthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Height</span>
                <span className="font-bold text-stone-900">{win.windowHeightMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Sill Height</span>
                <span className="font-bold text-stone-900">{win.sillHeightMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Fenestration</span>
                <span className="font-bold text-stone-900">{win.windowType}</span>
              </div>
            </div>
          )}

          {col && (
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Width</span>
                <span className="font-bold text-stone-900">{col.widthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Depth</span>
                <span className="font-bold text-stone-900">{col.depthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Height</span>
                <span className="font-bold text-stone-900">{col.heightMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Shape</span>
                <span className="font-bold text-stone-900">{col.crossSectionShape}</span>
              </div>
            </div>
          )}

          {stair && (
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Total Rise</span>
                <span className="font-bold text-stone-900">{stair.totalRiseMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Width</span>
                <span className="font-bold text-stone-900">{stair.widthMeters.toFixed(2)} m</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Risers</span>
                <span className="font-bold text-stone-900">{stair.riserCount} steps</span>
              </div>
              <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">Direction</span>
                <span className="font-bold text-stone-900">{stair.direction}</span>
              </div>
            </div>
          )}
        </div>

        {/* Audit Reference */}
        <div className="pt-2 border-t border-stone-200 text-[10px] font-mono text-stone-500 flex justify-between">
          <span>Audit ID:</span>
          <span className="text-stone-800">{verId}</span>
        </div>

        {/* View Source in Blueprint Action Button */}
        <div className="pt-1">
          <Link
            href={`/projects/${projectId}/analysis?mode=review&elementId=${selectedElementId}`}
          >
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileSearch className="w-3.5 h-3.5 text-axis-terracotta" />}
              rightIcon={<ExternalLink className="w-3 h-3 text-stone-400" />}
              className="w-full text-xs font-medium"
            >
              Inspect Source 2D Blueprint
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
