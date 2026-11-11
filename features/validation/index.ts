/**
 * Features: Human-in-the-Loop Validation Module
 * 
 * Verifies uncertain machine detections (walls, doors, room classifications)
 * before geometry generation.
 */

export * from '@/lib/types/architectural';

export function isVerificationComplete(unresolvedCount: number): boolean {
  return unresolvedCount === 0;
}
