'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { X } from 'lucide-react';
import { Point3D } from '@/lib/reconstruction/types';
import { MeasurementItem } from '@/lib/reconstruction/interaction-types';

export interface MeasurementOverlayProps {
  measurements: MeasurementItem[];
  pendingPoint: Point3D | null;
  onRemoveMeasurement?: (id: string) => void;
}

export function MeasurementOverlay({
  measurements,
  pendingPoint,
  onRemoveMeasurement,
}: MeasurementOverlayProps) {
  return (
    <group>
      {/* 1. Pending First Click Marker */}
      {pendingPoint && (
        <group position={[pendingPoint.x, pendingPoint.y, pendingPoint.z]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#D47343" />
          </mesh>
          <Html position={[0, 0.25, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <div className="px-1.5 py-0.5 rounded bg-axis-terracotta text-white font-mono text-[9px] shadow-sm whitespace-nowrap animate-pulse">
              POINT A (Click Point B)
            </div>
          </Html>
        </group>
      )}

      {/* 2. Existing Completed Measurements */}
      {measurements.map((m) => {
        const startPoint: [number, number, number] = [m.start.x, m.start.y, m.start.z];
        const endPoint: [number, number, number] = [m.end.x, m.end.y, m.end.z];
        const displayMid: [number, number, number] = [
          (m.start.x + m.end.x) / 2,
          (m.start.y + m.end.y) / 2 + 0.15,
          (m.start.z + m.end.z) / 2,
        ];

        return (
          <group key={m.id}>
            {/* Start & End Spherical Endpoints */}
            <mesh position={startPoint}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#D47343" />
            </mesh>
            <mesh position={endPoint}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#D47343" />
            </mesh>

            {/* Dimension Line using @react-three/drei Line */}
            <Line
              points={[startPoint, endPoint]}
              color="#D47343"
              lineWidth={2}
            />

            {/* Measurement Label Callout */}
            <Html position={displayMid} center distanceFactor={12}>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-900/95 border border-axis-terracotta/80 text-white font-mono text-[11px] shadow-lg whitespace-nowrap select-none">
                <span className="text-axis-terracotta font-semibold">📏</span>
                <span className="font-bold text-amber-300">
                  {m.distanceMeters.toFixed(2)} m
                </span>
                {onRemoveMeasurement && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveMeasurement(m.id);
                    }}
                    className="ml-1 text-stone-400 hover:text-red-400 focus:outline-none"
                    title="Remove measurement"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
