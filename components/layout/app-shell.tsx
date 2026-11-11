'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthenticatedHeader } from '@/components/layout/authenticated-header';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNavigation } from '@/components/navigation/mobile-navigation';
import { isAuthenticatedRoute } from '@/lib/constants/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1. Sidebar Collapse State (Desktop)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // 2. Mobile Drawer Open State (<768px)
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // Check route classification
  const isAuthPage = pathname === '/login' || pathname.startsWith('/login/');
  const isAppRoute = isAuthenticatedRoute(pathname);

  // ---------------------------------------------------------------------------
  // Case A: Standalone Authentication Route (/login) — Part 02 Locked
  // ---------------------------------------------------------------------------
  if (isAuthPage) {
    return <main className="min-h-screen w-full flex flex-col">{children}</main>;
  }

  // ---------------------------------------------------------------------------
  // Case B: Authenticated Application Shell (/dashboard, /projects, etc.) — Part 03
  // ---------------------------------------------------------------------------
  if (isAppRoute) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-axis-bg text-axis-text-primary">
        {/* Mobile Navigation Drawer & Hamburger Trigger (Hidden on md+) */}
        <MobileNavigation
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          onOpen={() => setMobileDrawerOpen(true)}
        />

        <div className="flex-1 flex w-full">
          {/* Desktop Persistent Sidebar (Hidden on <md) */}
          <div className="hidden md:block shrink-0">
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* Main Workstation Canvas */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <AuthenticatedHeader
              collapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className="flex-1 flex flex-col w-full relative">{children}</main>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Case C: Public System Showcase Route (/) — Part 01 Locked
  // ---------------------------------------------------------------------------
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
