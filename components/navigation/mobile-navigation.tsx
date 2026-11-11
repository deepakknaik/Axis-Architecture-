'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  FolderKanban,
  ScanLine,
  Box,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
  Compass,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { ROUTES } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function MobileNavigation({ isOpen, onClose, onOpen }: MobileNavigationProps) {
  const pathname = usePathname();

  // Close drawer on path change
  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navItems = [
    { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Projects', href: ROUTES.PROJECTS.LIST, icon: FolderKanban },
    { label: 'Blueprint Engine', href: ROUTES.BLUEPRINT_ENGINE, icon: ScanLine },
    { label: '3D Workspace', href: ROUTES.WORKSPACE_3D, icon: Box },
    { label: 'AI Assistant', href: ROUTES.AI_ASSISTANT, icon: Sparkles },
    { label: 'Templates', href: ROUTES.TEMPLATES, icon: Layers },
    { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
    { label: 'Help & Docs', href: ROUTES.HELP, icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Top Bar (visible on < md screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-axis-border bg-axis-bg/95 backdrop-blur-md px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open navigation drawer"
            className="p-2 -ml-2 rounded-axis-xs text-axis-text-primary hover:bg-axis-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs">
              AX
            </div>
            <span className="text-xs font-semibold tracking-wider text-axis-text-primary uppercase">
              AXIS ARCHITECTURE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-axis-text-muted uppercase border border-axis-border px-1.5 py-0.5 rounded">
            REF / AX-01
          </span>
          <Avatar name="Deepak" size="sm" className="bg-axis-accent/15 text-axis-accent" />
        </div>
      </div>

      {/* Slide-over Drawer Backdrop & Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#252525]/40 backdrop-blur-[2px]"
            />

            {/* Slide-over Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-4/5 max-w-xs h-full bg-axis-bg-elevated border-r border-axis-border shadow-axis-elevated flex flex-col justify-between"
            >
              <div>
                {/* Header inside drawer */}
                <div className="p-4 border-b border-axis-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs">
                      AX
                    </div>
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-axis-text-primary uppercase">
                        AXIS ARCHITECTURE
                      </div>
                      <div className="text-[9px] font-mono text-axis-text-muted uppercase">
                        SPATIAL ENGINE
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close navigation drawer"
                    className="p-2 rounded text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-3 space-y-1 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-axis-text-muted uppercase font-semibold">
                    MAIN NAVIGATION
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-axis-xs text-sm font-medium transition-colors min-h-[44px]',
                          isActive
                            ? 'bg-axis-accent/10 text-axis-accent font-semibold border-l-2 border-axis-accent'
                            : 'text-axis-text-secondary hover:text-axis-text-primary hover:bg-axis-surface/60'
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-axis-border bg-axis-bg-subtle space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name="Deepak" size="sm" className="bg-axis-accent/15 text-axis-accent" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-axis-text-primary truncate">Deepak</p>
                    <p className="text-[10px] font-mono text-axis-text-muted">Lead Architect</p>
                  </div>
                </div>
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-axis-xs text-xs font-medium text-status-failed-text bg-status-failed-bg border border-status-failed-border hover:bg-red-100 transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
