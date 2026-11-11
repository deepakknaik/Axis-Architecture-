'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUpVariants, defaultTransition } from '@/lib/constants/motion';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  gridSize?: number;
  withGrid?: boolean;
  maxWidth?: 'default' | 'full' | 'narrow';
}

export function PageContainer({
  children,
  className,
  gridSize = 32,
  withGrid = true,
  maxWidth = 'default',
}: PageContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full bg-axis-bg overflow-x-hidden">
      {/* Subtle Architectural Drafting Grid */}
      {withGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, #DDD8CE 1px, transparent 1px),
              linear-gradient(to bottom, #DDD8CE 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}

      {/* Subtle Corner Crosshairs */}
      <div className="pointer-events-none absolute top-4 left-4 w-2.5 h-2.5 border-t border-l border-axis-border-strong opacity-40" />
      <div className="pointer-events-none absolute top-4 right-4 w-2.5 h-2.5 border-t border-r border-axis-border-strong opacity-40" />

      {/* Animated Content Transition Container */}
      <motion.div
        variants={fadeUpVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        transition={defaultTransition}
        className={cn(
          'relative z-10 w-full p-4 sm:p-6 lg:p-8',
          maxWidth === 'default' && 'max-w-7xl mx-auto',
          maxWidth === 'narrow' && 'max-w-5xl mx-auto',
          maxWidth === 'full' && 'max-w-none',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}
