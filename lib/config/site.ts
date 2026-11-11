/**
 * AXIS ARCHITECTURE — Platform Configuration
 */

export const siteConfig = {
  name: 'AXIS ARCHITECTURE',
  shortName: 'AXIS',
  description:
    'High-precision architectural blueprint analysis and 3D spatial reconstruction technology platform.',
  version: '1.0.0-alpha',
  author: 'AXIS Engineering Team',
  links: {
    docs: '/docs',
    support: '/support',
  },
  limits: {
    maxBlueprintUploadSizeBytes: 50 * 1024 * 1024, // 50MB
    supportedBlueprintFormats: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'image/svg+xml'],
    defaultFloorHeightMeters: 3.0,
    defaultWallThicknessMeters: 0.20,
  },
} as const;

export type SiteConfig = typeof siteConfig;
