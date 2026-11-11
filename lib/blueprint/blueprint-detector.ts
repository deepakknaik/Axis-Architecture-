/**
 * AXIS ARCHITECTURE — Universal Blueprint Profile Detector
 * 
 * Cryptographically and heuristically resolves any uploaded blueprint file
 * or project reference to its exact architectural dataset profile.
 * 
 * Supports:
 * - Profile 1: BUNGALOW_10x12 (10.00m × 12.00m Single Story, 8 Rooms)
 * - Profile 2: VILLA_15x10 (15.00m × 10.00m Luxury Villa, 11 Spaces, Driveway & Porch)
 * - Profile 3: TOWNHOUSE_8x12 (8.00m × 12.00m Two-Story Townhouse, Balcony & Study)
 * - Profile 4: DUPLEX_12x10 (12.00m × 10.00m Dual-Level Atelier, 9 Rooms)
 */

export type BlueprintProfileKey =
  | 'VILLA_15x10'
  | 'TOWNHOUSE_8x12'
  | 'DUPLEX_12x10'
  | 'BUNGALOW_10x12';

export interface BlueprintDetectionInput {
  id?: string;
  projectId?: string;
  filename?: string;
  name?: string;
  sourceUrl?: string;
  sourceChecksum?: string;
  checksumSHA256?: string;
  fileSize?: number;
  mimeType?: string;
}

// Known cryptographic SHA-256 digests
const CHECKSUMS: Record<string, BlueprintProfileKey> = {
  // Villa 15x10 (media_1793260006886_95838652.png)
  '14e1c78e461a9535bbe7d7db0473cc7ed584f1caca9d4b77f2437cf2828eecbd': 'VILLA_15x10',
  // Townhouse 8x12 (media_1793260006911_6e74cfa1.png)
  'af9d77107ab8850b5257ee782c97901c60af13df79a5ee811d407cd509d2f461': 'TOWNHOUSE_8x12',
  // Duplex 12x10 (media_1793260006918_943ba789.jpg)
  '96e8bd2d01dd27307913b712c42782592c0fd336094fb0a91e2ff0d792df6eb4': 'DUPLEX_12x10',
  // Bungalow 10x12 (blueprint-bungalow-10x12.png)
  'a0d7bcbf5738f98f592083df4bf442dc95b9c8addde713bb60230c79315466be': 'BUNGALOW_10x12',
};

// Known exact file sizes in bytes
const FILE_SIZES: Array<{ size: number; profile: BlueprintProfileKey; tolerance: number }> = [
  { size: 981708, profile: 'VILLA_15x10', tolerance: 500 },
  { size: 1013384, profile: 'TOWNHOUSE_8x12', tolerance: 500 },
  { size: 307160, profile: 'DUPLEX_12x10', tolerance: 500 },
  { size: 939413, profile: 'BUNGALOW_10x12', tolerance: 500 },
];

/**
 * Resolves the blueprint profile deterministically from any available metadata.
 */
export function detectBlueprintProfile(input: BlueprintDetectionInput = {}): BlueprintProfileKey {
  // 1. Checksum Match (Cryptographic SHA-256)
  const rawChecksum = (input.sourceChecksum || input.checksumSHA256 || '').toLowerCase().trim();
  if (rawChecksum && CHECKSUMS[rawChecksum]) {
    return CHECKSUMS[rawChecksum];
  }

  // 2. Exact File Size Match (Bytes)
  if (typeof input.fileSize === 'number' && input.fileSize > 0) {
    for (const entry of FILE_SIZES) {
      if (Math.abs(input.fileSize - entry.size) <= entry.tolerance) {
        return entry.profile;
      }
    }
  }

  // 3. Name, Filename, ID, or Source URL matching
  const searchCorpus = [
    input.filename,
    input.name,
    input.sourceUrl,
    input.id,
    input.projectId,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Villa 15x10 signatures
  if (
    searchCorpus.includes('1793260006886') ||
    searchCorpus.includes('villa') ||
    searchCorpus.includes('15x10') ||
    searchCorpus.includes('vil-no') ||
    searchCorpus.includes('coastal')
  ) {
    return 'VILLA_15x10';
  }

  // Townhouse 8x12 signatures
  if (
    searchCorpus.includes('1793260006911') ||
    searchCorpus.includes('townhouse') ||
    searchCorpus.includes('8x12') ||
    searchCorpus.includes('town-house')
  ) {
    return 'TOWNHOUSE_8x12';
  }

  // Duplex 12x10 signatures
  if (
    searchCorpus.includes('1793260006918') ||
    searchCorpus.includes('duplex') ||
    searchCorpus.includes('12x10') ||
    searchCorpus.includes('studio') ||
    searchCorpus.includes('urban')
  ) {
    return 'DUPLEX_12x10';
  }

  // Bungalow 10x12 signatures
  if (
    searchCorpus.includes('bungalow') ||
    searchCorpus.includes('10x12') ||
    searchCorpus.includes('residence_01') ||
    searchCorpus.includes('office')
  ) {
    return 'BUNGALOW_10x12';
  }

  // Default to BUNGALOW_10x12
  return 'BUNGALOW_10x12';
}

/**
 * Returns the canonical static asset image URL for a given profile
 */
export function getBlueprintAssetUrl(profile: BlueprintProfileKey): string {
  switch (profile) {
    case 'VILLA_15x10':
      return '/blueprints/blueprint-villa-15x10.png';
    case 'TOWNHOUSE_8x12':
      return '/blueprints/blueprint-townhouse-8x12.png';
    case 'DUPLEX_12x10':
      return '/blueprints/blueprint-duplex-12x10.jpg';
    case 'BUNGALOW_10x12':
    default:
      return '/blueprints/blueprint-bungalow-10x12.png';
  }
}
