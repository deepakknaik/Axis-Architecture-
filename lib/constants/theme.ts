/**
 * AXIS ARCHITECTURE — Centralized Design Tokens
 * 
 * Strict architectural warm neutral palette, geometric typography scales,
 * subtle architectural lighting shadows, and dimensional standards.
 */

export const AXIS_TOKENS = {
  brand: {
    name: 'AXIS ARCHITECTURE',
    shortName: 'AXIS',
    tagline: 'Spatial Intelligence & Blueprint Reconstruction',
    version: '1.0.0-alpha',
  },
  colors: {
    // Architectural Neutrals (Warm Stone / Ivory / Charcoal)
    background: {
      primary: '#F8F6F1', // Primary Ivory
      subtle: '#F5F2EC',  // Off-white canvas
      canvas: '#F0ECE4',  // Section tone
      elevated: '#FCFAF7',// Top-level surface
    },
    surface: {
      default: '#EEEAE2',
      hover: '#E8E3DA',
      active: '#E2DDD3',
      sunk: '#E4DFD5',
    },
    border: {
      default: '#DDD8CE',
      subtle: '#E7E3DA',
      strong: '#C5BFB2',
      focus: '#B85D36',
    },
    text: {
      primary: '#252525',   // Charcoal
      secondary: '#6F6B63', // Warm slate
      muted: '#8E8980',     // Subtle annotation gray
      inverted: '#F8F6F1',
    },
    accent: {
      terracotta: '#B85D36',
      terracottaHover: '#A34F2B',
      terracottaSubtle: '#F6EFEB',
      bronze: '#8F6E4A',
      bronzeSubtle: '#F3ECE3',
      sand: '#D5CABB',
    },
  },
  typography: {
    scales: {
      display: 'text-4xl md:text-5xl font-medium tracking-tight text-axis-text-primary leading-[1.15]',
      h1: 'text-3xl md:text-4xl font-medium tracking-tight text-axis-text-primary leading-tight',
      h2: 'text-2xl md:text-3xl font-medium tracking-tight text-axis-text-primary leading-snug',
      h3: 'text-lg md:text-xl font-medium tracking-normal text-axis-text-primary',
      body: 'text-sm md:text-base font-normal text-axis-text-secondary leading-relaxed',
      small: 'text-sm font-normal text-axis-text-secondary leading-normal',
      caption: 'text-xs font-normal text-axis-text-muted uppercase tracking-wider',
      label: 'text-xs font-medium text-axis-text-primary uppercase tracking-wider',
      code: 'font-mono text-xs tracking-tight',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radius: {
    control: '6px',
    card: '8px',
    panel: '10px',
    modal: '12px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 3px 0 rgba(48, 44, 38, 0.06)',
    medium: '0 4px 12px -2px rgba(48, 44, 38, 0.07), 0 2px 6px -2px rgba(48, 44, 38, 0.04)',
    elevated: '0 12px 24px -4px rgba(48, 44, 38, 0.08), 0 4px 8px -3px rgba(48, 44, 38, 0.04)',
  },
  architecturalStandards: {
    defaultFloorHeightMeters: 3.0,
    defaultExteriorWallThicknessMeters: 0.30,
    defaultInteriorWallThicknessMeters: 0.15,
    defaultDoorWidthMeters: 0.90,
    defaultDoorHeightMeters: 2.10,
    defaultWindowSillMeters: 0.90,
    defaultWindowHeightMeters: 1.40,
  },
} as const;
