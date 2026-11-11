'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Box, Layers, Eye, ScanLine, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArchitecturalBlueprintVisual() {
  // Mode can toggle between '2D_PLAN' and '3D_EXTRUSION' or auto-cycle
  const [viewMode, setViewMode] = React.useState<'2D_PLAN' | '3D_EXTRUSION'>('2D_PLAN');
  const [isScanning, setIsScanning] = React.useState(true);

  // Auto-cycle gently every 8 seconds if user hasn't toggled recently
  React.useEffect(() => {
    const timer = setInterval(() => {
      setViewMode((prev) => (prev === '2D_PLAN' ? '3D_EXTRUSION' : '2D_PLAN'));
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 select-none overflow-hidden bg-axis-bg-subtle border-r border-axis-border">
      {/* Background Architectural Drafting Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: `
            linear-gradient(to right, #DDD8CE 1px, transparent 1px),
            linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Subtle Coordinate Crosshairs */}
      <div className="absolute top-8 left-8 w-3 h-3 border-t border-l border-axis-border-strong opacity-60" />
      <div className="absolute top-8 right-8 w-3 h-3 border-t border-r border-axis-border-strong opacity-60" />
      <div className="absolute bottom-8 left-8 w-3 h-3 border-b border-l border-axis-border-strong opacity-60" />
      <div className="absolute bottom-8 right-8 w-3 h-3 border-b border-r border-axis-border-strong opacity-60" />

      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP METADATA & BRANDING */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs shadow-axis-xs">
            AX
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-axis-text-primary uppercase leading-none">
              AXIS ARCHITECTURE
            </div>
            <div className="text-[10px] font-mono tracking-widest text-axis-text-muted uppercase mt-0.5">
              SPATIAL INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>

        {/* Technical Mode Switcher / Indicator */}
        <div className="flex items-center gap-1.5 p-1 rounded-axis-xs bg-axis-surface/70 border border-axis-border shadow-axis-xs">
          <button
            type="button"
            onClick={() => setViewMode('2D_PLAN')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-mono rounded-axis-xs transition-colors flex items-center gap-1.5',
              viewMode === '2D_PLAN'
                ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs'
                : 'text-axis-text-secondary hover:text-axis-text-primary'
            )}
          >
            <Layers className="w-3 h-3" />
            <span>2D PLAN</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3D_EXTRUSION')}
            className={cn(
              'px-2.5 py-1 text-[11px] font-mono rounded-axis-xs transition-colors flex items-center gap-1.5',
              viewMode === '3D_EXTRUSION'
                ? 'bg-axis-bg-elevated text-axis-accent font-semibold shadow-axis-xs'
                : 'text-axis-text-secondary hover:text-axis-text-primary'
            )}
          >
            <Box className="w-3 h-3" />
            <span>3D SPATIAL</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. CENTER: DYNAMIC ARCHITECTURAL VISUAL (2D Blueprint / 3D Extrusion) */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4 min-h-[300px]">
        {/* Animated Scanner Beam */}
        {isScanning && (
          <motion.div
            className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-axis-accent/60 to-transparent pointer-events-none z-20"
            initial={{ top: '15%' }}
            animate={{ top: ['15%', '85%', '15%'] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute right-6 -top-4 font-mono text-[9px] text-axis-accent bg-axis-bg-elevated/90 px-1.5 py-0.5 rounded border border-axis-accent/30 shadow-axis-xs flex items-center gap-1">
              <ScanLine className="w-2.5 h-2.5 animate-pulse" />
              <span>SCAN LINE: Y+2.840m</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === '2D_PLAN' ? (
            /* -------------------------------------------------------------- */
            /* 2A: 2D TECHNICAL BLUEPRINT                                    */
            /* -------------------------------------------------------------- */
            <motion.div
              key="2d-blueprint"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 540 400"
                className="w-full h-full text-axis-text-primary drop-shadow-sm select-none"
                fill="none"
              >
                {/* Technical Boundary Border */}
                <rect
                  x="20"
                  y="20"
                  width="500"
                  height="360"
                  stroke="#DDD8CE"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Sub-grid dimension lines */}
                <line x1="20" y1="120" x2="520" y2="120" stroke="#EBE5DC" strokeWidth="0.8" />
                <line x1="20" y1="260" x2="520" y2="260" stroke="#EBE5DC" strokeWidth="0.8" />
                <line x1="180" y1="20" x2="180" y2="380" stroke="#EBE5DC" strokeWidth="0.8" />
                <line x1="360" y1="20" x2="360" y2="380" stroke="#EBE5DC" strokeWidth="0.8" />

                {/* Outer Wall Structure (Extruded fill) */}
                <motion.rect
                  x="70"
                  y="60"
                  width="400"
                  height="280"
                  fill="#F0ECE4"
                  stroke="#252525"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {/* Inner Room 01: PRIMARY STUDIO */}
                <rect
                  x="80"
                  y="70"
                  width="210"
                  height="170"
                  fill="#FAF7F2"
                  stroke="#6F6B63"
                  strokeWidth="1.5"
                />
                <text
                  x="96"
                  y="96"
                  className="font-mono text-[10px] font-semibold fill-axis-text-primary tracking-wider"
                >
                  RM 01 · PRIMARY STUDIO
                </text>
                <text
                  x="96"
                  y="112"
                  className="font-mono text-[9px] fill-axis-text-muted"
                >
                  AREA: 35.7 m² · LEVEL 01
                </text>

                {/* Door Opening & Swing Arc (Studio) */}
                <path
                  d="M 290 120 L 290 160"
                  stroke="#FAF7F2"
                  strokeWidth="4"
                />
                <path
                  d="M 290 120 A 40 40 0 0 1 250 160"
                  stroke="#B85D36"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                <line x1="290" y1="120" x2="250" y2="120" stroke="#252525" strokeWidth="1.5" />

                {/* Window Marks (Studio north wall) */}
                <line x1="120" y1="60" x2="210" y2="60" stroke="#FAF7F2" strokeWidth="5" />
                <line x1="120" y1="58" x2="210" y2="58" stroke="#3978B5" strokeWidth="1.5" />
                <line x1="120" y1="62" x2="210" y2="62" stroke="#3978B5" strokeWidth="1.5" />
                <text x="142" y="52" className="font-mono text-[8px] fill-axis-text-muted">
                  W-01 (1.80m)
                </text>

                {/* Inner Room 02: ATRIUM & MEETING */}
                <rect
                  x="300"
                  y="70"
                  width="160"
                  height="170"
                  fill="#FCFAF7"
                  stroke="#6F6B63"
                  strokeWidth="1.5"
                />
                <text
                  x="315"
                  y="96"
                  className="font-mono text-[10px] font-semibold fill-axis-text-primary tracking-wider"
                >
                  RM 02 · ATRIUM
                </text>
                <text
                  x="315"
                  y="112"
                  className="font-mono text-[9px] fill-axis-text-muted"
                >
                  AREA: 27.2 m²
                </text>

                {/* Window Marks (Atrium east wall) */}
                <line x1="470" y1="100" x2="470" y2="180" stroke="#FAF7F2" strokeWidth="5" />
                <line x1="468" y1="100" x2="468" y2="180" stroke="#3978B5" strokeWidth="1.5" />
                <line x1="472" y1="100" x2="472" y2="180" stroke="#3978B5" strokeWidth="1.5" />

                {/* Inner Room 03: SPEC ARCHIVE / LOGGIA */}
                <rect
                  x="80"
                  y="250"
                  width="380"
                  height="80"
                  fill="#F9F6F0"
                  stroke="#6F6B63"
                  strokeWidth="1.5"
                />
                <text
                  x="96"
                  y="276"
                  className="font-mono text-[10px] font-semibold fill-axis-text-primary tracking-wider"
                >
                  RM 03 · GALLERY LOGGIA & BALCONY
                </text>
                <text
                  x="96"
                  y="292"
                  className="font-mono text-[9px] fill-axis-text-muted"
                >
                  AREA: 30.4 m² · RECEPTIVE DATUM
                </text>

                {/* Structural Columns */}
                <rect x="76" y="66" width="10" height="10" fill="#252525" />
                <rect x="286" y="66" width="10" height="10" fill="#252525" />
                <rect x="454" y="66" width="10" height="10" fill="#252525" />
                <rect x="76" y="324" width="10" height="10" fill="#252525" />
                <rect x="286" y="324" width="10" height="10" fill="#252525" />
                <rect x="454" y="324" width="10" height="10" fill="#252525" />

                {/* Dimension Chains (Exterior Top) */}
                <g stroke="#8E8980" strokeWidth="1">
                  <line x1="70" y1="36" x2="470" y2="36" />
                  <line x1="70" y1="30" x2="70" y2="42" />
                  <line x1="470" y1="30" x2="470" y2="42" />
                  <line x1="66" y1="40" x2="74" y2="32" stroke="#B85D36" strokeWidth="1.5" />
                  <line x1="466" y1="40" x2="474" y2="32" stroke="#B85D36" strokeWidth="1.5" />
                </g>
                <text
                  x="250"
                  y="30"
                  textAnchor="middle"
                  className="font-mono text-[10px] font-semibold fill-axis-accent"
                >
                  14.20 m
                </text>

                {/* Dimension Chains (Exterior Left) */}
                <g stroke="#8E8980" strokeWidth="1">
                  <line x1="42" y1="60" x2="42" y2="340" />
                  <line x1="36" y1="60" x2="48" y2="60" />
                  <line x1="36" y1="340" x2="48" y2="340" />
                  <line x1="38" y1="64" x2="46" y2="56" stroke="#B85D36" strokeWidth="1.5" />
                  <line x1="38" y1="344" x2="46" y2="336" stroke="#B85D36" strokeWidth="1.5" />
                </g>
                <text
                  x="28"
                  y="205"
                  transform="rotate(-90, 28, 205)"
                  textAnchor="middle"
                  className="font-mono text-[10px] font-semibold fill-axis-accent"
                >
                  9.80 m
                </text>

                {/* Detection Tag indicator */}
                <g transform="translate(320, 180)">
                  <rect
                    width="120"
                    height="24"
                    rx="3"
                    fill="#252525"
                    stroke="#DDD8CE"
                    strokeWidth="0.8"
                  />
                  <circle cx="12" cy="12" r="3" fill="#358A73" />
                  <text
                    x="22"
                    y="15"
                    className="font-mono text-[8.5px] fill-[#FCFAF7] font-medium"
                  >
                    EXTRACTED: CONF 0.98
                  </text>
                </g>
              </svg>
            </motion.div>
          ) : (
            /* -------------------------------------------------------------- */
            /* 2B: 3D SPATIAL GEOMETRY EXTRUSION (AXONOMETRIC PERSPECTIVE)    */
            /* -------------------------------------------------------------- */
            <motion.div
              key="3d-spatial"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 540 400"
                className="w-full h-full text-axis-text-primary drop-shadow-md select-none"
                fill="none"
              >
                {/* Datum Floor Grid (Projected Isometric Base) */}
                <g stroke="#DDD8CE" strokeWidth="0.8" opacity="0.8">
                  <line x1="70" y1="260" x2="270" y2="350" />
                  <line x1="120" y1="235" x2="320" y2="325" />
                  <line x1="170" y1="210" x2="370" y2="300" />
                  <line x1="220" y1="185" x2="420" y2="275" />
                  <line x1="270" y1="160" x2="470" y2="250" />

                  <line x1="70" y1="260" x2="270" y2="160" />
                  <line x1="120" y1="282" x2="320" y2="182" />
                  <line x1="170" y1="305" x2="370" y2="205" />
                  <line x1="220" y1="327" x2="420" y2="227" />
                  <line x1="270" y1="350" x2="470" y2="250" />
                </g>

                {/* Base Footprint Outline */}
                <polygon
                  points="140,290 310,360 440,295 270,225"
                  fill="rgba(238, 234, 226, 0.45)"
                  stroke="#DDD8CE"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Extruded Volume - South-West Facade */}
                <polygon
                  points="140,290 310,360 310,230 140,160"
                  fill="rgba(240, 236, 228, 0.85)"
                  stroke="#252525"
                  strokeWidth="2"
                />

                {/* Window Voids on South-West Facade */}
                <polygon
                  points="170,260 220,282 220,205 170,183"
                  fill="#FAF7F2"
                  stroke="#B85D36"
                  strokeWidth="1.5"
                />
                <polygon
                  points="245,293 295,315 295,238 245,216"
                  fill="#FAF7F2"
                  stroke="#B85D36"
                  strokeWidth="1.5"
                />

                {/* Extruded Volume - South-East Facade */}
                <polygon
                  points="310,360 440,295 440,165 310,230"
                  fill="rgba(232, 227, 218, 0.9)"
                  stroke="#252525"
                  strokeWidth="2"
                />

                {/* Door Opening Void on South-East Facade */}
                <polygon
                  points="345,335 390,312 390,230 345,252"
                  fill="#252525"
                  stroke="#8F6E4A"
                  strokeWidth="1.5"
                />

                {/* Roof Slab Plane (Top Isometric Elevation) */}
                <polygon
                  points="140,160 310,230 440,165 270,95"
                  fill="rgba(252, 250, 247, 0.92)"
                  stroke="#252525"
                  strokeWidth="2.5"
                />

                {/* Roof Skylight / Internal Void */}
                <polygon
                  points="190,160 270,195 330,165 250,130"
                  fill="rgba(184, 93, 54, 0.12)"
                  stroke="#B85D36"
                  strokeWidth="1.2"
                />

                {/* Architectural Height Datum Dimension Line */}
                <g stroke="#B85D36" strokeWidth="1.2">
                  <line x1="120" y1="290" x2="120" y2="160" />
                  <line x1="112" y1="290" x2="128" y2="290" />
                  <line x1="112" y1="160" x2="128" y2="160" />
                  <line x1="116" y1="294" x2="124" y2="286" strokeWidth="1.5" />
                  <line x1="116" y1="164" x2="124" y2="156" strokeWidth="1.5" />
                </g>
                <text
                  x="100"
                  y="230"
                  textAnchor="middle"
                  className="font-mono text-[10px] font-semibold fill-axis-accent"
                >
                  H: 3.20m
                </text>

                {/* Technical Coordinates Callout */}
                <g transform="translate(350, 80)">
                  <rect
                    width="140"
                    height="28"
                    rx="3"
                    fill="#252525"
                    stroke="#DDD8CE"
                    strokeWidth="0.8"
                  />
                  <circle cx="12" cy="14" r="3" fill="#B85D36" />
                  <text
                    x="22"
                    y="13"
                    className="font-mono text-[8.5px] fill-[#FCFAF7] font-semibold"
                  >
                    PARAMETRIC 3D SOLID
                  </text>
                  <text
                    x="22"
                    y="22"
                    className="font-mono text-[7.5px] fill-axis-text-muted"
                  >
                    EXTRUSION +3.200m RECON
                  </text>
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. BOTTOM: EDITORIAL BRANDING & TECHNICAL METADATA                   */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-10 space-y-3 pt-4 border-t border-axis-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-axis-accent font-semibold">
              AXIS ARCHITECTURE
            </span>
            <span className="text-axis-border-strong">·</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-axis-text-muted">
              {viewMode === '2D_PLAN' ? '2D BLUEPRINT ANALYSIS' : '3D SPATIAL RECONSTRUCTION'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-axis-text-primary">
            From Blueprint to Space.
          </h2>
          <p className="text-xs text-axis-text-secondary max-w-md leading-relaxed">
            Transform architectural plans into intelligent, dimensional environments with automated
            feature extraction and human-verified spatial reconstruction.
          </p>
        </div>

        {/* Technical Footer Ticks */}
        <div className="flex items-center justify-between text-[10px] font-mono text-axis-text-muted/80 pt-2 border-t border-axis-border/40">
          <span>SCALE: 1:100 METRIC</span>
          <span>DATUM: ELEV +0.000m</span>
          <span>ENGINE: AXIS-CORE-V1</span>
        </div>
      </div>
    </div>
  );
}
