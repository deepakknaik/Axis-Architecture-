/**
 * AXIS ARCHITECTURE — Architectural Analysis Data Contract
 * 
 * Re-exports the source-derived architectural dataset from the uploaded blueprint.
 * Synthetic demo fallback geometry has been deprecated and removed.
 * THE UPLOADED BLUEPRINT IS THE ONLY SOURCE OF GEOMETRIC TRUTH.
 */

export * from '@/lib/blueprint/real-blueprint-analysis';
export * from '@/lib/blueprint/dimension-resolver';
export * from '@/lib/blueprint/blueprints-catalog';
export * from '@/lib/blueprint/coordinate-transform';

import { buildRealBlueprintAnalysis } from '@/lib/blueprint/real-blueprint-analysis';

// Default analysis for initial workspace load matches the verified uploaded blueprint
export const DEFAULT_PROTOTYPE_ANALYSIS = buildRealBlueprintAnalysis('bp_bungalow_10x12');
