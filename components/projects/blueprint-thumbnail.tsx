'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BlueprintThumbnailProps {
  variant?: 'villa' | 'tower' | 'studio' | 'urban' | 'coastal' | 'office' | 'default';
  className?: string;
  codeName?: string;
}

export function BlueprintThumbnail({
  variant = 'villa',
  className,
  codeName,
}: BlueprintThumbnailProps) {
  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] bg-axis-surface/60 overflow-hidden rounded-t-axis-md border-b border-axis-border select-none flex items-center justify-center',
        className
      )}
    >
      {/* Background CAD millimeter grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #DDD8CE 1px, transparent 1px),
            linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Subtle CAD Crosshair in corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-axis-border-strong opacity-40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-axis-border-strong opacity-40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-axis-border-strong opacity-40" />

      {/* Center Stylized Floor Plan SVG based on variant */}
      <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
        {variant === 'office' ? (
          /* Office Hub / Tower: Grid columns, elevator core, curtain wall */
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <rect x="25" y="15" width="150" height="90" stroke="#252525" strokeWidth="2" fill="#FAF7F2" />
            <rect x="75" y="40" width="50" height="40" stroke="#252525" strokeWidth="1.8" fill="#EEEAE2" />
            <line x1="100" y1="40" x2="100" y2="80" stroke="#6F6B63" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="88" cy="52" r="2" fill="#B85D36" />
            <circle cx="112" cy="52" r="2" fill="#B85D36" />
            {/* Perimeter grid points */}
            <circle cx="40" cy="30" r="1.5" fill="#252525" />
            <circle cx="40" cy="60" r="1.5" fill="#252525" />
            <circle cx="40" cy="90" r="1.5" fill="#252525" />
            <circle cx="160" cy="30" r="1.5" fill="#252525" />
            <circle cx="160" cy="60" r="1.5" fill="#252525" />
            <circle cx="160" cy="90" r="1.5" fill="#252525" />
            {/* Dimension guide */}
            <line x1="25" y1="8" x2="175" y2="8" stroke="#8E8980" strokeWidth="0.8" />
            <line x1="25" y1="5" x2="25" y2="11" stroke="#B85D36" strokeWidth="1" />
            <line x1="175" y1="5" x2="175" y2="11" stroke="#B85D36" strokeWidth="1" />
          </svg>
        ) : variant === 'studio' ? (
          /* Studio / Atelier: L-shaped space, opening arcs */
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <path
              d="M 30 20 L 170 20 L 170 100 L 110 100 L 110 65 L 30 65 Z"
              stroke="#252525"
              strokeWidth="2"
              fill="#FAF7F2"
            />
            <line x1="110" y1="20" x2="110" y2="65" stroke="#6F6B63" strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Door arc */}
            <path d="M 60 65 A 20 20 0 0 1 40 45" stroke="#B85D36" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="60" y1="65" x2="40" y2="65" stroke="#252525" strokeWidth="1.2" />
            {/* Window slots */}
            <line x1="60" y1="20" x2="100" y2="20" stroke="#3978B5" strokeWidth="2.5" />
            <line x1="130" y1="20" x2="160" y2="20" stroke="#3978B5" strokeWidth="2.5" />
          </svg>
        ) : variant === 'urban' ? (
          /* Urban Townhouse: Longitudinal layout with lightwell */
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <rect x="40" y="15" width="120" height="90" stroke="#252525" strokeWidth="2" fill="#FAF7F2" />
            <rect x="80" y="45" width="40" height="30" stroke="#8F6E4A" strokeWidth="1.2" strokeDasharray="3 3" fill="#F0ECE4" />
            <line x1="40" y1="45" x2="80" y2="45" stroke="#6F6B63" strokeWidth="1.2" />
            <line x1="120" y1="75" x2="160" y2="75" stroke="#6F6B63" strokeWidth="1.2" />
            {/* Stair indicator */}
            <rect x="48" y="52" width="24" height="16" stroke="#252525" strokeWidth="0.8" fill="#EEEAE2" />
            <line x1="54" y1="52" x2="54" y2="68" stroke="#6F6B63" strokeWidth="0.8" />
            <line x1="60" y1="52" x2="60" y2="68" stroke="#6F6B63" strokeWidth="0.8" />
            <line x1="66" y1="52" x2="66" y2="68" stroke="#6F6B63" strokeWidth="0.8" />
          </svg>
        ) : variant === 'coastal' ? (
          /* Coastal Pavilion: Open veranda, perimeter colonnade */
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <rect x="30" y="20" width="140" height="80" stroke="#DDD8CE" strokeWidth="1.2" strokeDasharray="3 3" />
            <rect x="50" y="32" width="100" height="56" stroke="#252525" strokeWidth="2" fill="#FAF7F2" />
            <line x1="90" y1="32" x2="90" y2="88" stroke="#6F6B63" strokeWidth="1.2" />
            {/* Columns */}
            <rect x="30" y="20" width="4" height="4" fill="#B85D36" />
            <rect x="98" y="20" width="4" height="4" fill="#B85D36" />
            <rect x="166" y="20" width="4" height="4" fill="#B85D36" />
            <rect x="30" y="96" width="4" height="4" fill="#B85D36" />
            <rect x="98" y="96" width="4" height="4" fill="#B85D36" />
            <rect x="166" y="96" width="4" height="4" fill="#B85D36" />
          </svg>
        ) : (
          /* Default / Villa North / Residence 01: Multi-chamber pavilion */
          <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
            <rect x="35" y="18" width="130" height="84" stroke="#252525" strokeWidth="2" fill="#FAF7F2" />
            <line x1="95" y1="18" x2="95" y2="65" stroke="#6F6B63" strokeWidth="1.5" />
            <line x1="35" y1="65" x2="165" y2="65" stroke="#6F6B63" strokeWidth="1.5" />
            {/* Door swing arc */}
            <path d="M 95 38 A 18 18 0 0 1 77 20" stroke="#B85D36" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="95" y1="38" x2="77" y2="38" stroke="#252525" strokeWidth="1.2" />
            {/* Window ribbons */}
            <line x1="50" y1="18" x2="80" y2="18" stroke="#3978B5" strokeWidth="2.5" />
            <line x1="115" y1="18" x2="150" y2="18" stroke="#3978B5" strokeWidth="2.5" />
            <line x1="60" y1="102" x2="140" y2="102" stroke="#3978B5" strokeWidth="2.5" />
          </svg>
        )}
      </div>

      {/* Technical Code Stamp Watermark in bottom corner */}
      {codeName && (
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-axis-bg-elevated/90 border border-axis-border text-[9px] font-mono text-axis-text-muted select-none">
          {codeName}
        </div>
      )}
    </div>
  );
}
