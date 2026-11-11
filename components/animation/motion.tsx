'use client';

import React from 'react';
import { motion, type Variants, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * AXIS Architectural Motion Principles:
 * - Restrained easing curves mimicking mechanical precision & architectural drafting.
 * - Gentle transitions without cartoon bounce or exaggerated springs.
 */

export const architecturalEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
export const architecturalSnappy: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const defaultTransition: Transition = {
  duration: 0.32,
  ease: architecturalEase,
};

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: architecturalEase,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.25,
      ease: architecturalEase,
    },
  },
};

export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgba(48, 44, 38, 0.06)',
  },
  hover: {
    y: -2,
    boxShadow: '0 4px 12px -2px rgba(48, 44, 38, 0.08), 0 2px 6px -2px rgba(48, 44, 38, 0.04)',
    transition: {
      duration: 0.2,
      ease: architecturalSnappy,
    },
  },
};

export const architecturalLineVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: (customDuration: number = 0.8) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: customDuration, ease: architecturalEase },
      opacity: { duration: 0.2 },
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: architecturalEase,
    },
  },
};

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export function FadeIn({
  delay = 0,
  duration = 0.35,
  className,
  children,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: architecturalEase }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

export function ArchitecturalCadence({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
