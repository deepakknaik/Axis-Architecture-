/**
 * Architectural PBR Material Customization System (Matching Reference Board: Material View)
 * Allows real-time switching of floor, wall, and roof architectural finishes.
 */

export type FloorMaterialKey = 'MARBLE' | 'OAK' | 'TERRAZZO' | 'CONCRETE';
export type WallMaterialKey = 'STUCCO' | 'BRICK' | 'EXPOSED_CONCRETE' | 'TIMBER_SLATS';
export type RoofMaterialKey = 'SLATE' | 'TERRACOTTA' | 'METAL_SEAM';
export type MaterialPresetKey = 'MODERN_MINIMAL' | 'WARM_MEDITERRANEAN' | 'URBAN_INDUSTRIAL';

export interface PBRMaterialSpec {
  id: string;
  name: string;
  description: string;
  color: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  previewColor: string;
  previewBorder: string;
  tag: string;
}

export interface MaterialCustomizationState {
  floor: FloorMaterialKey;
  wall: WallMaterialKey;
  roof: RoofMaterialKey;
}

export const DEFAULT_MATERIAL_CUSTOMIZATION: MaterialCustomizationState = {
  floor: 'MARBLE',
  wall: 'STUCCO',
  roof: 'SLATE',
};

// -----------------------------------------------------------------------------
// Floor Material Palette
// -----------------------------------------------------------------------------
export const FLOOR_MATERIALS: Record<FloorMaterialKey, PBRMaterialSpec> = {
  MARBLE: {
    id: 'MARBLE',
    name: 'Italian Calacatta Marble',
    description: 'Polished high-gloss marble tile with soft grey veining and specular reflection',
    color: '#F4EFE6',
    roughness: 0.16,
    metalness: 0.08,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    previewColor: 'from-[#F5F2EB] to-[#E5E0D5]',
    previewBorder: '#D8D1C3',
    tag: 'Luxury High-Gloss',
  },
  OAK: {
    id: 'OAK',
    name: 'Scandinavian Natural Oak',
    description: 'Warm brushed oak parquet flooring with subtle satin sheen',
    color: '#C8A27A',
    roughness: 0.42,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    previewColor: 'from-[#D4B28C] to-[#B88E62]',
    previewBorder: '#A67C52',
    tag: 'Warm Hardwood',
  },
  TERRAZZO: {
    id: 'TERRAZZO',
    name: 'Honed Quartz Terrazzo',
    description: 'Contemporary aggregate terrazzo stone with semi-matte honed surface',
    color: '#D9D5CC',
    roughness: 0.28,
    metalness: 0.06,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    previewColor: 'from-[#E2DED6] to-[#CAC5BC]',
    previewBorder: '#B5B0A6',
    tag: 'Contemporary Honed',
  },
  CONCRETE: {
    id: 'CONCRETE',
    name: 'Industrial Polished Concrete',
    description: 'Smooth burnished industrial concrete with ambient reflection',
    color: '#B2ACA2',
    roughness: 0.32,
    metalness: 0.05,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    previewColor: 'from-[#C4BFB6] to-[#9E988E]',
    previewBorder: '#8A847A',
    tag: 'Modern Industrial',
  },
};

// -----------------------------------------------------------------------------
// Wall Material Palette
// -----------------------------------------------------------------------------
export const WALL_MATERIALS: Record<WallMaterialKey, PBRMaterialSpec> = {
  STUCCO: {
    id: 'STUCCO',
    name: 'Crisp Off-White Stucco',
    description: 'Smooth mineral architectural plaster with fine grain texture',
    color: '#F6F4EE',
    roughness: 0.82,
    metalness: 0.02,
    previewColor: 'from-[#FAF8F3] to-[#EBE7DF]',
    previewBorder: '#D5D0C6',
    tag: 'Architectural White',
  },
  BRICK: {
    id: 'BRICK',
    name: 'Warm Red Architectural Brick',
    description: 'Kiln-fired rustic red brick with textured mortar joints',
    color: '#9C4B3A',
    roughness: 0.88,
    metalness: 0.02,
    previewColor: 'from-[#B35845] to-[#853C2D]',
    previewBorder: '#703023',
    tag: 'Rustic Masonry',
  },
  EXPOSED_CONCRETE: {
    id: 'EXPOSED_CONCRETE',
    name: 'Raw Architectural Concrete',
    description: 'Form-finished board-marked architectural concrete with subtle tie-rod texture',
    color: '#A8A49D',
    roughness: 0.76,
    metalness: 0.04,
    previewColor: 'from-[#B8B4AE] to-[#949089]',
    previewBorder: '#7D7A73',
    tag: 'Board-Formed Brutalist',
  },
  TIMBER_SLATS: {
    id: 'TIMBER_SLATS',
    name: 'Vertical Walnut Slats',
    description: 'Warm vertical architectural timber rainscreen siding',
    color: '#7A4B29',
    roughness: 0.4,
    metalness: 0.05,
    previewColor: 'from-[#8F5B34] to-[#653A1D]',
    previewBorder: '#522E15',
    tag: 'Warm Timber Siding',
  },
};

// -----------------------------------------------------------------------------
// Roof Material Palette
// -----------------------------------------------------------------------------
export const ROOF_MATERIALS: Record<RoofMaterialKey, PBRMaterialSpec> = {
  SLATE: {
    id: 'SLATE',
    name: 'Charcoal Modern Slate',
    description: 'Natural split dark grey slate tiles with satin water sheen',
    color: '#282D36',
    roughness: 0.65,
    metalness: 0.18,
    previewColor: 'from-[#353C47] to-[#1E2229]',
    previewBorder: '#181A20',
    tag: 'Contemporary Charcoal',
  },
  TERRACOTTA: {
    id: 'TERRACOTTA',
    name: 'Warm Mediterranean Clay',
    description: 'Spanish barrel clay terracotta roof tile with sun-baked patina',
    color: '#B8532F',
    roughness: 0.78,
    metalness: 0.04,
    previewColor: 'from-[#CA6038] to-[#9E4222]',
    previewBorder: '#803419',
    tag: 'Mediterranean Clay',
  },
  METAL_SEAM: {
    id: 'METAL_SEAM',
    name: 'Standing Seam Anthracite Zinc',
    description: 'Modern pre-patinated architectural zinc metal roofing',
    color: '#1C2026',
    roughness: 0.32,
    metalness: 0.75,
    previewColor: 'from-[#2A303A] to-[#12151A]',
    previewBorder: '#0F1217',
    tag: 'Modern Architectural Metal',
  },
};

// -----------------------------------------------------------------------------
// 1-Click Aesthetic Presets
// -----------------------------------------------------------------------------
export const MATERIAL_PRESETS: Record<
  MaterialPresetKey,
  { name: string; description: string; state: MaterialCustomizationState }
> = {
  MODERN_MINIMAL: {
    name: 'Modern Minimalist',
    description: 'Crisp stucco walls, warm Scandinavian oak parquet, and charcoal slate roof',
    state: {
      floor: 'OAK',
      wall: 'STUCCO',
      roof: 'SLATE',
    },
  },
  WARM_MEDITERRANEAN: {
    name: 'Warm Mediterranean',
    description: 'Cream stucco walls, Italian Calacatta marble, and terracotta clay roof',
    state: {
      floor: 'MARBLE',
      wall: 'STUCCO',
      roof: 'TERRACOTTA',
    },
  },
  URBAN_INDUSTRIAL: {
    name: 'Urban Industrial',
    description: 'Raw exposed concrete walls, polished industrial concrete floors, and zinc metal roof',
    state: {
      floor: 'CONCRETE',
      wall: 'EXPOSED_CONCRETE',
      roof: 'METAL_SEAM',
    },
  },
};
