'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, X, ChevronRight, Layers, Sliders } from 'lucide-react';
import {
  FloorMaterialKey,
  WallMaterialKey,
  RoofMaterialKey,
  MaterialPresetKey,
  MaterialCustomizationState,
  FLOOR_MATERIALS,
  WALL_MATERIALS,
  ROOF_MATERIALS,
  MATERIAL_PRESETS,
} from '@/lib/reconstruction/material-types';

export interface MaterialSwatchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  materialState: MaterialCustomizationState;
  onMaterialChange: (newState: MaterialCustomizationState) => void;
}

type MaterialCategoryTab = 'FLOORS' | 'WALLS' | 'ROOF';

export function MaterialSwatchPanel({
  isOpen,
  onClose,
  materialState,
  onMaterialChange,
}: MaterialSwatchPanelProps) {
  const [activeTab, setActiveTab] = React.useState<MaterialCategoryTab>('FLOORS');

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: MaterialPresetKey) => {
    const preset = MATERIAL_PRESETS[presetKey];
    if (preset) {
      onMaterialChange(preset.state);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-20 right-4 z-20 w-80 max-h-[82vh] flex flex-col bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto font-mono text-stone-200 select-none"
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-stone-800/80 bg-stone-900/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Material Customizer
            </h3>
            <p className="text-[10px] text-stone-400">Physical PBR Architectural Finishes</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-3.5 space-y-4">
        {/* 2. 1-Click Aesthetic Presets */}
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-stone-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Design Presets</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(MATERIAL_PRESETS) as MaterialPresetKey[]).map((key) => {
              const preset = MATERIAL_PRESETS[key];
              const isCurrent =
                materialState.floor === preset.state.floor &&
                materialState.wall === preset.state.wall &&
                materialState.roof === preset.state.roof;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(key)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500/80 text-white shadow-lg shadow-amber-900/20'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold truncate leading-tight">{preset.name}</div>
                  <div className="text-[8.5px] text-stone-400 mt-0.5 truncate">
                    {preset.state.floor} · {preset.state.roof}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Category Tabs (Floors, Walls, Roof) */}
        <div>
          <div className="flex items-center p-1 bg-stone-900/90 border border-stone-800 rounded-xl mb-3 text-xs">
            {(
              [
                ['FLOORS', 'Floors'],
                ['WALLS', 'Walls'],
                ['ROOF', 'Roof'],
              ] as const
            ).map(([tabKey, label]) => {
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex-1 py-1 rounded-lg text-center font-bold transition-all ${
                    isActive
                      ? 'bg-axis-terracotta text-white shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 4. Swatch Card List */}
          <div className="space-y-2">
            {/* FLOORS */}
            {activeTab === 'FLOORS' &&
              (Object.keys(FLOOR_MATERIALS) as FloorMaterialKey[]).map((fKey) => {
                const mat = FLOOR_MATERIALS[fKey];
                const isSelected = materialState.floor === fKey;

                return (
                  <button
                    key={fKey}
                    type="button"
                    onClick={() => onMaterialChange({ ...materialState, floor: fKey })}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40'
                        : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    {/* Swatch Sample */}
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${mat.previewColor} border shrink-0 flex items-center justify-center shadow-inner`}
                      style={{ borderColor: mat.previewBorder }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-stone-950 stroke-[3]" />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white truncate">{mat.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                          {mat.tag}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-400 truncate mt-0.5">{mat.description}</p>
                    </div>
                  </button>
                );
              })}

            {/* WALLS */}
            {activeTab === 'WALLS' &&
              (Object.keys(WALL_MATERIALS) as WallMaterialKey[]).map((wKey) => {
                const mat = WALL_MATERIALS[wKey];
                const isSelected = materialState.wall === wKey;

                return (
                  <button
                    key={wKey}
                    type="button"
                    onClick={() => onMaterialChange({ ...materialState, wall: wKey })}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40'
                        : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    {/* Swatch Sample */}
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${mat.previewColor} border shrink-0 flex items-center justify-center shadow-inner`}
                      style={{ borderColor: mat.previewBorder }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white truncate">{mat.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                          {mat.tag}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-400 truncate mt-0.5">{mat.description}</p>
                    </div>
                  </button>
                );
              })}

            {/* ROOF */}
            {activeTab === 'ROOF' &&
              (Object.keys(ROOF_MATERIALS) as RoofMaterialKey[]).map((rKey) => {
                const mat = ROOF_MATERIALS[rKey];
                const isSelected = materialState.roof === rKey;

                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => onMaterialChange({ ...materialState, roof: rKey })}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40'
                        : 'bg-stone-900/70 border-stone-800/80 hover:border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    {/* Swatch Sample */}
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${mat.previewColor} border shrink-0 flex items-center justify-center shadow-inner`}
                      style={{ borderColor: mat.previewBorder }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white truncate">{mat.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                          {mat.tag}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-400 truncate mt-0.5">{mat.description}</p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* 5. Active Assembly Palette Footer */}
      <div className="p-3 border-t border-stone-800/80 bg-stone-900/70 text-[10px] space-y-1">
        <div className="flex items-center justify-between text-stone-400">
          <span>Active Assembly:</span>
          <span className="text-amber-400 font-bold">PBR Realistic</span>
        </div>
        <div className="flex items-center justify-between text-stone-300">
          <span>Floor: <b className="text-white">{FLOOR_MATERIALS[materialState.floor].name}</b></span>
        </div>
        <div className="flex items-center justify-between text-stone-300">
          <span>Wall: <b className="text-white">{WALL_MATERIALS[materialState.wall].name}</b></span>
        </div>
        <div className="flex items-center justify-between text-stone-300">
          <span>Roof: <b className="text-white">{ROOF_MATERIALS[materialState.roof].name}</b></span>
        </div>
      </div>
    </motion.div>
  );
}
