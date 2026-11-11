/**
 * AXIS ARCHITECTURE — 2D → 3D Coordinate Mapping System
 * 
 * Preserves the architectural metric contract:
 * - 1 canonical 3D unit = 1.0 meter.
 * - 2D Plan X → 3D X (width)
 * - 2D Plan Y → 3D Z (depth)
 * - Vertical elevation → 3D Y (elevation, ground Y = 0.0)
 * 
 * Deterministic transform prevents arbitrary visual rescaling.
 */

import { Vector2D } from '@/lib/types/architectural';
import { Point3D, Vector3D } from './types';

export interface PlanCalibrationDatum {
  pixelsPerMeter: number;
  originPixel: Vector2D; // Pixel in source image representing (0,0) metric datum or plan center
  rotationAngleRadians?: number;
  groundElevationMeters?: number;
}

export class CoordinateMapper {
  private ppm: number;
  private origin: Vector2D;
  private rotation: number;
  private groundElevation: number;

  constructor(datum: PlanCalibrationDatum) {
    this.ppm = datum.pixelsPerMeter > 0 ? datum.pixelsPerMeter : 50.0;
    this.origin = datum.originPixel || { x: 0, y: 0 };
    this.rotation = datum.rotationAngleRadians || 0;
    this.groundElevation = datum.groundElevationMeters || 0.0;
  }

  /**
   * Transforms a 2D source raster coordinate (pixels) to canonical 3D World space (meters)
   * X = (pixel.x - origin.x) / ppm
   * Y = elevation
   * Z = (pixel.y - origin.y) / ppm
   */
  public planPixelToWorld3D(pixel: Vector2D, elevationMeters: number = 0.0): Point3D {
    const rawX = (pixel.x - this.origin.x) / this.ppm;
    const rawZ = (pixel.y - this.origin.y) / this.ppm;

    if (this.rotation === 0) {
      return {
        x: Number(rawX.toFixed(4)),
        y: Number((this.groundElevation + elevationMeters).toFixed(4)),
        z: Number(rawZ.toFixed(4)),
      };
    }

    // Apply planar rotation around origin if specified
    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);
    const rotX = rawX * cosR - rawZ * sinR;
    const rotZ = rawX * sinR + rawZ * cosR;

    return {
      x: Number(rotX.toFixed(4)),
      y: Number((this.groundElevation + elevationMeters).toFixed(4)),
      z: Number(rotZ.toFixed(4)),
    };
  }

  /**
   * Direct metric coordinate to 3D point (when already measured in meters)
   */
  public metric2DToWorld3D(metricPlan: Vector2D, elevationMeters: number = 0.0): Point3D {
    return {
      x: Number(metricPlan.x.toFixed(4)),
      y: Number((this.groundElevation + elevationMeters).toFixed(4)),
      z: Number(metricPlan.y.toFixed(4)),
    };
  }

  /**
   * Transforms a 3D point back to 2D plan pixels (for source traceability)
   */
  public world3DToPlanPixel(point: Point3D): Vector2D {
    const px = point.x * this.ppm + this.origin.x;
    const py = point.z * this.ppm + this.origin.y;
    return {
      x: Math.round(px),
      y: Math.round(py),
    };
  }

  /**
   * Converts pixel distance to meters
   */
  public pixelsToMeters(pixels: number): number {
    return Number((pixels / this.ppm).toFixed(3));
  }

  /**
   * Converts meters to pixels
   */
  public metersToPixels(meters: number): number {
    return Math.round(meters * this.ppm);
  }
}
