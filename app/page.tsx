'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Compass,
  Layers,
  Box,
  FileCode2,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  Check,
  Download,
  Eye,
} from 'lucide-react';
import { Button, IconButton } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Panel, PanelHeader, PanelBody } from '@/components/ui/panel';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Divider } from '@/components/ui/divider';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { Tooltip } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/ui/empty-state';
import { ArchitecturalGrid, ArchitecturalCoordinateDatum } from '@/components/shared/architectural-grid';
import { FadeIn, ArchitecturalCadence } from '@/components/animation/motion';
import { AXIS_TOKENS } from '@/lib/constants/theme';
import { AxisStatusType } from '@/lib/types/status';
import { ROUTES } from '@/lib/constants/navigation';

export default function AxisFoundationShowcasePage() {
  const [activeTab, setActiveTab] = React.useState('components');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [progressVal, setProgressVal] = React.useState(68);
  const [activeElementFilter, setActiveElementFilter] = React.useState('ALL');

  const statuses: AxisStatusType[] = [
    'READY',
    'PROCESSING',
    'ANALYZING',
    'NEEDS_REVIEW',
    'VERIFIED',
    'GENERATING',
    'COMPLETED',
    'FAILED',
  ];

  return (
    <div className="flex-1 w-full bg-axis-bg">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. HERO SECTION: Brand Identity & Architectural System Announcement */}
      {/* ---------------------------------------------------------------------- */}
      <ArchitecturalGrid
        className="border-b border-axis-border pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-axis-bg to-axis-bg-subtle"
        gridSize={28}
        withCrosshairs
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm" icon={<Compass className="w-3 h-3" />}>
                SPATIAL PLATFORM
              </Badge>
              <Badge variant="subtle" size="sm">
                Next.js 14 · Tailwind · TypeScript · Three.js
              </Badge>
            </div>
            <ArchitecturalCoordinateDatum datum="DATUM-001" scale="1:100" />
          </div>

          <FadeIn className="max-w-3xl space-y-4">
            <div className="inline-block font-mono text-xs text-axis-accent font-semibold tracking-widest uppercase">
              AXIS ARCHITECTURE PLATFORM
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-axis-text-primary leading-[1.15]">
              Spatial Intelligence & Architectural Reconstruction System
            </h1>
            <p className="text-sm sm:text-base text-axis-text-secondary leading-relaxed max-w-2xl">
              Foundation release establishing the warm architectural design system, centralized tokens,
              reusable component matrix, CAD drafting visual language, and strongly typed architectural data contracts.
            </p>
          </FadeIn>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
            <Link href={ROUTES.PROJECTS.LIST}>
              <Button variant="secondary" size="md" leftIcon={<Layers className="w-4 h-4" />}>
                Projects
              </Button>
            </Link>
            <Link href="#design-system">
              <Button variant="outline" size="md">
                Design System
              </Button>
            </Link>
          </div>
        </div>
      </ArchitecturalGrid>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. DESIGN TOKENS SHOWCASE (Palette, Typography, Shadows, Radius) */}
      {/* ---------------------------------------------------------------------- */}
      <section id="design-system" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-axis-border pb-4 gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-axis-accent">
              Section 01 · Design Tokens
            </span>
            <h2 className="text-2xl font-medium text-axis-text-primary tracking-tight mt-1">
              Warm Architectural Palette & Hierarchy
            </h2>
          </div>
          <p className="text-xs text-axis-text-secondary max-w-md">
            Strictly non-dark, non-sterile off-white limestone and warm ivory tones engineered for
            long CAD sessions.
          </p>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-bg shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#F8F6F1] border border-axis-border mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Ivory Base</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#F8F6F1 · App Bg</p>
          </div>

          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-surface shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#EEEAE2] border border-axis-border mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Limestone</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#EEEAE2 · Surface</p>
          </div>

          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-bg-elevated shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#FCFAF7] border border-axis-border mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Elevated White</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#FCFAF7 · Panels</p>
          </div>

          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-bg shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#252525] rounded-axis-xs mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Soft Charcoal</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#252525 · Primary</p>
          </div>

          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-bg shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#6F6B63] rounded-axis-xs mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Slate Gray</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#6F6B63 · Secondary</p>
          </div>

          <div className="rounded-axis-sm border border-axis-border p-3 bg-axis-bg shadow-axis-xs">
            <div className="h-14 rounded-axis-xs bg-[#B85D36] rounded-axis-xs mb-2" />
            <p className="text-xs font-medium text-axis-text-primary">Terracotta</p>
            <p className="font-mono text-[10px] text-axis-text-muted">#B85D36 · Accent</p>
          </div>
        </div>

        {/* Typography Scale Preview */}
        <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
          <CardHeader>
            <CardTitle>Typography System Hierarchy</CardTitle>
            <CardDescription>
              Clean, geometric, spacious type scales tuned for technical clarity and architectural reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-baseline border-b border-axis-border/60 pb-3 gap-2">
              <span className="font-mono text-xs text-axis-text-muted">Display · 44px</span>
              <p className="md:col-span-3 text-3xl sm:text-4xl font-medium tracking-tight text-axis-text-primary">
                AXIS Spatial Reconstruction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-baseline border-b border-axis-border/60 pb-3 gap-2">
              <span className="font-mono text-xs text-axis-text-muted">Heading 1 · 32px</span>
              <p className="md:col-span-3 text-2xl sm:text-3xl font-medium tracking-tight text-axis-text-primary">
                2D Blueprint to Parametric 3D
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-baseline border-b border-axis-border/60 pb-3 gap-2">
              <span className="font-mono text-xs text-axis-text-muted">Heading 2 · 24px</span>
              <p className="md:col-span-3 text-xl sm:text-2xl font-medium tracking-tight text-axis-text-primary">
                Floor Plan Vector Segmentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-baseline border-b border-axis-border/60 pb-3 gap-2">
              <span className="font-mono text-xs text-axis-text-muted">Body Text · 14px</span>
              <p className="md:col-span-3 text-sm text-axis-text-secondary leading-relaxed">
                The AXIS architectural pipeline interprets raster and vector drawings, calibrating scale
                ratios and resolving interior wall partitions, fenestrations, and boundary rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
              <span className="font-mono text-xs text-axis-text-muted">Caption & Monospace</span>
              <div className="md:col-span-3 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-axis-text-muted font-medium">
                  DATUM REF // LEVEL 01
                </span>
                <span className="font-mono text-xs text-axis-accent bg-axis-accent/10 px-2 py-0.5 rounded">
                  POS: [X: 12.450m, Y: 8.200m, Z: 3.000m]
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. REUSABLE COMPONENT MATRIX SHOWCASE */}
      {/* ---------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-axis-border pb-4 gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-axis-accent">
              Section 02 · Component Library
            </span>
            <h2 className="text-2xl font-medium text-axis-text-primary tracking-tight mt-1">
              Architectural UI Controls & States
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              variant="pills"
              items={[
                { id: 'components', label: 'UI Controls' },
                { id: 'status', label: 'Status Badges' },
                { id: 'contracts', label: 'Data Contracts' },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* Tab 1: Reusable Components */}
        {activeTab === 'components' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Button System */}
            <Card className="bg-axis-bg-elevated border-axis-border">
              <CardHeader>
                <CardTitle>Button System (Section 15 Specification)</CardTitle>
                <CardDescription>
                  Dedicated hierarchy covering primary actions, secondary workspace tools, ghost
                  indicators, destructive confirmations, and compact CAD icon buttons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary (Create Project)</Button>
                  <Button variant="secondary">Secondary (Upload)</Button>
                  <Button variant="outline">Outline Action</Button>
                  <Button variant="bronze">Bronze Variant</Button>
                  <Button variant="ghost">Ghost Control</Button>
                  <Button variant="destructive">Destructive Action</Button>
                  <Button variant="primary" isLoading>
                    Loading Action
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>
                <Divider subtle />
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-axis-text-muted">ICON BUTTONS:</span>
                  <Tooltip content="Drafting Compass">
                    <IconButton
                      variant="secondary"
                      size="iconMd"
                      aria-label="Compass"
                      icon={<Compass className="w-4 h-4 text-axis-accent" />}
                    />
                  </Tooltip>
                  <Tooltip content="Inspect Model">
                    <IconButton
                      variant="secondary"
                      size="iconMd"
                      aria-label="Inspect"
                      icon={<Eye className="w-4 h-4 text-axis-text-secondary" />}
                    />
                  </Tooltip>
                  <Tooltip content="Download CAD Vector">
                    <IconButton
                      variant="outline"
                      size="iconMd"
                      aria-label="Download"
                      icon={<Download className="w-4 h-4 text-axis-text-secondary" />}
                    />
                  </Tooltip>
                  <IconButton
                    variant="primary"
                    size="iconMd"
                    aria-label="Layers"
                    icon={<Layers className="w-4 h-4" />}
                  />
                  <IconButton
                    variant="secondary"
                    size="iconMd"
                    aria-label="Loading"
                    isLoading
                    icon={<Sliders className="w-4 h-4" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Form Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-axis-bg-elevated border-axis-border">
                <CardHeader>
                  <CardTitle>Architectural Input Controls</CardTitle>
                  <CardDescription>
                    Geometric text fields with crisp focus rings and metric formatting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-axis-text-secondary mb-1">
                      Project Reference Code
                    </label>
                    <Input
                      placeholder="e.g. AXIS-2026-BLD-09"
                      leftIcon={<Code2 className="w-4 h-4" />}
                      defaultValue="AXIS-2026-BLD-09"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-axis-text-secondary mb-1">
                      Drawing Scale Calibration
                    </label>
                    <Select
                      options={[
                        { label: 'Metric 1:100 (1cm = 1m)', value: '1:100' },
                        { label: 'Metric 1:50 (2cm = 1m)', value: '1:50' },
                        { label: 'Imperial 1/4" = 1\'-0"', value: 'imperial_1_4' },
                        { label: 'Custom Calibration Vector', value: 'custom' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Progress & Indicators */}
              <Card className="bg-axis-bg-elevated border-axis-border">
                <CardHeader>
                  <CardTitle>Progress & Dimensional Scales</CardTitle>
                  <CardDescription>
                    Architectural line progress bars with precise percentage indicators.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Progress
                    label="Reconstruction Pipeline"
                    value={progressVal}
                    showPercentage
                    variant="terracotta"
                  />
                  <Progress
                    label="Vector Feature Calibration"
                    value={92}
                    showPercentage
                    variant="bronze"
                  />
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setProgressVal(Math.max(10, progressVal - 15))}
                    >
                      - Step
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setProgressVal(Math.min(100, progressVal + 15))}
                    >
                      + Step
                    </Button>
                    <span className="text-xs font-mono text-axis-text-muted ml-auto">
                      STATUS: {progressVal}% COMPILED
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Empty State & Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Panel className="md:col-span-2">
                <PanelHeader>
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-axis-accent" />
                    <span className="text-xs font-medium text-axis-text-primary">
                      Inspection Panel Shell
                    </span>
                  </div>
                  <Badge variant="subtle" size="sm">
                    CAD INSPECTOR
                  </Badge>
                </PanelHeader>
                <PanelBody>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 rounded bg-axis-surface/40 border border-axis-border/60">
                      <span className="text-[10px] text-axis-text-muted uppercase block">
                        WALL THICKNESS
                      </span>
                      <span className="font-mono font-medium text-axis-text-primary">0.30 m</span>
                    </div>
                    <div className="p-2 rounded bg-axis-surface/40 border border-axis-border/60">
                      <span className="text-[10px] text-axis-text-muted uppercase block">
                        SLAB CLEARANCE
                      </span>
                      <span className="font-mono font-medium text-axis-text-primary">3.20 m</span>
                    </div>
                    <div className="p-2 rounded bg-axis-surface/40 border border-axis-border/60">
                      <span className="text-[10px] text-axis-text-muted uppercase block">
                        TOTAL FLOORS
                      </span>
                      <span className="font-mono font-medium text-axis-text-primary">3 Levels</span>
                    </div>
                    <div className="p-2 rounded bg-axis-surface/40 border border-axis-border/60">
                      <span className="text-[10px] text-axis-text-muted uppercase block">
                        CALIBRATED DPI
                      </span>
                      <span className="font-mono font-medium text-axis-text-primary">300 DPI</span>
                    </div>
                  </div>
                </PanelBody>
              </Panel>

              <EmptyState
                title="Blueprint Not Loaded"
                description="Ingestion queue empty. Select an architectural drawing to calibrate."
                action={{
                  label: 'Ingest Blueprint',
                  onClick: () => setIsModalOpen(true),
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Status Badges (Section 16 Specification) */}
        {activeTab === 'status' && (
          <Card className="bg-axis-bg-elevated border-axis-border">
            <CardHeader>
              <CardTitle>AXIS Architectural Status Language (Section 16)</CardTitle>
              <CardDescription>
                Unified visual indicators for processing stages. Features distinct icons, subtle tints,
                and animated pulse rings where operations are active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statuses.map((status) => (
                  <div
                    key={status}
                    className="p-3.5 rounded-axis-sm border border-axis-border bg-axis-bg flex flex-col justify-between gap-3 shadow-axis-xs"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={status} size="md" />
                      <span className="font-mono text-[10px] text-axis-text-muted">STAGE</span>
                    </div>
                    <p className="text-xs text-axis-text-secondary leading-relaxed">
                      {status === 'READY' && 'System primed for blueprint drawing input.'}
                      {status === 'PROCESSING' && 'Executing active background computation.'}
                      {status === 'ANALYZING' && 'Performing vector extraction on architectural drawing.'}
                      {status === 'NEEDS_REVIEW' && 'Low confidence elements flagged for human review.'}
                      {status === 'VERIFIED' && 'Architect validated all dimensional bounding lines.'}
                      {status === 'GENERATING' && 'Extruding 3D parametric building geometries.'}
                      {status === 'COMPLETED' && 'Building model synthesized and ready for inspection.'}
                      {status === 'FAILED' && 'Invalid scale or unresolvable blueprint geometry.'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Data Contracts Inspection */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <Card className="bg-axis-bg-elevated border-axis-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Architectural Data Contracts (Sections 17 & 18)</CardTitle>
                    <CardDescription>
                      Strict TypeScript data types established for Walls, Doors, Windows, Rooms, Stairs,
                      Columns, and Building Models.
                    </CardDescription>
                  </div>
                  <Badge variant="accent" size="sm">
                    TYPESAFE TS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap pb-2">
                  {['WALL', 'DOOR', 'WINDOW', 'ROOM', 'STAIR', 'COLUMN'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveElementFilter(type)}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                        activeElementFilter === type
                          ? 'border-axis-accent bg-axis-accent text-white'
                          : 'border-axis-border bg-axis-surface/60 text-axis-text-secondary hover:bg-axis-surface'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveElementFilter('ALL')}
                    className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                      activeElementFilter === 'ALL'
                        ? 'border-axis-accent bg-axis-accent text-white'
                        : 'border-axis-border bg-axis-surface/60 text-axis-text-secondary hover:bg-axis-surface'
                    }`}
                  >
                    SHOW ALL
                  </button>
                </div>

                <div className="bg-[#252525] text-axis-bg rounded-axis-sm p-4 font-mono text-xs overflow-x-auto border border-axis-border">
                  <div className="flex items-center justify-between text-axis-text-muted pb-2 border-b border-white/10 mb-2">
                    <span>lib/types/architectural.ts</span>
                    <span>ACTIVE CONTRACT SCHEMA</span>
                  </div>
                  <pre className="text-gray-300">
                    {`// Base Contract for Extracted Architectural Entities
export interface BaseArchitecturalElement {
  id: string;
  type: 'WALL' | 'DOOR' | 'WINDOW' | 'ROOM' | 'STAIR' | 'COLUMN';
  floorId: string;
  confidence: number; // 0.0 to 1.0 (from analysis model)
  status: 'DETECTED' | 'VERIFIED' | 'MODIFIED' | 'FLAGGED' | 'REJECTED';
  transform: { position: Vector3D; rotation: Vector3D };
  dimensions: { width: number; length: number; height: number };
  rawBounds2D: BoundingBox2D; // Pixel coordinates in blueprint
  metadata: Record<string, unknown>;
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. ROUTE ARCHITECTURE MAP */}
      {/* ---------------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="bg-axis-surface/30 border-axis-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-axis-accent">
                  Section 03 · Application Architecture
                </span>
                <CardTitle className="mt-1">Prepared Route Topology</CardTitle>
                <CardDescription>
                  Production release architecture for spatial intelligence and 3D reconstruction.
                </CardDescription>
              </div>
              <StatusBadge status="READY" size="sm" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <Link
                href="/login"
                className="p-3.5 rounded-axis-xs bg-axis-bg-elevated border border-axis-border hover:border-axis-border-strong transition-all space-y-1.5"
              >
                <span className="font-mono text-[10px] text-axis-accent font-semibold uppercase">
                  /login
                </span>
                <p className="font-medium text-axis-text-primary">Auth Gateway</p>
                <p className="text-[11px] text-axis-text-secondary">Architect access portal</p>
              </Link>

              <Link
                href="/dashboard"
                className="p-3.5 rounded-axis-xs bg-axis-bg-elevated border border-axis-border hover:border-axis-border-strong transition-all space-y-1.5"
              >
                <span className="font-mono text-[10px] text-axis-accent font-semibold uppercase">
                  /dashboard
                </span>
                <p className="font-medium text-axis-text-primary">Dashboard Hub</p>
                <p className="text-[11px] text-axis-text-secondary">Project pipeline manager</p>
              </Link>

              <Link
                href="/projects"
                className="p-3.5 rounded-axis-xs bg-axis-bg-elevated border border-axis-border hover:border-axis-border-strong transition-all space-y-1.5"
              >
                <span className="font-mono text-[10px] text-axis-accent font-semibold uppercase">
                  /projects
                </span>
                <p className="font-medium text-axis-text-primary">Projects Index</p>
                <p className="text-[11px] text-axis-text-secondary">Blueprint archive & levels</p>
              </Link>

              <Link
                href="/projects/proj_axis_demo_01/workspace"
                className="p-3.5 rounded-axis-xs bg-axis-bg-elevated border border-axis-border hover:border-axis-border-strong transition-all space-y-1.5"
              >
                <span className="font-mono text-[10px] text-axis-accent font-semibold uppercase">
                  /projects/.../workspace
                </span>
                <p className="font-medium text-axis-text-primary">3D Workspace</p>
                <p className="text-[11px] text-axis-text-secondary">Three.js spatial viewport</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Modal Dialog Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Blueprint Scale Calibration"
        description="Verify architectural dimension calibration before vector parsing."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Confirm Datum
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-axis-text-secondary leading-relaxed">
            The foundation calibration engine requires a known measured segment on the blueprint
            (e.g., standard 0.90m doorway or 6.00m exterior wall line).
          </p>
          <div className="p-3 rounded bg-axis-surface border border-axis-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-axis-text-secondary">CALIBRATION FACTOR:</span>
              <span className="font-mono font-medium text-axis-text-primary">42.50 px / meter</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-axis-text-secondary">SCALE RATIO:</span>
              <span className="font-mono font-medium text-axis-text-primary">1:100 METRIC</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
