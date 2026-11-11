import * as React from 'react';
import Link from 'next/link';
import { Compass, Box } from 'lucide-react';
import { ROUTES } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  currentProjectTitle?: string;
  className?: string;
}

export function Header({ currentProjectTitle, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-axis-border bg-axis-bg/90 backdrop-blur-md transition-colors',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent rounded-axis-xs"
          >
            <div className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-sm shadow-axis-xs group-hover:bg-axis-accent transition-colors">
              <span className="tracking-tighter">AX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wider text-axis-text-primary uppercase leading-tight">
                AXIS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-axis-text-muted uppercase leading-none">
                ARCHITECTURE
              </span>
            </div>
          </Link>

          {currentProjectTitle && (
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-axis-border text-xs text-axis-text-secondary">
              <Compass className="w-3.5 h-3.5 text-axis-accent" />
              <span className="font-medium text-axis-text-primary truncate max-w-[200px]">
                {currentProjectTitle}
              </span>
            </div>
          )}
        </div>

        {/* Global Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href={ROUTES.HOME}
            className="px-3 py-1.5 text-xs font-medium text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60 rounded-axis-xs transition-colors"
          >
            Overview
          </Link>
          <Link
            href={ROUTES.PROJECTS.LIST}
            className="px-3 py-1.5 text-xs font-medium text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60 rounded-axis-xs transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/#design-system"
            className="px-3 py-1.5 text-xs font-medium text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60 rounded-axis-xs transition-colors"
          >
            Design System
          </Link>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="px-3 py-1.5 text-xs font-medium text-axis-text-primary bg-axis-surface hover:bg-axis-surface-hover border border-axis-border rounded-axis-xs transition-colors shadow-axis-xs"
          >
            Sign In
          </Link>
          <div className="h-4 w-px bg-axis-border mx-1 hidden sm:block" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-axis-border bg-axis-surface/60 font-mono text-[10px] text-axis-text-muted select-none">
            <Box className="w-3 h-3 text-axis-accent" />
            <span>PART 02 · AUTH</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
