/**
 * Features: Blueprint Module
 * 
 * Handles blueprint asset ingestion, image preprocessing, scale calibration,
 * and coordinate translation between raster pixels and real-world meters.
 */

export interface ScaleCalibrationParams {
  pointA: { x: number; y: number };
  pointB: { x: number; y: number };
  knownRealWorldMeters: number;
}

/**
 * Calculates pixels per meter based on two calibrated reference points
 */
export function calculatePixelsPerMeter(params: ScaleCalibrationParams): number {
  const dx = params.pointB.x - params.pointA.x;
  const dy = params.pointB.y - params.pointA.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  if (params.knownRealWorldMeters <= 0) return 0;
  return pixelDistance / params.knownRealWorldMeters;
}
