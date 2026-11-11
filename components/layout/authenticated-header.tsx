'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  HelpCircle,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Check,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { Tooltip } from '@/components/ui/tooltip';
import { StatusBadge } from '@/components/ui/status-badge';
import { ROUTES } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

export interface AuthenticatedHeaderProps {
  onToggleSidebar?: () => void;
  collapsed?: boolean;
}

export function AuthenticatedHeader({ onToggleSidebar, collapsed }: AuthenticatedHeaderProps) {
  const pathname = usePathname();
  const [unitSystem, setUnitSystem] = React.useState<'METRIC' | 'IMPERIAL'>('METRIC');
  const [hasUnreadNotification, setHasUnreadNotification] = React.useState(true);

  // Derive title & breadcrumb based on route
  const getRouteInfo = () => {
    if (pathname === '/dashboard') {
      return { title: 'Dashboard', section: 'WORKSPACE', datum: 'DSH-PRIMARY' };
    }
    if (pathname === '/projects') {
      return { title: 'Projects Archive', section: 'WORKSPACE', datum: 'PRJ-LEVEL-0' };
    }
    if (pathname.includes('/blueprint')) {
      return { title: 'Blueprint Engine', section: 'PROJECTS', datum: 'CALIB-2D' };
    }
    if (pathname.includes('/workspace')) {
      return { title: '3D Spatial Workspace', section: 'PROJECTS', datum: 'VIEWPORT-3D' };
    }
    if (pathname.includes('/analysis')) {
      return { title: 'Vector Analysis', section: 'PROJECTS', datum: 'SEGMENT-AI' };
    }
    if (pathname.startsWith('/projects/')) {
      return { title: 'Project Details', section: 'PROJECTS', datum: 'PRJ-SPEC' };
    }
    if (pathname === '/ai-assistant') {
      return { title: 'AI Spatial Assistant', section: 'WORKSPACE', datum: 'AI-CORE' };
    }
    if (pathname === '/templates') {
      return { title: 'Architectural Templates', section: 'STUDIO', datum: 'TMPL-LIB' };
    }
    if (pathname === '/settings') {
      return { title: 'Workspace Settings', section: 'STUDIO', datum: 'CONF-SYS' };
    }
    if (pathname === '/help') {
      return { title: 'Documentation & Reference', section: 'STUDIO', datum: 'DOCS-SPEC' };
    }
    return { title: 'Workspace', section: 'AXIS', datum: 'SYS-01' };
  };

  const routeInfo = getRouteInfo();

  return (
    <header className="sticky top-0 z-20 w-full h-14 border-b border-axis-border bg-axis-bg/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none">
      {/* ------------------------------------------------------------------ */}
      {/* LEFT: SECTION TITLE, BREADCRUMB, AND DATUM WATERMARK */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider hidden sm:inline">
            {routeInfo.section}
          </span>
          <ChevronRight className="w-3 h-3 text-axis-border-strong hidden sm:inline" />
          <h1 className="text-sm font-semibold tracking-tight text-axis-text-primary truncate">
            {routeInfo.title}
          </h1>
        </div>

        {/* Architectural Datum Badge */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-axis-border text-[10px] font-mono text-axis-text-muted select-none">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-axis-accent/60" />
            REF: {routeInfo.datum}
          </span>
          <span>·</span>
          <span>ELEV: +0.000m</span>
          <span>·</span>
          <span>GRID: 01</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT: UNIT TOGGLE, SYSTEM NOTIFICATIONS, DOCS, AND STATUS */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Unit System Indicator Toggle */}
        <button
          type="button"
          onClick={() => setUnitSystem(unitSystem === 'METRIC' ? 'IMPERIAL' : 'METRIC')}
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-axis-xs border border-axis-border bg-axis-surface/60 hover:bg-axis-surface text-[10px] font-mono text-axis-text-secondary hover:text-axis-text-primary transition-colors focus-visible:outline-none"
          title="Click to toggle between Metric (meters) and Imperial (feet/inches)"
        >
          <span className="text-axis-accent font-semibold">{unitSystem === 'METRIC' ? 'METRIC (m)' : 'IMPERIAL (ft)'}</span>
          <span className="text-axis-text-muted">1:100</span>
        </button>

        {/* Status indicator */}
        <div className="hidden md:block">
          <StatusBadge status="READY" size="sm" showIcon={false} />
        </div>

        {/* Help Link */}
        <Tooltip content="Documentation & Standards">
          <Link
            href={ROUTES.HELP}
            className="p-1.5 rounded-axis-xs text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60 transition-colors focus-visible:outline-none"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>
        </Tooltip>

        {/* Notifications Popover */}
        <Tooltip content="System Notifications">
          <button
            type="button"
            onClick={() => setHasUnreadNotification(false)}
            aria-label="Notifications"
            className="relative p-1.5 rounded-axis-xs text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60 transition-colors focus-visible:outline-none"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotification && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-axis-accent rounded-full ring-2 ring-axis-bg" />
            )}
          </button>
        </Tooltip>

        {/* User Avatar Menu */}
        <div className="pl-1 border-l border-axis-border/80">
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent"
              >
                <Avatar
                  name="Deepak"
                  size="sm"
                  className="bg-axis-accent/15 text-axis-accent font-semibold border-axis-accent/30 cursor-pointer"
                />
              </button>
            }
            items={[
              {
                id: 'status',
                label: 'Deepak · Lead Architect',
                disabled: true,
              },
              {
                id: 'settings',
                label: 'Workspace Settings',
                onClick: () => {
                  window.location.href = ROUTES.SETTINGS;
                },
              },
              {
                id: 'logout',
                label: 'Sign Out',
                destructive: true,
                onClick: () => {
                  window.location.href = ROUTES.AUTH.LOGIN;
                },
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
