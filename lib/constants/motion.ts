/**
 * AXIS ARCHITECTURE — Centralized Motion System (Part 11)
 * 
 * Reusable animation tokens and Framer Motion variants.
 * Follows strict architectural polish principles:
 * - Subtle, precise, calm, professional (180ms–320ms default)
 * - Communicates hierarchy and system state
 * - Respects prefers-reduced-motion
 * - Avoids bounce, overshoot, and gaming UI effects
 */

import { Variants, Transition } from 'framer-motion';

export const MOTION_DURATIONS = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.24,
  medium: 0.32,
  slow: 0.45,
} as const;

export const MOTION_EASINGS = {
  // Architectural precision curve: fast entry, controlled calm settle
  architectural: [0.16, 1, 0.3, 1] as const,
  decelerate: [0.16, 1, 0.3, 1] as const,
  // Balanced transition for general page/modal elements
  calm: [0.25, 0.1, 0.25, 1] as const,
  // Snappy response for buttons and toggles
  sharp: [0.4, 0, 0.2, 1] as const,
};

export const defaultTransition: Transition = {
  duration: MOTION_DURATIONS.normal,
  ease: MOTION_EASINGS.architectural,
};

// 1. Subtle Page & Panel Fade In
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.calm },
  },
};

// 2. Controlled Vertical Rise (6px displacement)
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.calm },
  },
};

// 3. Subtle Scale Transition for Modals / Cards
export const fadeScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: MOTION_DURATIONS.fast, ease: MOTION_EASINGS.calm },
  },
};

// 4. Stagger Container for Grids and Lists
export const staggerContainerVariants = (staggerChildren = 0.04, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// 5. Drawer Slide in from Right
export const drawerSlideRightVariants: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.medium,
      ease: MOTION_EASINGS.architectural,
    },
  },
  exit: {
    x: '100%',
    opacity: 0.8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.calm,
    },
  },
};

// 6. Micro-Hover States for Architectural Cards
export const cardHoverTransition: Transition = {
  duration: MOTION_DURATIONS.fast,
  ease: MOTION_EASINGS.architectural,
};
