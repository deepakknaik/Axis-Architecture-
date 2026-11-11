'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Layers,
  Compass,
  Eye,
  Maximize2,
  Grid,
  Ruler,
  RotateCcw,
  Box,
  MousePointer,
  Move,
  Footprints,
  EyeOff,
  AlertCircle,
  HelpCircle,
  X,
  Home,
  Tag,
  Armchair,
  Smartphone,
  Navigation,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Download,
  Check,
} from 'lucide-react';
import { BuildingModel, Room3D, BuildingFloor, Point3D } from '@/lib/reconstruction/types';
import {
  InteractionWorkspaceMode,
  ActiveViewportTool,
  CameraPresetType,
  CategoryVisibilityState,
  DEFAULT_CATEGORY_VISIBILITY,
  MeasurementItem,
} from '@/lib/reconstruction/interaction-types';
import { BuildingScene } from './building-scene';
import { TouchPadsState } from './walkthrough-controller';

export interface ViewerCanvasProps {
  model: BuildingModel;
  mode?: InteractionWorkspaceMode;
  tool?: ActiveViewportTool;
  onModeChange?: (mode: InteractionWorkspaceMode) => void;
  onToolChange?: (tool: ActiveViewportTool) => void;
  selectedElementId?: string | null;
  hoveredElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onHoverElement?: (id: string | null) => void;
  categoryVisibility?: CategoryVisibilityState;
  activeFloorId?: string | 'ALL';
  fadeNonSelectedFloors?: boolean;
  focusedRoom?: Room3D | null;
  focusedFloor?: BuildingFloor | null;
  fitTrigger?: number;
  resetTrigger?: number;
  onFitModel?: () => void;
  onResetWorkspace?: () => void;
  walkthroughStartPoint?: Point3D | null;
  className?: string;
}

export function ViewerCanvas({
  model,
  mode = 'INSPECT',
  tool = 'SELECT',
  onModeChange,
  onToolChange,
  selectedElementId,
  hoveredElementId,
  onSelectElement,
  onHoverElement,
  categoryVisibility = DEFAULT_CATEGORY_VISIBILITY,
  activeFloorId = 'ALL',
  fadeNonSelectedFloors = true,
  focusedRoom = null,
  focusedFloor = null,
  fitTrigger = 0,
  resetTrigger = 0,
  onFitModel,
  onResetWorkspace,
  walkthroughStartPoint = null,
  className = '',
}: ViewerCanvasProps) {
  const [cameraPreset, setCameraPreset] = React.useState<CameraPresetType>('AXONOMETRIC');
  const [showGrid, setShowGrid] = React.useState(true);
  const [wireframe, setWireframe] = React.useState(false);
  const [measurements, setMeasurements] = React.useState<MeasurementItem[]>([]);
  const [activeCollisionWallId, setActiveCollisionWallId] = React.useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Prototype Features: Roof, Labels, Fixtures toggles
  const [showRoof, setShowRoof] = React.useState(Boolean(categoryVisibility.roof));
  const [showLabels, setShowLabels] = React.useState(categoryVisibility.labels !== false);
  const [showFixtures, setShowFixtures] = React.useState(categoryVisibility.fixtures !== false);

  // Prototype Features: Live Room Location Tracker
  const [activeRoomInfo, setActiveRoomInfo] = React.useState<{ name: string; area?: number }>({
    name: 'Porch / Entrance',
  });

  // Prototype Features: Mobile / Touch D-pad & Turn Controls
  const [showTouchControls, setShowTouchControls] = React.useState(true);
  const [walkthroughFov, setWalkthroughFov] = React.useState<number>(78);
  const [touchPads, setTouchPads] = React.useState<TouchPadsState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
  });

  // 3D Model GLB Exporter State
  const exporterRef = React.useRef<(() => Promise<void>) | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportSuccess, setExportSuccess] = React.useState(false);

  const handleExportGLB = async () => {
    if (!exporterRef.current || isExporting) return;
    try {
      setIsExporting(true);
      await exporterRef.current();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export 3D building model to GLB:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Prototype Features: Quick-Jump Teleport Target
  const [quickJumpPoint, setQuickJumpPoint] = React.useState<Point3D | null>(walkthroughStartPoint);

  React.useEffect(() => {
    if (walkthroughStartPoint) {
      setQuickJumpPoint(walkthroughStartPoint);
    }
  }, [walkthroughStartPoint]);

  // Merge local view toggles with category visibility
  const mergedCategoryVisibility: CategoryVisibilityState = React.useMemo(() => {
    return {
      ...categoryVisibility,
      roof: mode === 'WALKTHROUGH' ? showRoof : showRoof,
      labels: mode === 'WALKTHROUGH' ? false : showLabels,
      fixtures: showFixtures,
    };
  }, [categoryVisibility, showRoof, showLabels, showFixtures, mode]);

  // Active rooms for the Quick-Jump toolbar
  const availableRooms: Room3D[] = React.useMemo(() => {
    if (activeFloorId === 'ALL') {
      return model.floors.flatMap((f) => f.rooms || []);
    }
    const currentFloor = model.floors.find((f) => f.id === activeFloorId);
    return currentFloor?.rooms || [];
  }, [model.floors, activeFloorId]);

  const handleQuickJump = (room: Room3D) => {
    const fl = model.floors.find((f) => f.id === room.floorId) || model.floors[0];
    const elev = fl?.elevationMeters || 0;
    setQuickJumpPoint({
      x: room.centroid.x,
      y: elev + 1.65,
      z: room.centroid.z,
    });
    setActiveRoomInfo({
      name: room.name,
      area: room.areaSqMeters,
    });
  };

  const handleAddMeasurement = (m: MeasurementItem) => {
    setMeasurements((prev) => [...prev, m]);
  };

  const handleRemoveMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMeasurements = () => {
    setMeasurements([]);
  };

  return (
    <div className={`relative w-full h-full bg-[#dde7ee] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [14, 11, 14], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        className="w-full h-full"
      >
        <BuildingScene
          model={model}
          mode={mode}
          tool={tool}
          selectedElementId={selectedElementId}
          hoveredElementId={hoveredElementId}
          onSelectElement={onSelectElement}
          onHoverElement={onHoverElement}
          categoryVisibility={mergedCategoryVisibility}
          showGrid={showGrid}
          wireframe={wireframe}
          cameraPreset={cameraPreset}
          activeFloorId={activeFloorId}
          fadeNonSelectedFloors={fadeNonSelectedFloors}
          focusedRoom={focusedRoom}
          focusedFloor={focusedFloor}
          fitTrigger={fitTrigger}
          resetTrigger={resetTrigger}
          measurements={measurements}
          onAddMeasurement={handleAddMeasurement}
          onRemoveMeasurement={handleRemoveMeasurement}
          onExitWalkthrough={() => onModeChange?.('INSPECT')}
          walkthroughStartPoint={quickJumpPoint}
          onCollisionChange={setActiveCollisionWallId}
          touchPads={touchPads}
          walkthroughFov={walkthroughFov}
          onActiveRoomChange={(name, area) => setActiveRoomInfo({ name, area })}
          onRegisterExporter={(fn) => {
            exporterRef.current = fn;
          }}
        />
      </Canvas>

      {/* INSPECT MODE: Floating Architectural Toolbar */}
      <AnimatePresence>
        {mode === 'INSPECT' && (
          <motion.div
            key="inspect-toolbar"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 flex-wrap"
          >
            {/* Tool Modes (Select, Orbit, Pan, Measure) */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-lg shadow-lg">
              <button
                type="button"
                onClick={() => onToolChange?.('SELECT')}
                title="Select Architectural Primitive (V)"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  tool === 'SELECT'
                    ? 'bg-axis-terracotta text-white font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span>Select</span>
              </button>
              <button
                type="button"
                onClick={() => onToolChange?.('ORBIT')}
                title="Orbit Inspection (O)"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  tool === 'ORBIT'
                    ? 'bg-axis-terracotta text-white font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Orbit</span>
              </button>
              <button
                type="button"
                onClick={() => onToolChange?.('PAN')}
                title="Pan Camera (H)"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  tool === 'PAN'
                    ? 'bg-axis-terracotta text-white font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>Pan</span>
              </button>
              <button
                type="button"
                onClick={() => onToolChange?.('MEASURE')}
                title="Point-to-Point Architectural Measurement (M)"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  tool === 'MEASURE'
                    ? 'bg-axis-terracotta text-white font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Measure</span>
              </button>

              {measurements.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearMeasurements}
                  title="Clear All Measurements"
                  className="px-2 py-1 text-[11px] font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors ml-1 border-l border-stone-800 pl-2"
                >
                  Clear ({measurements.length})
                </button>
              )}
            </div>

            {/* Camera Presets (Axon, Persp, Top, Front, Left, Right) */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-lg shadow-lg">
              {(
                [
                  ['AXONOMETRIC', 'Axon'],
                  ['PERSPECTIVE', 'Persp'],
                  ['TOP', 'Top (Plan)'],
                  ['FRONT', 'Front'],
                  ['LEFT', 'Left'],
                  ['RIGHT', 'Right'],
                ] as const
              ).map(([p, label]) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCameraPreset(p)}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                    cameraPreset === p
                      ? 'bg-axis-terracotta text-white font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {label}
                </button>
              ))}

              <div className="border-l border-stone-700 pl-1 ml-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onFitModel}
                  title="Fit Model to Viewport (F)"
                  className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded text-xs transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onResetWorkspace}
                  title="Reset View (R)"
                  className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View & Layer Toggles (Grid, Wireframe, Roof, Labels, Fixtures, Walkthrough) */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-lg shadow-lg">
              {/* Roof Toggle */}
              <button
                type="button"
                title="Toggle Roof Structure"
                onClick={() => setShowRoof(!showRoof)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
                  showRoof ? 'text-axis-terracotta bg-stone-800 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Roof</span>
              </button>

              {/* Labels Toggle */}
              <button
                type="button"
                title="Toggle 3D Floating Room Badges"
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
                  showLabels ? 'text-blue-400 bg-stone-800 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Labels</span>
              </button>

              {/* Fixtures Toggle */}
              <button
                type="button"
                title="Toggle Procedural Interior Fixtures"
                onClick={() => setShowFixtures(!showFixtures)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
                  showFixtures ? 'text-emerald-400 bg-stone-800 font-semibold' : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fixtures</span>
              </button>

              <div className="border-l border-stone-700 pl-1 ml-1 flex items-center gap-1">
                <button
                  type="button"
                  title="Toggle Ground Grid"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    showGrid ? 'text-axis-terracotta bg-stone-800' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Toggle Wireframe"
                  onClick={() => setWireframe(!wireframe)}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    wireframe ? 'text-axis-terracotta bg-stone-800' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Box className="w-4 h-4" />
                </button>
              </div>

              {/* Enter Walkthrough Button */}
              <button
                type="button"
                onClick={() => onModeChange?.('WALKTHROUGH')}
                className="flex items-center gap-1.5 px-3 py-1 bg-axis-terracotta hover:bg-[#b85d32] text-white rounded text-xs font-mono font-medium shadow transition-colors ml-1"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Walkthrough</span>
              </button>

              {/* 1-Click GLB 3D Model Export (Revit, Blender, CAD) */}
              <button
                type="button"
                onClick={handleExportGLB}
                disabled={isExporting}
                title="Export Reconstructed 3D Building Model (.glb) for Revit, Blender, or AutoCAD"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all shadow ml-1 border ${
                  exportSuccess
                    ? 'bg-emerald-700 border-emerald-500 text-white'
                    : isExporting
                    ? 'bg-stone-800 border-stone-700 text-stone-400 cursor-wait'
                    : 'bg-stone-800/90 hover:bg-stone-700/90 text-amber-300 border-amber-500/40 hover:border-amber-400'
                }`}
              >
                {exportSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Download className={`w-3.5 h-3.5 text-amber-400 ${isExporting ? 'animate-bounce' : ''}`} />
                )}
                <span>
                  {exportSuccess ? 'Exported!' : isExporting ? 'Exporting...' : 'Export .GLB'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WALKTHROUGH MODE: Immersive Architectural HUD Overlay */}
      <AnimatePresence>
        {mode === 'WALKTHROUGH' && (
          <motion.div
            key="walkthrough-hud"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.22 }}
            className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4"
          >
            {/* Top Bar: Walkthrough Status + Live Room Tracker + Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Mode Badge */}
                <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900/90 backdrop-blur-md border border-stone-800 text-xs font-mono text-stone-200 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    IMMERSIVE WALKTHROUGH
                  </span>
                  <span className="text-stone-600 hidden sm:inline">|</span>
                  <span className="text-stone-300 hidden sm:inline">
                    {activeFloorId === 'ALL' ? 'GROUND FLOOR' : activeFloorId}
                  </span>
                  <span className="text-stone-600 hidden md:inline">|</span>
                  <span className="text-axis-terracotta hidden md:inline">CAMERA 1.65m EYE-LEVEL</span>
                </div>

                {/* Right: Dynamic "In [Room Name]" HUD + Touch Dpad Toggle + Exit */}
                <div className="flex items-center gap-2">
                  {/* Prototype Feature: Live "In [Room Name]" HUD Badge */}
                  <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a]/95 border-l-4 border-l-blue-500 border border-stone-700/80 shadow-xl text-xs font-mono">
                    <span className="text-stone-400">IN</span>
                    <b className="font-bold text-white uppercase tracking-wider">
                      {activeRoomInfo.name}
                    </b>
                    {activeRoomInfo.area && (
                      <span className="text-blue-300 font-semibold hidden sm:inline">
                        · {activeRoomInfo.area.toFixed(1)} m²
                      </span>
                    )}
                  </div>

                  {/* Lens FOV Selector (Expands space perception) */}
                  <div className="pointer-events-auto hidden md:flex items-center gap-1 px-1.5 py-1 rounded-lg bg-stone-900/90 border border-stone-800 text-[11px] font-mono shadow-xl">
                    <span className="text-stone-400 px-1">Lens:</span>
                    {[
                      [72, 'Standard'],
                      [78, 'Wide'],
                      [86, 'Grand'],
                    ].map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setWalkthroughFov(Number(val))}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          walkthroughFov === val
                            ? 'bg-axis-terracotta text-white font-bold'
                            : 'text-stone-400 hover:text-white hover:bg-stone-800'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {/* Toggle Mobile Touch Controls */}
                  <button
                    type="button"
                    onClick={() => setShowTouchControls(!showTouchControls)}
                    title="Toggle Touch D-Pad Controls"
                    className={`pointer-events-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono shadow-xl transition-colors ${
                      showTouchControls
                        ? 'bg-blue-600/90 border-blue-500 text-white'
                        : 'bg-stone-900/90 border-stone-700 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pad</span>
                  </button>

                  {/* Exit Walkthrough Button */}
                  <button
                    type="button"
                    onClick={() => onModeChange?.('INSPECT')}
                    className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 backdrop-blur-md border border-stone-700 text-xs font-mono text-white shadow-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-stone-400" />
                    <span>Exit (ESC)</span>
                  </button>
                </div>
              </div>

              {/* Prototype Feature: "Go to" Room Quick-Jump Row */}
              {availableRooms.length > 0 && (
                <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-lg shadow-xl overflow-x-auto max-w-full">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400 font-semibold uppercase px-2 shrink-0">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    <span>Go to:</span>
                  </div>
                  {availableRooms.map((room) => {
                    const isCurrent =
                      activeRoomInfo.name.toLowerCase() === room.name.toLowerCase();
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => handleQuickJump(room)}
                        className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700'
                        }`}
                      >
                        {room.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Collision Warning Indicator */}
            {activeCollisionWallId && (
              <div className="self-center px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono tracking-wide animate-pulse shadow-md">
                WALL BOUNDARY CLEARANCE RESTRICTION ACTIVE ({activeCollisionWallId})
              </div>
            )}

            {/* Bottom Row: Touch D-Pad + Turning Buttons (Prototype Mobile Controls) */}
            <div className="flex items-end justify-between w-full">
              {/* On-Screen Touch D-Pad (Left Bottom) */}
              {showTouchControls && (
                <div className="pointer-events-auto grid grid-cols-3 gap-1.5 p-2 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl shadow-2xl">
                  {/* Row 1 */}
                  <div />
                  <button
                    type="button"
                    aria-label="Move Forward"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, forward: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, forward: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, forward: false }))}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border font-mono transition-colors ${
                      touchPads.forward
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                  <div />

                  {/* Row 2 */}
                  <button
                    type="button"
                    aria-label="Step Left"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, left: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, left: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, left: false }))}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border font-mono transition-colors ${
                      touchPads.left
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="w-11 h-11 flex items-center justify-center text-[10px] font-mono text-stone-500">
                    MOVE
                  </div>
                  <button
                    type="button"
                    aria-label="Step Right"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, right: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, right: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, right: false }))}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border font-mono transition-colors ${
                      touchPads.right
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Row 3 */}
                  <div />
                  <button
                    type="button"
                    aria-label="Move Backward"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, backward: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, backward: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, backward: false }))}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center border font-mono transition-colors ${
                      touchPads.backward
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>
                  <div />
                </div>
              )}

              {/* Center: Desktop Keymap Hint */}
              <div className="hidden lg:flex pointer-events-auto px-4 py-2 rounded-lg bg-stone-900/85 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-400 items-center gap-4 shadow-xl">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">W</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700 ml-1">A</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700 ml-1">S</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700 ml-1">D</kbd> or D-Pad Move
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">SHIFT</kbd> Sprint
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">MOUSE</kbd> Look (Click to lock)
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">ESC</kbd> Exit
                </span>
              </div>

              {/* Turning Controls (Right Bottom) */}
              {showTouchControls && (
                <div className="pointer-events-auto flex items-center gap-2 p-2 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl shadow-2xl">
                  <button
                    type="button"
                    aria-label="Turn Left"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, turnLeft: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, turnLeft: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, turnLeft: false }))}
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center border font-mono transition-colors ${
                      touchPads.turnLeft
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-[9px] mt-0.5 font-bold">TURN L</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Turn Right"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setTouchPads((p) => ({ ...p, turnRight: true }));
                    }}
                    onPointerUp={() => setTouchPads((p) => ({ ...p, turnRight: false }))}
                    onPointerLeave={() => setTouchPads((p) => ({ ...p, turnRight: false }))}
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center border font-mono transition-colors ${
                      touchPads.turnRight
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-stone-800/90 text-stone-200 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    <RotateCw className="w-5 h-5" />
                    <span className="text-[9px] mt-0.5 font-bold">TURN R</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Datum Status Bar (Only in Inspect Mode) */}
      {mode === 'INSPECT' && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
          <div className="px-2.5 py-1 rounded bg-stone-900/90 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-300 flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white">
              INSPECT MODE
            </span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-400">1 unit = 1.0 m</span>
            <span className="text-stone-500">|</span>
            <span className="text-axis-terracotta font-medium">
              {model.dimensions.widthMeters.toFixed(2)}m × {model.dimensions.depthMeters.toFixed(2)}m × {model.dimensions.heightMeters.toFixed(2)}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
