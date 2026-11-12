'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { DoorClosed, DoorOpen } from 'lucide-react';
import { Door3D } from '@/lib/reconstruction/types';

export interface DoorMeshProps {
  door: Door3D;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: (elementId: string) => void;
  onHover?: (elementId: string | null) => void;
  wireframe?: boolean;
}

/**
 * 1-Click Interactive Animated Door Swing Subsystem
 * Features:
 * - Click to smoothly swing door open / closed (0 deg to 92 deg)
 * - 60 FPS physical spring easing via Three.js MathUtils.damp
 * - Architectural floor swing arc radius indicator
 * - Interactive hover badge ("Click to Open / Close")
 */
export function DoorMesh({
  door,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
  wireframe = false,
}: DoorMeshProps) {
  const leafRef = React.useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLocalHovered, setIsLocalHovered] = React.useState(false);

  const frameThickness = 0.05;
  const jambDepth = 0.15;
  const leafThickness = 0.04;

  const width = door.clearWidthMeters;
  const height = door.clearHeightMeters;

  // Animate leaf rotation smoothly on every frame (0 to ~92 degrees)
  useFrame((_, delta) => {
    if (!leafRef.current) return;
    const targetAngle = isOpen ? Math.PI * 0.52 : 0;
    leafRef.current.rotation.y = THREE.MathUtils.damp(
      leafRef.current.rotation.y,
      targetAngle,
      9,
      delta
    );
  });

  const materialColor = isSelected
    ? '#D47343'
    : isHovered || isLocalHovered
    ? '#8D5B34'
    : '#6B4728'; // Warm architectural oiled walnut

  // Generate 2D architectural swing arc points on the floor (CAD standard)
  const arcPoints = React.useMemo(() => {
    const pts: [number, number, number][] = [];
    const radius = width - frameThickness * 2;
    const segments = 24;
    const maxAngle = Math.PI * 0.52;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * maxAngle;
      // Arc centered at hinge position
      pts.push([
        -width / 2 + frameThickness + Math.cos(theta) * radius,
        0.012,
        Math.sin(theta) * radius,
      ]);
    }
    return pts;
  }, [width, frameThickness]);

  const toggleDoor = (e: any) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
    onSelect?.(door.id);
  };

  return (
    <group
      position={[door.position.x, door.position.y, door.position.z]}
      rotation={[0, door.rotationY, 0]}
      onClick={toggleDoor}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsLocalHovered(true);
        if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        onHover?.(door.id);
      }}
      onPointerOut={() => {
        setIsLocalHovered(false);
        if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        onHover?.(null);
      }}
    >
      {/* 1. Left Jamb (Hinge Side) */}
      <mesh
        position={[-width / 2 + frameThickness / 2, height / 2, 0]}
        castShadow
      >
        <boxGeometry args={[frameThickness, height, jambDepth]} />
        <meshStandardMaterial color="#2B3038" roughness={0.4} metalness={0.75} wireframe={wireframe} />
      </mesh>

      {/* 2. Right Jamb (Strike Side) */}
      <mesh
        position={[width / 2 - frameThickness / 2, height / 2, 0]}
        castShadow
      >
        <boxGeometry args={[frameThickness, height, jambDepth]} />
        <meshStandardMaterial color="#2B3038" roughness={0.4} metalness={0.75} wireframe={wireframe} />
      </mesh>

      {/* 3. Header Jamb */}
      <mesh
        position={[0, height - frameThickness / 2, 0]}
        castShadow
      >
        <boxGeometry args={[width, frameThickness, jambDepth]} />
        <meshStandardMaterial color="#2B3038" roughness={0.4} metalness={0.75} wireframe={wireframe} />
      </mesh>

      {/* 4. Architectural Swing Arc on Floor (Visible on Hover or Selection) */}
      {!wireframe && (isHovered || isLocalHovered || isSelected) && (
        <group>
          <Line
            points={arcPoints}
            color="#F59E0B"
            lineWidth={1.5}
            dashed
            dashSize={0.12}
            gapSize={0.08}
          />
          {/* Straight line from hinge to current leaf edge */}
          <Line
            points={[
              [-width / 2 + frameThickness, 0.012, 0],
              [-width / 2 + frameThickness + (width - frameThickness * 2), 0.012, 0],
            ]}
            color="#D97706"
            lineWidth={1}
            dashed
            dashSize={0.1}
            gapSize={0.1}
          />
        </group>
      )}

      {/* 5. Animated Timber Door Leaf (Pivot-hinged at Left Frame edge) */}
      <group
        ref={leafRef}
        position={[-width / 2 + frameThickness, 0, 0]}
      >
        {/* Solid Walnut Door Panel */}
        <mesh
          position={[(width - frameThickness * 2) / 2, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width - frameThickness * 2, height - frameThickness, leafThickness]} />
          <meshStandardMaterial
            color={materialColor}
            roughness={0.38}
            metalness={0.04}
            wireframe={wireframe}
          />
        </mesh>

        {/* Brushed Brass / Gold Vertical Architectural Pull Handle */}
        {!wireframe && (
          <group position={[(width - frameThickness * 2) * 0.82, height * 0.48, 0]}>
            {/* Front Handle */}
            <mesh position={[0, 0, leafThickness / 2 + 0.02]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 12]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.88} />
            </mesh>
            {/* Back Handle */}
            <mesh position={[0, 0, -leafThickness / 2 - 0.02]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 12]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.88} />
            </mesh>
          </group>
        )}
      </group>

      {/* 6. Interactive Hover Tooltip ("Click to Open / Close") */}
      {(isHovered || isLocalHovered) && (
        <Html
          position={[0, height + 0.25, 0]}
          center
          distanceFactor={11}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-950/95 border border-amber-400 text-amber-300 font-mono text-[10px] font-bold shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
            {isOpen ? (
              <>
                <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Click to Close Door</span>
              </>
            ) : (
              <>
                <DoorClosed className="w-3.5 h-3.5 text-amber-400" />
                <span>Click to Open Door</span>
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
