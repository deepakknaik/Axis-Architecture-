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
  Columns,
  FileCode2,
  Building2,
  Layers2,
  CheckCircle2,
  Palette,
  Sun,
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
import { WalkthroughMinimap } from './walkthrough-minimap';
import { MaterialSwatchPanel } from './material-swatch-panel';
import { SolarSliderControl } from './solar-slider-control';
import {
  MaterialCustomizationState,
  DEFAULT_MATERIAL_CUSTOMIZATION,
} from '@/lib/reconstruction/material-types';
import {
  SolarParameters,
  computeSolarParameters,
} from '@/lib/reconstruction/solar-types';

export type Architectural3DViewMode = 'EXTERIOR' | 'DOLLHOUSE' | 'CUTAWAY' | 'INTERIOR' | 'BIM';
export type UnitSystem = 'METRIC' | 'IMPERIAL';

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
  onActiveFloorChange?: (floorId: string | 'ALL') => void;
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
  onActiveFloorChange,
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

  // Reference UI Features: View Mode, Units, Exploded Stack, Floor Isolation
  const [viewMode, setViewMode] = React.useState<Architectural3DViewMode>('EXTERIOR');
  const [unitSystem, setUnitSystem] = React.useState<UnitSystem>('METRIC');
  const [isExploded, setIsExploded] = React.useState(false);
  const [internalFloorId, setInternalFloorId] = React.useState<string | 'ALL'>(activeFloorId);

  // Material Swatch Customizer State (Matching Reference Board: Material View)
  const [materialState, setMaterialState] = React.useState<MaterialCustomizationState>(
    DEFAULT_MATERIAL_CUSTOMIZATION
  );
  const [isMaterialPanelOpen, setIsMaterialPanelOpen] = React.useState(false);

  // Solar Simulation & Sun Study State (Matching Reference Feature)
  const [timeOfDay, setTimeOfDay] = React.useState<number>(14.5); // Default: 2:30 PM (crisp afternoon sun)
  const [isSunPlaying, setIsSunPlaying] = React.useState(false);
  const [showSolarControl, setShowSolarControl] = React.useState(false);

  const solarParams = React.useMemo(() => computeSolarParameters(timeOfDay), [timeOfDay]);

  React.useEffect(() => {
    setInternalFloorId(activeFloorId);
  }, [activeFloorId]);

  const currentFloorId = activeFloorId !== undefined ? activeFloorId : internalFloorId;

  const handleFloorSelect = (fId: string | 'ALL') => {
    setInternalFloorId(fId);
    onActiveFloorChange?.(fId);
  };

  // Prototype Features: Roof, Labels, Fixtures toggles
  const [showRoof, setShowRoof] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(categoryVisibility.labels !== false);
  const [showFixtures, setShowFixtures] = React.useState(categoryVisibility.fixtures !== false);

  // Handle View Mode Selector (Matching Reference Design: Exterior, Dollhouse, Cutaway, Interior, BIM)
  const handleViewModeChange = (targetMode: Architectural3DViewMode) => {
    setViewMode(targetMode);
    if (targetMode === 'EXTERIOR') {
      setShowRoof(true);
      setShowLabels(false);
      setShowFixtures(true);
      setWireframe(false);
      setCameraPreset('PERSPECTIVE');
      if (mode === 'WALKTHROUGH') onModeChange?.('INSPECT');
    } else if (targetMode === 'DOLLHOUSE') {
      setShowRoof(false);
      setShowLabels(true);
      setShowFixtures(true);
      setWireframe(false);
      setCameraPreset('AXONOMETRIC');
      if (mode === 'WALKTHROUGH') onModeChange?.('INSPECT');
    } else if (targetMode === 'CUTAWAY') {
      setShowRoof(false);
      setShowLabels(true);
      setShowFixtures(true);
      setWireframe(false);
      setCameraPreset('FRONT');
      if (mode === 'WALKTHROUGH') onModeChange?.('INSPECT');
    } else if (targetMode === 'INTERIOR') {
      setShowRoof(true);
      setShowLabels(false);
      setShowFixtures(true);
      setWireframe(false);
      onModeChange?.('WALKTHROUGH');
    } else if (targetMode === 'BIM') {
      setShowRoof(false);
      setShowLabels(true);
      setShowFixtures(false);
      setWireframe(true);
      setCameraPreset('AXONOMETRIC');
      if (mode === 'WALKTHROUGH') onModeChange?.('INSPECT');
    }
  };

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

  // Real-time Player Pose for Walkthrough Minimap Radar (Matching Reference Panel 3)
  const [playerPose, setPlayerPose] = React.useState<{ x: number; y: number; z: number; yaw: number }>({
    x: walkthroughStartPoint?.x || 0,
    y: 1.65,
    z: walkthroughStartPoint?.z || 0,
    yaw: 0,
  });

  React.useEffect(() => {
    if (walkthroughStartPoint) {
      setQuickJumpPoint(walkthroughStartPoint);
      setPlayerPose((p) => ({ ...p, x: walkthroughStartPoint.x, z: walkthroughStartPoint.z }));
    }
  }, [walkthroughStartPoint]);

  // Synchronize mode switch from outside (e.g. from buttons elsewhere)
  React.useEffect(() => {
    if (mode === 'WALKTHROUGH' && viewMode !== 'INTERIOR') {
      setViewMode('INTERIOR');
    } else if (mode === 'INSPECT' && viewMode === 'INTERIOR') {
      setViewMode('DOLLHOUSE');
    }
  }, [mode, viewMode]);

  // Merge local view toggles with category visibility
  const mergedCategoryVisibility: CategoryVisibilityState = React.useMemo(() => {
    return {
      ...categoryVisibility,
      roof: mode === 'WALKTHROUGH' ? showRoof : showRoof,
      labels: mode === 'WALKTHROUGH' ? false : showLabels,
      fixtures: showFixtures,
    };
  }, [categoryVisibility, showRoof, showLabels, showFixtures, mode]);

  // Active rooms for the Quick-Jump toolbar & BIM table
  const availableRooms: Room3D[] = React.useMemo(() => {
    if (currentFloorId === 'ALL') {
      return model.floors.flatMap((f) => f.rooms || []);
    }
    const currentFloor = model.floors.find((f) => f.id === currentFloorId);
    return currentFloor?.rooms || [];
  }, [model.floors, currentFloorId]);

  const totalBuiltUpAreaSqM = React.useMemo(() => {
    return model.floors.reduce((acc, f) => {
      const floorArea = (f.rooms || []).reduce((ra, r) => ra + (r.areaSqMeters || 0), 0);
      return acc + (floorArea > 0 ? floorArea : (f.slab?.areaSqMeters || 0));
    }, 0);
  }, [model.floors]);

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

  // Metric vs Imperial format helpers
  const formatLength = (meters: number) => {
    if (unitSystem === 'IMPERIAL') {
      return `${(meters * 3.28084).toFixed(1)} ft`;
    }
    return `${meters.toFixed(2)} m`;
  };

  const formatArea = (sqM: number) => {
    if (unitSystem === 'IMPERIAL') {
      return `${Math.round(sqM * 10.7639).toLocaleString()} sq.ft`;
    }
    return `${sqM.toFixed(1)} m²`;
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
          wireframe={viewMode === 'BIM' ? true : wireframe}
          cameraPreset={cameraPreset}
          activeFloorId={currentFloorId}
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
          isExplodedView={isExploded}
          onPlayerPoseChange={(pos, yaw) => setPlayerPose({ ...pos, yaw })}
          materialCustomization={materialState}
          solarParams={solarParams}
        />
      </Canvas>

      {/* TOP VIEW MODE SELECTOR (Exterior | Dollhouse | Cutaway | Interior | BIM) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center p-1 bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-xl shadow-2xl gap-1">
        {[
          { key: 'EXTERIOR', label: 'Exterior', icon: Home },
          { key: 'DOLLHOUSE', label: 'Dollhouse', icon: Building2 },
          { key: 'CUTAWAY', label: 'Cutaway', icon: Columns },
          { key: 'INTERIOR', label: 'Interior', icon: Armchair },
          { key: 'BIM', label: 'BIM', icon: FileCode2 },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = viewMode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleViewModeChange(key as Architectural3DViewMode)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isActive
                  ? 'bg-axis-terracotta text-white shadow-lg font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}

        {/* Material Swatch Customizer Toggle (Matching Reference Board: Material View) */}
        <div className="w-[1px] h-5 bg-stone-700/80 mx-1" />
        <button
          type="button"
          onClick={() => setIsMaterialPanelOpen(!isMaterialPanelOpen)}
          title="Customize Architectural PBR Materials (Floors, Walls, Roof)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            isMaterialPanelOpen
              ? 'bg-amber-600 text-white shadow-lg font-bold'
              : 'text-amber-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Materials</span>
        </button>

        {/* Sun Study / Day & Night Simulation Toggle */}
        <button
          type="button"
          onClick={() => setShowSolarControl(!showSolarControl)}
          title="Real-Time Sun Study & Day/Night Solar Simulation"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            showSolarControl
              ? 'bg-amber-600 text-white shadow-lg font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Sun Study</span>
        </button>
      </div>

      {/* Floating Solar Simulation Slider (Sun Study HUD) */}
      <AnimatePresence>
        {showSolarControl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20"
          >
            <SolarSliderControl
              timeOfDay={timeOfDay}
              onChangeTimeOfDay={setTimeOfDay}
              isPlaying={isSunPlaying}
              onTogglePlay={() => setIsSunPlaying(!isSunPlaying)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INSPECT MODE: Floating Secondary Architectural Toolbars */}
      <AnimatePresence>
        {mode === 'INSPECT' && (
          <motion.div
            key="inspect-toolbar"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="absolute top-16 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 flex-wrap z-10"
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

            {/* Top-Right Floating Radar Minimap (Matching Reference Panel 3) */}
            <div className="absolute top-28 right-4 pointer-events-auto z-20">
              <WalkthroughMinimap
                model={model}
                activeFloorId={currentFloorId}
                playerPose={playerPose}
                fov={walkthroughFov}
              />
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

      {/* Reference UI: Cutaway Section Floor Height Callouts */}
      {viewMode === 'CUTAWAY' && mode === 'INSPECT' && (
        <div className="absolute right-4 top-28 pointer-events-none z-10">
          <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-3 shadow-2xl space-y-2 text-xs font-mono text-stone-200 w-56">
            <div className="text-[11px] font-bold text-axis-terracotta uppercase tracking-wider flex items-center gap-1.5">
              <Columns className="w-3.5 h-3.5" />
              <span>Section Heights</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="p-1.5 rounded bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                <span className="text-stone-300">Roof Ridge</span>
                <span className="text-white font-bold">+{formatLength(7.8)}</span>
              </div>
              <div className="p-1.5 rounded bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                <div>
                  <div className="text-stone-200 font-semibold">First Floor</div>
                  <div className="text-[10px] text-stone-400">Floor Height: {formatLength(3.0)}</div>
                </div>
                <span className="text-blue-300 font-bold">+{formatLength(3.0)}</span>
              </div>
              <div className="p-1.5 rounded bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                <div>
                  <div className="text-stone-200 font-semibold">Ground Floor</div>
                  <div className="text-[10px] text-stone-400">Floor Height: {formatLength(3.0)}</div>
                </div>
                <span className="text-emerald-300 font-bold">+{formatLength(0.0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reference UI: Exploded Multi-Floor Stack Indicator Card */}
      {isExploded && currentFloorId === 'ALL' && mode === 'INSPECT' && (
        <div className="absolute right-4 top-28 pointer-events-none z-10 animate-in fade-in slide-in-from-right duration-200">
          <div className="bg-stone-900/95 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 shadow-2xl text-xs font-mono text-stone-200 w-60 space-y-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers2 className="w-4 h-4" />
              <span>Multi-Floor Output (Stack)</span>
            </div>
            <div className="space-y-1 pt-1 text-[11px]">
              <div className="p-2 rounded bg-stone-800/90 border border-stone-700 flex items-center justify-between">
                <span className="font-semibold text-stone-200">Roof / Terrace</span>
                <span className="text-stone-400 text-[10px]">+{formatLength(6.0)}</span>
              </div>
              <div className="p-2 rounded bg-stone-800/90 border border-blue-500/40 flex items-center justify-between">
                <span className="font-semibold text-blue-200">First Floor</span>
                <span className="text-blue-400 text-[10px]">FFL +{formatLength(3.0)}</span>
              </div>
              <div className="p-2 rounded bg-stone-800/90 border border-emerald-500/40 flex items-center justify-between">
                <span className="font-semibold text-emerald-200">Ground Floor</span>
                <span className="text-emerald-400 text-[10px]">FFL +{formatLength(0.0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reference UI: Technical / BIM View Schedule Card */}
      {viewMode === 'BIM' && mode === 'INSPECT' && (
        <div className="absolute right-4 bottom-16 pointer-events-auto z-10 max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-stone-900/95 backdrop-blur-md border border-blue-500/40 rounded-xl p-3.5 shadow-2xl text-xs font-mono text-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 font-bold text-blue-400 uppercase tracking-wider text-[11px]">
                <FileCode2 className="w-4 h-4" />
                <span>Technical / BIM View</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-900/50 border border-blue-700 text-blue-300 text-[10px]">
                LOD-300
              </span>
            </div>

            {/* Room Schedule Table */}
            <div className="max-h-44 overflow-y-auto pr-1">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-stone-400 border-b border-stone-800">
                    <th className="py-1 font-semibold">Room</th>
                    <th className="py-1 font-semibold text-right">Size ({unitSystem === 'IMPERIAL' ? 'ft' : 'm'})</th>
                    <th className="py-1 font-semibold text-right">Area ({unitSystem === 'IMPERIAL' ? 'sq.ft' : 'm²'})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50">
                  {availableRooms.map((rm) => {
                    const widthM = rm.dimensions?.widthMeters ?? 3.5;
                    const depthM = rm.dimensions?.depthMeters ?? 3.5;
                    const sizeStr = `${formatLength(widthM)} × ${formatLength(depthM)}`;
                    return (
                      <tr key={rm.id} className="hover:bg-stone-800/40">
                        <td className="py-1 text-stone-200 truncate max-w-[130px]">{rm.name}</td>
                        <td className="py-1 text-stone-400 text-right whitespace-nowrap">{sizeStr}</td>
                        <td className="py-1 text-blue-300 font-semibold text-right whitespace-nowrap">
                          {formatArea(rm.areaSqMeters || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Technical BIM Specification Badges */}
            <div className="pt-2 border-t border-stone-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Wall Thickness: <b>0.23 m (9&quot;)</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>No. of Floors: <b>{model.floors.length}</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Total Built-up Area: <b className="text-axis-terracotta">{formatArea(totalBuiltUpAreaSqM)}</b></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floor Selector, Units & Exploded Controls (Matching Reference Design) */}
      {mode === 'INSPECT' && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 flex-wrap z-10">
          <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
            {/* 1. Floor Selector Bar (All Floors | Ground Floor | First Floor) */}
            <div className="flex items-center gap-1 p-1 bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-xl shadow-xl text-xs font-mono">
              <span className="text-stone-400 px-2 font-semibold">Floor:</span>
              <button
                type="button"
                onClick={() => handleFloorSelect('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentFloorId === 'ALL'
                    ? 'bg-axis-terracotta text-white font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                All Floors
              </button>
              {model.floors.map((floor, idx) => {
                const isActive = currentFloorId === floor.id;
                const floorName =
                  floor.name || (idx === 0 ? 'Ground Floor' : idx === 1 ? 'First Floor' : `Floor ${idx + 1}`);
                return (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => handleFloorSelect(floor.id)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-axis-terracotta text-white font-bold shadow'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {floorName}
                  </button>
                );
              })}
            </div>

            {/* 2. Exploded Stack Multi-Floor Separator Button */}
            {model.floors.length > 1 && (
              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                title="Explode floor plates vertically to inspect each level simultaneously"
                className={`pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border shadow-xl transition-all ${
                  isExploded
                    ? 'bg-amber-600 border-amber-400 text-white font-bold shadow-amber-900/30'
                    : 'bg-stone-900/95 border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Layers2 className="w-3.5 h-3.5" />
                <span>Exploded Stack</span>
              </button>
            )}

            {/* 3. Metric (m) vs Imperial (ft) Unit Toggle */}
            <div className="pointer-events-auto flex items-center p-1 bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-xl shadow-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => setUnitSystem('METRIC')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unitSystem === 'METRIC'
                    ? 'bg-stone-700 text-white font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Metric (m)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('IMPERIAL')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  unitSystem === 'IMPERIAL'
                    ? 'bg-stone-700 text-white font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Imperial (ft)
              </button>
            </div>
          </div>

          {/* Model Dimensions Datum Badge */}
          <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-300 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-400">Total Bounding:</span>
            <span className="text-axis-terracotta font-medium">
              {formatLength(model.dimensions.widthMeters)} × {formatLength(model.dimensions.depthMeters)} × {formatLength(model.dimensions.heightMeters)}
            </span>
          </div>
        </div>
      )}

      {/* Material Swatch Customizer Panel (Matching Reference Board: Material View) */}
      <MaterialSwatchPanel
        isOpen={isMaterialPanelOpen}
        onClose={() => setIsMaterialPanelOpen(false)}
        materialState={materialState}
        onMaterialChange={setMaterialState}
      />
    </div>
  );
}
