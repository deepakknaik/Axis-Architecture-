/**
 * AXIS ARCHITECTURE — Geometric Extrusion & Opening Subdivision Engine
 * 
 * Generates watertight parametric 3D volumes:
 * 1. 2D wall centerline + thickness offset → closed 3D footprint polygon
 * 2. True architectural wall opening subdivision:
 *    Divides walls hosting doors/windows into solid segments, sills, and headers
 * 3. 3D Bounding box calculation for real-scale camera fitting
 */

import { Point3D, BoundingBox3D, WallOpening3D, WallSubSegment3D } from './types';

/**
 * Calculates a closed 4-vertex horizontal footprint polygon from a wall centerline and thickness
 */
export function computeWallFootprint(
  start: Point3D,
  end: Point3D,
  thicknessMeters: number
): Point3D[] {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dz * dz);

  if (length === 0) {
    return [start, start, end, end];
  }

  // Unit vector along wall
  const ux = dx / length;
  const uz = dz / length;

  // Perpendicular normal vector (in XZ plane)
  const nx = -uz;
  const nz = ux;

  const halfT = thicknessMeters / 2;

  return [
    { x: Number((start.x + nx * halfT).toFixed(4)), y: start.y, z: Number((start.z + nz * halfT).toFixed(4)) },
    { x: Number((end.x + nx * halfT).toFixed(4)), y: end.y, z: Number((end.z + nz * halfT).toFixed(4)) },
    { x: Number((end.x - nx * halfT).toFixed(4)), y: end.y, z: Number((end.z - nz * halfT).toFixed(4)) },
    { x: Number((start.x - nx * halfT).toFixed(4)), y: start.y, z: Number((start.z - nz * halfT).toFixed(4)) },
  ];
}

/**
 * Subdivides a wall hosting doors or windows into watertight 3D sub-segments
 * (Left solid segment, sill segment, header segment above opening, right solid segment)
 */
export function subdivideWallOpenings(
  wallStart: Point3D,
  wallEnd: Point3D,
  thickness: number,
  wallHeight: number,
  elevation: number,
  openings: WallOpening3D[]
): WallSubSegment3D[] {
  const dx = wallEnd.x - wallStart.x;
  const dz = wallEnd.z - wallStart.z;
  const totalLength = Math.sqrt(dx * dx + dz * dz);

  if (openings.length === 0 || totalLength <= 0.05) {
    // Single uninterrupted solid wall
    return [
      {
        id: 'solid-full',
        start: wallStart,
        end: wallEnd,
        thickness,
        height: wallHeight,
        elevation,
      },
    ];
  }

  // Unit vector
  const ux = dx / totalLength;
  const uz = dz / totalLength;

  // Sort openings along wall by start offset
  const sorted = [...openings].sort((a, b) => a.offsetAlongWallMeters - b.offsetAlongWallMeters);
  const segments: WallSubSegment3D[] = [];

  let currentDist = 0;

  sorted.forEach((op, idx) => {
    const opStartDist = Math.max(currentDist, op.offsetAlongWallMeters);
    const opEndDist = Math.min(totalLength, opStartDist + op.widthMeters);

    // 1. Solid segment before opening (if non-zero)
    if (opStartDist > currentDist + 0.02) {
      segments.push({
        id: `seg-solid-${idx}`,
        start: {
          x: Number((wallStart.x + ux * currentDist).toFixed(4)),
          y: elevation,
          z: Number((wallStart.z + uz * currentDist).toFixed(4)),
        },
        end: {
          x: Number((wallStart.x + ux * opStartDist).toFixed(4)),
          y: elevation,
          z: Number((wallStart.z + uz * opStartDist).toFixed(4)),
        },
        thickness,
        height: wallHeight,
        elevation,
      });
    }

    const openingStartPoint: Point3D = {
      x: Number((wallStart.x + ux * opStartDist).toFixed(4)),
      y: elevation,
      z: Number((wallStart.z + uz * opStartDist).toFixed(4)),
    };
    const openingEndPoint: Point3D = {
      x: Number((wallStart.x + ux * opEndDist).toFixed(4)),
      y: elevation,
      z: Number((wallStart.z + uz * opEndDist).toFixed(4)),
    };

    // 2. Sill segment (under window, if sill height > 0)
    if (op.type === 'WINDOW' && op.sillElevationMeters > 0.02) {
      segments.push({
        id: `seg-sill-${op.id}`,
        start: openingStartPoint,
        end: openingEndPoint,
        thickness,
        height: op.sillElevationMeters,
        elevation,
        isSill: true,
      });
    }

    // 3. Header segment (above door or window opening up to ceiling/wall height)
    const openingTop = op.sillElevationMeters + op.heightMeters;
    if (wallHeight > openingTop + 0.02) {
      const headerHeight = wallHeight - openingTop;
      segments.push({
        id: `seg-header-${op.id}`,
        start: {
          x: openingStartPoint.x,
          y: elevation + openingTop,
          z: openingStartPoint.z,
        },
        end: {
          x: openingEndPoint.x,
          y: elevation + openingTop,
          z: openingEndPoint.z,
        },
        thickness,
        height: headerHeight,
        elevation: elevation + openingTop,
        isHeader: true,
      });
    }

    currentDist = opEndDist;
  });

  // 4. Trailing solid segment after last opening
  if (totalLength > currentDist + 0.02) {
    segments.push({
      id: `seg-solid-tail`,
      start: {
        x: Number((wallStart.x + ux * currentDist).toFixed(4)),
        y: elevation,
        z: Number((wallStart.z + uz * currentDist).toFixed(4)),
      },
      end: wallEnd,
      thickness,
      height: wallHeight,
      elevation,
    });
  }

  return segments;
}

/**
 * Computes the 3D bounding box across all points in the building model
 */
export function computeBoundingBox(points: Point3D[]): BoundingBox3D {
  if (points.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
      center: { x: 0, y: 0, z: 0 },
      size: { x: 0, y: 0, z: 0 },
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  points.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  });

  const sizeX = Number((maxX - minX).toFixed(3));
  const sizeY = Number((maxY - minY).toFixed(3));
  const sizeZ = Number((maxZ - minZ).toFixed(3));

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ },
    center: {
      x: Number(((minX + maxX) / 2).toFixed(3)),
      y: Number(((minY + maxY) / 2).toFixed(3)),
      z: Number(((minZ + maxZ) / 2).toFixed(3)),
    },
    size: { x: sizeX, y: sizeY, z: sizeZ },
  };
}

/**
 * Computes polygon area in square meters (Shoelace formula in XZ plane)
 */
export function computePolygonAreaSqMeters(polygon: Point3D[]): number {
  const n = polygon.length;
  if (n < 3) return 0;

  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += polygon[i].x * polygon[j].z;
    area -= polygon[j].x * polygon[i].z;
  }

  return Number((Math.abs(area) / 2).toFixed(2));
}
