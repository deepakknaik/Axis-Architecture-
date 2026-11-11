/**
 * AXIS ARCHITECTURE — Single Canvas Transform & Coordinate Utilities
 * 
 * Preserves a unified transform across:
 * - source image
 * - walls
 * - doors
 * - windows
 * - rooms
 * - stairs
 * - columns
 * - measurement annotations
 * - selection handles
 * - review markers
 */

import { SourcePoint, SourceBoundingBox } from '@/lib/types/architectural';

export interface CanvasTransform {
  pan: { x: number; y: number };
  zoom: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

/**
 * Transforms source/world image coordinates (0..W, 0..H) to client screen/container coordinates
 */
export function worldToScreen(
  point: SourcePoint,
  transform: CanvasTransform,
  containerRect?: { left: number; top: number; width: number; height: number }
): { x: number; y: number } {
  const { pan, zoom, viewBoxWidth, viewBoxHeight } = transform;
  
  // If container rect provided, calculate based on center-origin alignment
  if (containerRect) {
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const normX = point.x - viewBoxWidth / 2;
    const normY = point.y - viewBoxHeight / 2;
    return {
      x: centerX + pan.x + normX * zoom,
      y: centerY + pan.y + normY * zoom,
    };
  }

  // Relative to SVG viewport
  return {
    x: (point.x * zoom) + pan.x,
    y: (point.y * zoom) + pan.y,
  };
}

/**
 * Transforms client screen/container coordinates to source/world image coordinates
 */
export function screenToWorld(
  screenPoint: { x: number; y: number },
  transform: CanvasTransform,
  containerRect?: { left: number; top: number; width: number; height: number }
): SourcePoint {
  const { pan, zoom, viewBoxWidth, viewBoxHeight } = transform;

  if (containerRect) {
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const deltaX = (screenPoint.x - centerX - pan.x) / zoom;
    const deltaY = (screenPoint.y - centerY - pan.y) / zoom;
    return {
      x: Math.round(viewBoxWidth / 2 + deltaX),
      y: Math.round(viewBoxHeight / 2 + deltaY),
      xNormalized: (viewBoxWidth / 2 + deltaX) / viewBoxWidth,
      yNormalized: (viewBoxHeight / 2 + deltaY) / viewBoxHeight,
    };
  }

  return {
    x: Math.round((screenPoint.x - pan.x) / zoom),
    y: Math.round((screenPoint.y - pan.y) / zoom),
    xNormalized: (screenPoint.x - pan.x) / (zoom * viewBoxWidth),
    yNormalized: (screenPoint.y - pan.y) / (zoom * viewBoxHeight),
  };
}

/**
 * Normalizes absolute source coordinates (0..1)
 */
export function toNormalized(
  point: { x: number; y: number },
  sourceWidth: number,
  sourceHeight: number
): { xNormalized: number; yNormalized: number } {
  return {
    xNormalized: sourceWidth > 0 ? point.x / sourceWidth : 0,
    yNormalized: sourceHeight > 0 ? point.y / sourceHeight : 0,
  };
}

/**
 * Denormalizes coordinates from (0..1) to source pixels
 */
export function fromNormalized(
  norm: { xNormalized: number; yNormalized: number },
  sourceWidth: number,
  sourceHeight: number
): SourcePoint {
  return {
    x: Math.round(norm.xNormalized * sourceWidth),
    y: Math.round(norm.yNormalized * sourceHeight),
    xNormalized: norm.xNormalized,
    yNormalized: norm.yNormalized,
  };
}

/**
 * Computes a normalized bounding box
 */
export function normalizeBoundingBox(
  box: { x: number; y: number; width: number; height: number },
  sourceWidth: number,
  sourceHeight: number
): SourceBoundingBox {
  return {
    ...box,
    normalized: {
      x: box.x / sourceWidth,
      y: box.y / sourceHeight,
      width: box.width / sourceWidth,
      height: box.height / sourceHeight,
    },
  };
}
