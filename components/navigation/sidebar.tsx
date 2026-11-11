'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  ScanLine,
  Box,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  MoreVertical,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import { NavigationItem } from './navigation-item';
import { NavigationSection } from './navigation-section';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown } from '@/components/ui/dropdown';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export function Sidebar({ collapsed, onToggleCollapse, className }: SidebarProps) {
  const pathname = usePathname();

  // Active route matching
  const isDashboardActive = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isProjectsActive =
    (pathname === '/projects' || (pathname.startsWith('/projects/') && !pathname.includes('/blueprint') && !pathname.includes('/workspace')));
  const isBlueprintActive = pathname.includes('/blueprint');
  const isWorkspaceActive = pathname.includes('/workspace');
  const isAiActive = pathname === '/ai-assistant' || pathname.startsWith('/ai-assistant/');
  const isTemplatesActive = pathname === '/templates' || pathname.startsWith('/templates/');
  const isSettingsActive = pathname === '/settings' || pathname.startsWith('/settings/');
  const isHelpActive = pathname === '/help' || pathname.startsWith('/help/');

  return (
    <aside
      className={cn(
        'relative h-screen flex flex-col justify-between border-r border-axis-border bg-axis-bg-elevated/95 backdrop-blur-sm select-none transition-all duration-250 ease-out z-30',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        className
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP BRANDING & COLLAPSE TOGGLE */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 pb-3 border-b border-axis-border/80 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href={ROUTES.DASHBOARD}
              className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs shadow-axis-xs shrink-0 hover:bg-axis-accent transition-colors"
            >
              AX
            </Link>
            <div className="min-w-0 flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-axis-text-primary uppercase leading-tight truncate">
                AXIS ARCHITECTURE
              </span>
              <span className="text-[9px] font-mono tracking-widest text-axis-text-muted uppercase leading-none truncate mt-0.5">
                SPATIAL ENGINE · AX-01
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <Link
              href={ROUTES.DASHBOARD}
              className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs shadow-axis-xs hover:bg-axis-accent transition-colors"
              title="AXIS ARCHITECTURE"
            >
              AX
            </Link>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
          className={cn(
            'p-1.5 rounded-axis-xs text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent',
            collapsed && 'hidden' // When collapsed, expanded via header or hover
          )}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. NAVIGATION ITEMS (WORKSPACE & STUDIO) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-5">
        {/* WORKSPACE SECTION */}
        <NavigationSection title="WORKSPACE" collapsed={collapsed}>
          <NavigationItem
            href={ROUTES.DASHBOARD}
            label="Dashboard"
            icon={LayoutDashboard}
            active={isDashboardActive}
            collapsed={collapsed}
            datum="DSH-01"
          />
          <NavigationItem
            href={ROUTES.PROJECTS.LIST}
            label="Projects"
            icon={FolderKanban}
            active={isProjectsActive}
            collapsed={collapsed}
            badge="3"
            datum="PRJ-DIR"
          />
          <NavigationItem
            href={ROUTES.BLUEPRINT_ENGINE}
            label="Blueprint Engine"
            icon={ScanLine}
            active={isBlueprintActive}
            collapsed={collapsed}
            datum="CAD-2D"
          />
          <NavigationItem
            href={ROUTES.WORKSPACE_3D}
            label="3D Workspace"
            icon={Box}
            active={isWorkspaceActive}
            collapsed={collapsed}
            datum="R3F-3D"
          />
          <NavigationItem
            href={ROUTES.AI_ASSISTANT}
            label="AI Assistant"
            icon={Sparkles}
            active={isAiActive}
            collapsed={collapsed}
            badge="BETA"
            datum="AI-SPEC"
          />
        </NavigationSection>

        {/* SUBTLE ARCHITECTURAL DIVIDER */}
        <div className="px-2">
          <div className="w-full h-px bg-axis-border/70" />
        </div>

        {/* STUDIO SECTION */}
        <NavigationSection title="STUDIO" collapsed={collapsed}>
          <NavigationItem
            href={ROUTES.TEMPLATES}
            label="Templates"
            icon={Layers}
            active={isTemplatesActive}
            collapsed={collapsed}
            datum="TMPL"
          />
          <NavigationItem
            href={ROUTES.SETTINGS}
            label="Settings"
            icon={Settings}
            active={isSettingsActive}
            collapsed={collapsed}
            datum="CONF"
          />
          <NavigationItem
            href={ROUTES.HELP}
            label="Help & Docs"
            icon={HelpCircle}
            active={isHelpActive}
            collapsed={collapsed}
            datum="DOCS"
          />
        </NavigationSection>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. SIDEBAR FOOTER: USER ACCOUNT SECTION */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-3 border-t border-axis-border/80 bg-axis-bg-subtle/50">
        {!collapsed ? (
          <div className="flex items-center justify-between p-2 rounded-axis-xs bg-axis-surface/60 border border-axis-border/70 shadow-axis-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name="Deepak"
                size="sm"
                className="bg-axis-accent/15 text-axis-accent font-semibold border-axis-accent/30 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-axis-text-primary truncate">
                  Deepak
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-verified-dot" />
                  <p className="text-[10px] font-mono text-axis-text-muted truncate">
                    Lead Architect
                  </p>
                </div>
              </div>
            </div>

            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="User account menu"
                  className="p-1 rounded text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface transition-colors focus-visible:outline-none"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              }
              items={[
                {
                  id: 'profile',
                  label: 'Architect Profile',
                  icon: <User className="w-3.5 h-3.5" />,
                  onClick: () => {},
                },
                {
                  id: 'security',
                  label: 'Workspace Security',
                  icon: <ShieldCheck className="w-3.5 h-3.5" />,
                  onClick: () => {},
                },
                {
                  id: 'logout',
                  label: 'Sign Out',
                  icon: <LogOut className="w-3.5 h-3.5" />,
                  destructive: true,
                  onClick: () => {
                    window.location.href = ROUTES.AUTH.LOGIN;
                  },
                },
              ]}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Dropdown
              align="left"
              trigger={
                <button
                  type="button"
                  aria-label="Deepak — Lead Architect"
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent"
                >
                  <Avatar
                    name="Deepak"
                    size="sm"
                    className="bg-axis-accent/15 text-axis-accent font-semibold border-axis-accent/30"
                  />
                </button>
              }
              items={[
                {
                  id: 'profile',
                  label: 'Deepak (Lead Architect)',
                  icon: <User className="w-3.5 h-3.5" />,
                  onClick: () => {},
                },
                {
                  id: 'expand',
                  label: 'Expand Sidebar',
                  icon: <PanelLeftOpen className="w-3.5 h-3.5" />,
                  onClick: onToggleCollapse,
                },
                {
                  id: 'logout',
                  label: 'Sign Out',
                  icon: <LogOut className="w-3.5 h-3.5" />,
                  destructive: true,
                  onClick: () => {
                    window.location.href = ROUTES.AUTH.LOGIN;
                  },
                },
              ]}
            />
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="p-1 rounded text-axis-text-muted hover:text-axis-text-primary transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
