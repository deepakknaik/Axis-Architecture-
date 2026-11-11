import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { ArchitecturalBlueprintVisual } from '@/components/auth/architectural-blueprint-visual';
import { LoginForm } from '@/components/auth/login-form';
import { ROUTES } from '@/lib/constants/navigation';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-axis-bg overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* LEFT / VISUAL SIDE (~58% on desktop)                                */}
      {/* 2D Blueprint -> Architectural Analysis -> Spatial Geometry -> 3D    */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-[58%] min-h-[380px] lg:min-h-screen flex flex-col">
        <ArchitecturalBlueprintVisual />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT / AUTHENTICATION SIDE (~42% on desktop)                       */}
      {/* Clean, premium authentication panel with strict architectural tokens */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full lg:w-[42%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-axis-bg-elevated relative z-10 shadow-axis-sm">
        {/* Top return link & system breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-2">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs text-axis-text-secondary hover:text-axis-text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent rounded px-1.5 py-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-axis-text-muted" />
            <span>Return to Overview</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-axis-text-muted uppercase">
            <Compass className="w-3 h-3 text-axis-accent" />
            <span>PORTAL REF: AUTH-V1</span>
          </div>
        </div>

        {/* Center: The Login Form */}
        <div className="my-auto py-4">
          <LoginForm />
        </div>

        {/* Bottom: Technical Legal & Security Notice */}
        <div className="pt-8 border-t border-axis-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-axis-text-muted gap-2 select-none">
          <span>AXIS ARCHITECTURE © 2026</span>
          <div className="flex items-center gap-3">
            <span className="hover:text-axis-text-secondary cursor-pointer">Security Protocol</span>
            <span>·</span>
            <span className="hover:text-axis-text-secondary cursor-pointer">Privacy Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
