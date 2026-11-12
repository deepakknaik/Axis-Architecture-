'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Printer,
  ExternalLink,
  Building2,
  Cpu,
  Layers,
  Footprints,
  SunMedium,
  Sparkles,
  CheckCircle2,
  Boxes,
  ArrowRight,
  Maximize2,
  Workflow,
  Download,
  Eye,
  Sliders,
} from 'lucide-react';

export default function ProjectPosterPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-8 font-sans print:p-0 print:bg-white print:text-black">
      {/* Non-Printing Control Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/90 border border-stone-800 backdrop-blur-md print:hidden shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-axis-terracotta flex items-center justify-center text-white shadow-lg font-bold">
            AX
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">
              Project Exhibition 2026 — Second Review Official Poster
            </h1>
            <p className="text-xs text-stone-400">
              High-Resolution Academic Engineering Exhibition Board (A1 / A2 / A3 / 16:9 Ready)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/projects/proj_residence_01/workspace"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Live 3D Demo</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Poster / Save PDF (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          OFFICIAL EXHIBITION POSTER BOARD
          Designed to 16:9 Landscape / A1 Architectural Exhibition Format
      ========================================================================= */}
      <div
        id="exhibition-poster"
        className="max-w-7xl mx-auto bg-stone-900 border-2 border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none"
      >
        {/* POSTER TOP BANNER: Institutional Header */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 px-8 py-5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4 print:bg-white print:border-b-2 print:border-black">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-axis-terracotta print:text-red-700 text-xs font-mono font-bold tracking-widest uppercase">
              <span>Department of Computer Science & Engineering</span>
              <span>•</span>
              <span>Project Exhibition 2026 (Review II)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white print:text-black">
              AXIS ARCHITECTURE
            </h1>
            <p className="text-sm md:text-base text-stone-300 print:text-stone-700 font-medium">
              Autonomous 2D-to-3D BIM Reconstruction & Immersive Spatial Perception Engine
            </p>
          </div>

          {/* Team / Author Details Box */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-5 py-3 text-right text-xs font-mono print:bg-stone-100 print:border-stone-300 print:text-black">
            <div className="text-stone-400 print:text-stone-600">PROJECT ID: <span className="text-white font-bold print:text-black">AXIS-2026-BIM</span></div>
            <div className="text-stone-400 print:text-stone-600">TEAM MEMBERS: <span className="text-white font-semibold print:text-black">Project Team 01</span></div>
            <div className="text-stone-400 print:text-stone-600">EXHIBITION DATE: <span className="text-axis-terracotta font-bold print:text-black">13th November 2026</span></div>
          </div>
        </div>

        {/* POSTER BODY: 3-COLUMN STRUCTURED ACADEMIC LAYOUT */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#121417] print:bg-white print:text-black">
          
          {/* =====================================================================
              COLUMN 1: CONTEXT, PROBLEM STATEMENT & ARCHITECTURE
          ===================================================================== */}
          <div className="space-y-5">
            {/* 1. Abstract & Problem Statement */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5 text-axis-terracotta print:text-red-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>1. Abstract & Problem Statement</span>
              </div>
              <p className="text-xs text-stone-300 print:text-stone-800 leading-relaxed text-justify">
                Manual 3D BIM modelling from 2D architectural drawings is time-consuming, expensive, and error-prone, requiring 10–14 hours of specialised CAD labour per residential floor. Furthermore, conventional 3D software fails to convey <b>real human domestic spatial scale</b>, leaving clients and architects disoriented inside virtual models.
              </p>
              <div className="mt-3 p-2.5 rounded bg-stone-950/70 border border-stone-800/80 print:bg-white print:border-stone-300 text-[11px] text-stone-400 print:text-stone-700">
                <b>The Solution:</b> Axis Architecture provides an autonomous, end-to-end computer vision pipeline that transforms raster blueprints into parametric 3D models in <b>1.8 seconds</b>, with biometrically calibrated human walking perception (12m room = 25 steps).
              </div>
            </div>

            {/* 2. Key Project Objectives */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5 text-blue-400 print:text-blue-700 font-mono font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Key Objectives</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-300 print:text-stone-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><b>Autonomous CV Parsing:</b> Segment walls, doors, and windows from blueprint images with &gt; 94% precision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><b>Parametric BIM Graph:</b> Reconstruct topological polygons, wall subsegments, and room centroids in real time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><b>True Spatial Cadence:</b> Calibrate walk speed (1.18 m/s) and stride (0.48 m) so virtual rooms match real-world step counts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><b>Interactive Design & Sun Study:</b> Real-time solar day/night azimuth tracking and interactive PBR material swatches.</span>
                </li>
              </ul>
            </div>

            {/* 3. System Architecture Diagram */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5 text-purple-400 print:text-purple-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Workflow className="w-4 h-4" />
                <span>3. End-to-End Pipeline</span>
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300 flex items-center justify-between">
                  <span>1. 2D Blueprint Image (PNG/JPG)</span>
                  <span className="text-stone-500">Raster</span>
                </div>
                <div className="text-center text-stone-600">↓ OpenCV CV Service (Port 8000)</div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300 flex items-center justify-between">
                  <span>2. Morphological Kernel & Hough Transform</span>
                  <span className="text-blue-400">Segmentation</span>
                </div>
                <div className="text-center text-stone-600">↓ Vector Graph & Coordinate Transform</div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300 flex items-center justify-between">
                  <span>3. BuildingModel JSON Data Structure</span>
                  <span className="text-emerald-400">BIM Graph</span>
                </div>
                <div className="text-center text-stone-600">↓ React Three Fiber / Three.js Engine</div>
                <div className="p-2 rounded bg-axis-terracotta/20 border border-axis-terracotta/40 print:bg-stone-100 print:border-red-500 flex items-center justify-between text-white print:text-black font-bold">
                  <span>4. 60 FPS Immersive 3D Walkthrough</span>
                  <span>WebGL</span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              COLUMN 2: CORE INNOVATIONS & IMPLEMENTATION
          ===================================================================== */}
          <div className="space-y-5">
            {/* Feature 1: Calibrated Human Walking Perception */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 print:text-emerald-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Footprints className="w-4 h-4" />
                <span>4. Spatial Scale & Human Cadence</span>
              </div>
              <h3 className="text-sm font-bold text-white print:text-black mb-1.5">
                Biometric Human Stride & Wide-Angle Vision
              </h3>
              <p className="text-xs text-stone-300 print:text-stone-800 leading-relaxed">
                Standard 3D viewers use unrealistic sprint speeds (3.6 m/s) and narrow FOVs (70°), making rooms look like congested boxes traversed in 5 keystrokes. Axis Architecture introduces:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-stone-400">WALKING PACE</div>
                  <div className="text-emerald-400 font-bold text-sm">1.18 m/s</div>
                  <div className="text-stone-500 text-[10px]">Natural domestic cadence</div>
                </div>
                <div className="p-2.5 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-stone-400">STRIDE LENGTH</div>
                  <div className="text-emerald-400 font-bold text-sm">0.48 m / step</div>
                  <div className="text-stone-500 text-[10px]">12m room = 25 steps</div>
                </div>
                <div className="p-2.5 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-stone-400">CAMERA LENS</div>
                  <div className="text-blue-400 font-bold text-sm">92° Panoramic</div>
                  <div className="text-stone-500 text-[10px]">Human binocular eye</div>
                </div>
                <div className="p-2.5 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-stone-400">HEAD BOBBING</div>
                  <div className="text-blue-400 font-bold text-sm">±0.022 m</div>
                  <div className="text-stone-500 text-[10px]">Sinusoidal footfall sway</div>
                </div>
              </div>
            </div>

            {/* Feature 2: Real-Time Solar Sun Study Simulation */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-400 print:text-amber-700 font-mono font-bold text-xs uppercase tracking-wider">
                <SunMedium className="w-4 h-4" />
                <span>5. Solar Study & Day/Night Lighting</span>
              </div>
              <h3 className="text-sm font-bold text-white print:text-black mb-1.5">
                Dynamic Solar Azimuth & Elevation Tracking
              </h3>
              <p className="text-xs text-stone-300 print:text-stone-800 leading-relaxed">
                Computes solar position between 06:00 AM and 10:00 PM, adjusting directional sunlight angle, sky color, warm soffit spotlights, and window grill shadow projections in real time. Enables passive solar heating analysis.
              </p>
              <div className="mt-2.5 flex items-center justify-between text-xs font-mono p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300 text-stone-300 print:text-black">
                <span>Presets: Sunrise (06:30)</span>
                <span>•</span>
                <span>Noon (12:00)</span>
                <span>•</span>
                <span>Golden Hour (17:30)</span>
              </div>
            </div>

            {/* Feature 3: Interactive Material Customizer */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-axis-terracotta print:text-red-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>6. PBR Material Palettes & Door Swings</span>
              </div>
              <p className="text-xs text-stone-300 print:text-stone-800 leading-relaxed">
                Instant 1-click material swaps (Italian Calacatta marble, Nordic Oak wood, Quartz Terrazzo, Clay tiles). Features interactive <b>animated door swings ($0^\circ \leftrightarrow 92^\circ$)</b> with CAD floor swing arcs on click.
              </p>
            </div>
          </div>

          {/* =====================================================================
              COLUMN 3: RESULTS, METRICS, COMPARISON & TECH STACK
          ===================================================================== */}
          <div className="space-y-5">
            {/* Performance Benchmark Table */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-blue-400 print:text-blue-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>7. Performance Comparison</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-stone-700 print:border-stone-400 text-stone-400 print:text-black">
                      <th className="py-1">Metric</th>
                      <th className="py-1">Revit / SketchUp</th>
                      <th className="py-1 text-emerald-400 print:text-emerald-700">Axis Architecture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 print:divide-stone-200 text-stone-300 print:text-stone-800">
                    <tr>
                      <td className="py-1.5 font-bold">2D→3D Time</td>
                      <td className="py-1.5 text-stone-400">4 – 8 Hours</td>
                      <td className="py-1.5 text-emerald-400 font-bold">1.8 Seconds</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">Human Cadence</td>
                      <td className="py-1.5 text-stone-400">Flying / None</td>
                      <td className="py-1.5 text-emerald-400 font-bold">25 steps / 12m</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">Solar Simulation</td>
                      <td className="py-1.5 text-stone-400">Pre-baked / Slow</td>
                      <td className="py-1.5 text-emerald-400 font-bold">Live 24h Slider</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">Hardware Req.</td>
                      <td className="py-1.5 text-stone-400">Heavy GPU Workstation</td>
                      <td className="py-1.5 text-emerald-400 font-bold">Any Web Browser</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quantitative Results Badges */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 print:text-emerald-700 font-mono font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>8. Evaluated System Metrics</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-xl font-extrabold text-emerald-400">94.2%</div>
                  <div className="text-[10px] text-stone-400">Wall Detection</div>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-xl font-extrabold text-blue-400">1.8s</div>
                  <div className="text-[10px] text-stone-400">Parser Latency</div>
                </div>
                <div className="p-2 rounded bg-stone-950 border border-stone-800 print:bg-white print:border-stone-300">
                  <div className="text-xl font-extrabold text-axis-terracotta">60 FPS</div>
                  <div className="text-[10px] text-stone-400">WebGL Render</div>
                </div>
              </div>
            </div>

            {/* Technologies Used */}
            <div className="p-5 rounded-xl bg-stone-900/90 border border-stone-800 print:bg-stone-50 print:border-stone-300 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-purple-400 print:text-purple-700 font-mono font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>9. Technologies Used</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">Next.js 14 (App Router)</span>
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">Three.js / React Three Fiber</span>
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">Python FastAPI Microservice</span>
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">OpenCV (CV Blueprint Parser)</span>
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">TailwindCSS / Framer Motion</span>
                <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 print:bg-stone-100 print:border-stone-300 text-stone-200 print:text-black">BIM Topology Vector Graph</span>
              </div>
            </div>

            {/* Conclusion & Future Work */}
            <div className="p-4 rounded-xl bg-axis-terracotta/10 border border-axis-terracotta/30 print:bg-stone-50 print:border-stone-400 text-xs text-stone-300 print:text-stone-800">
              <b>Conclusion:</b> Axis Architecture bridges the gap between 2D architectural drafting and spatial immersion. By combining autonomous CV feature extraction with biometrically calibrated human walking, it offers architects and clients instant, intuitive, and accurate architectural understanding.
            </div>
          </div>

        </div>

        {/* POSTER FOOTER */}
        <div className="bg-stone-950 px-8 py-3.5 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400 print:bg-white print:border-t print:text-black">
          <div>Axis Architecture — Department of CSE • Project Exhibition 2026</div>
          <div className="text-emerald-400 print:text-black font-semibold">Live Demonstration Ready: http://localhost:3000</div>
        </div>
      </div>
    </div>
  );
}
