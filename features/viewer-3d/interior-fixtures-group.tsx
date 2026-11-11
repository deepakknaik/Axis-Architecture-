'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Room3D, BuildingFloor } from '@/lib/reconstruction/types';

export interface InteriorFixturesGroupProps {
  floors: BuildingFloor[];
  activeFloorId?: string | 'ALL';
  visible?: boolean;
}

export function InteriorFixturesGroup({
  floors,
  activeFloorId = 'ALL',
  visible = true,
}: InteriorFixturesGroupProps) {
  if (!visible) return null;

  const relevantFloors = React.useMemo(() => {
    return floors.filter((f) => activeFloorId === 'ALL' || f.id === activeFloorId);
  }, [floors, activeFloorId]);

  return (
    <group>
      {relevantFloors.map((floor) => {
        const floorElev = floor.elevationMeters || 0;
        return (
          <group key={`fixtures-${floor.id}`} position={[0, floorElev, 0]}>
            {(floor.rooms || []).map((room) => {
              const name = (room.name || '').toLowerCase();
              const fn = room.roomFunction;
              const cx = room.centroid.x;
              const cz = room.centroid.z;
              const w = room.dimensions?.widthMeters || 3.0;
              const d = room.dimensions?.depthMeters || 3.0;

              // 1. BEDROOM
              if (fn === 'BEDROOM' || name.includes('bed')) {
                const isMirrored = cx > 0;
                const bedX = cx + (isMirrored ? 0.35 : -0.35);
                const bedZ = cz - 0.2;
                const duvetColor = isMirrored ? '#6A8471' : '#5A738E';

                return (
                  <group key={`fix-${room.id}`} position={[0, 0, 0]}>
                    {/* Bed Frame */}
                    <mesh position={[bedX, 0.18, bedZ]} castShadow receiveShadow>
                      <boxGeometry args={[1.7, 0.32, 2.05]} />
                      <meshStandardMaterial color="#7A6048" roughness={0.7} />
                    </mesh>
                    {/* Mattress */}
                    <mesh position={[bedX, 0.42, bedZ]} castShadow receiveShadow>
                      <boxGeometry args={[1.58, 0.2, 1.95]} />
                      <meshStandardMaterial color="#ECEFF2" roughness={0.9} />
                    </mesh>
                    {/* Folded Duvet / Blanket */}
                    <mesh position={[bedX, 0.53, bedZ + 0.35]} castShadow receiveShadow>
                      <boxGeometry args={[1.6, 0.06, 1.2]} />
                      <meshStandardMaterial color={duvetColor} roughness={0.85} />
                    </mesh>
                    {/* Headboard */}
                    <mesh position={[bedX, 0.55, bedZ - 1.02]} castShadow receiveShadow>
                      <boxGeometry args={[1.76, 0.9, 0.08]} />
                      <meshStandardMaterial color="#634F3D" roughness={0.75} />
                    </mesh>
                    {/* Two Pillows */}
                    <mesh position={[bedX - 0.4, 0.55, bedZ - 0.7]} castShadow>
                      <boxGeometry args={[0.55, 0.12, 0.38]} />
                      <meshStandardMaterial color="#ECEFF2" roughness={0.9} />
                    </mesh>
                    <mesh position={[bedX + 0.4, 0.55, bedZ - 0.7]} castShadow>
                      <boxGeometry args={[0.55, 0.12, 0.38]} />
                      <meshStandardMaterial color="#ECEFF2" roughness={0.9} />
                    </mesh>
                    {/* Nightstands */}
                    <mesh position={[bedX - 1.15, 0.22, bedZ - 0.8]} castShadow receiveShadow>
                      <boxGeometry args={[0.42, 0.44, 0.42]} />
                      <meshStandardMaterial color="#7A6048" roughness={0.7} />
                    </mesh>
                    <mesh position={[bedX + 1.15, 0.22, bedZ - 0.8]} castShadow receiveShadow>
                      <boxGeometry args={[0.42, 0.44, 0.42]} />
                      <meshStandardMaterial color="#7A6048" roughness={0.7} />
                    </mesh>
                    {/* Wardrobe Unit */}
                    <mesh position={[cx + (isMirrored ? -w / 2 + 0.35 : w / 2 - 0.35), 1.05, cz + 0.5]} castShadow receiveShadow>
                      <boxGeometry args={[0.55, 2.1, 1.6]} />
                      <meshStandardMaterial color="#CFC6B6" roughness={0.8} />
                    </mesh>
                  </group>
                );
              }

              // 2. BATHROOM
              if (fn === 'BATHROOM' || name.includes('bath') || name.includes('toilet') || name.includes('wc')) {
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Toilet Cistern */}
                    <mesh position={[-0.35, 0.5, -0.4]} castShadow receiveShadow>
                      <boxGeometry args={[0.38, 0.46, 0.18]} />
                      <meshStandardMaterial color="#F3F5F6" roughness={0.25} />
                    </mesh>
                    {/* Toilet Bowl */}
                    <mesh position={[-0.35, 0.22, -0.15]} castShadow receiveShadow>
                      <boxGeometry args={[0.36, 0.42, 0.48]} />
                      <meshStandardMaterial color="#F3F5F6" roughness={0.25} />
                    </mesh>
                    {/* Vanity Unit */}
                    <mesh position={[0.35, 0.42, -0.3]} castShadow receiveShadow>
                      <boxGeometry args={[0.55, 0.82, 0.45]} />
                      <meshStandardMaterial color="#B0BAC1" roughness={0.65} />
                    </mesh>
                    {/* Basin */}
                    <mesh position={[0.35, 0.88, -0.3]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.18, 0.14, 0.08, 16]} />
                      <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
                    </mesh>
                  </group>
                );
              }

              // 3. KITCHEN
              if (fn === 'KITCHEN' || name.includes('kitchen')) {
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Base Cabinet Run */}
                    <mesh position={[-w / 2 + 0.35, 0.45, 0]} castShadow receiveShadow>
                      <boxGeometry args={[0.65, 0.9, Math.min(2.8, d - 0.6)]} />
                      <meshStandardMaterial color="#556066" roughness={0.7} />
                    </mesh>
                    {/* Countertop */}
                    <mesh position={[-w / 2 + 0.35, 0.92, 0]} castShadow receiveShadow>
                      <boxGeometry args={[0.68, 0.04, Math.min(2.84, d - 0.56)]} />
                      <meshStandardMaterial color="#E9E6DF" roughness={0.4} />
                    </mesh>
                    {/* Stainless Steel Sink Basin */}
                    <mesh position={[-w / 2 + 0.35, 0.95, -0.4]} castShadow>
                      <boxGeometry args={[0.48, 0.02, 0.75]} />
                      <meshStandardMaterial color="#AAB4BA" roughness={0.25} metalness={0.8} />
                    </mesh>
                    {/* Cooktop Burners */}
                    <mesh position={[-w / 2 + 0.35, 0.95, 0.5]} castShadow>
                      <boxGeometry args={[0.5, 0.02, 0.65]} />
                      <meshStandardMaterial color="#1E2226" roughness={0.6} />
                    </mesh>
                    {/* Tall Refrigerator */}
                    <mesh position={[-w / 2 + 0.4, 0.95, d / 2 - 0.45]} castShadow receiveShadow>
                      <boxGeometry args={[0.7, 1.9, 0.7]} />
                      <meshStandardMaterial color="#B0B8BE" roughness={0.35} metalness={0.6} />
                    </mesh>
                  </group>
                );
              }

              // 4. DINING
              if (fn === 'DINING' || name.includes('dining')) {
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Dining Table Top */}
                    <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
                      <boxGeometry args={[1.5, 0.05, 0.95]} />
                      <meshStandardMaterial color="#A98259" roughness={0.55} />
                    </mesh>
                    {/* Table 4 Legs */}
                    {[
                      [-0.68, -0.4],
                      [0.68, -0.4],
                      [-0.68, 0.4],
                      [0.68, 0.4],
                    ].map(([lx, lz], i) => (
                      <mesh key={`leg-${i}`} position={[lx, 0.36, lz]} castShadow>
                        <boxGeometry args={[0.06, 0.72, 0.06]} />
                        <meshStandardMaterial color="#6B5138" roughness={0.7} />
                      </mesh>
                    ))}
                    {/* 4 Minimalist Dining Chairs */}
                    {[
                      [0, -0.68, 0],
                      [0, 0.68, Math.PI],
                      [-0.95, 0, Math.PI / 2],
                      [0.95, 0, -Math.PI / 2],
                    ].map(([chx, chz, rot], idx) => (
                      <group key={`chair-${idx}`} position={[chx, 0, chz]} rotation={[0, rot, 0]}>
                        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                          <boxGeometry args={[0.42, 0.05, 0.42]} />
                          <meshStandardMaterial color="#3D454E" roughness={0.8} />
                        </mesh>
                        <mesh position={[0, 0.72, -0.19]} castShadow>
                          <boxGeometry args={[0.42, 0.5, 0.05]} />
                          <meshStandardMaterial color="#3D454E" roughness={0.8} />
                        </mesh>
                        {/* Chair Legs */}
                        {[
                          [-0.17, -0.17],
                          [0.17, -0.17],
                          [-0.17, 0.17],
                          [0.17, 0.17],
                        ].map(([cxLeg, czLeg], lIdx) => (
                          <mesh key={`cleg-${lIdx}`} position={[cxLeg, 0.22, czLeg]} castShadow>
                            <boxGeometry args={[0.035, 0.44, 0.035]} />
                            <meshStandardMaterial color="#6B5138" roughness={0.7} />
                          </mesh>
                        ))}
                      </group>
                    ))}
                  </group>
                );
              }

              // 5. LIVING ROOM (Sectional L-Sofa + Rug + Coffee Table)
              if (fn === 'LIVING' || name.includes('living') || name.includes('lounge')) {
                const isLarge = w >= 3.6 && d >= 3.6;
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Area Rug */}
                    <mesh position={[0, 0.015, 0]} receiveShadow>
                      <boxGeometry args={[isLarge ? 2.8 : 2.2, 0.015, isLarge ? 2.6 : 1.6]} />
                      <meshStandardMaterial color="#4A5664" roughness={0.98} />
                    </mesh>

                    {/* Sectional Sofa: Main Run */}
                    <mesh position={[0, 0.22, isLarge ? -0.8 : -0.65]} castShadow receiveShadow>
                      <boxGeometry args={[isLarge ? 2.6 : 2.0, 0.42, 0.85]} />
                      <meshStandardMaterial color="#6E7E8E" roughness={0.92} />
                    </mesh>
                    {/* Sectional Sofa: Backrest */}
                    <mesh position={[0, 0.55, isLarge ? -1.15 : -1.0]} castShadow receiveShadow>
                      <boxGeometry args={[isLarge ? 2.6 : 2.0, 0.48, 0.22]} />
                      <meshStandardMaterial color="#6E7E8E" roughness={0.92} />
                    </mesh>

                    {/* Sectional L-Return Chaise if large room */}
                    {isLarge && (
                      <mesh position={[0.95, 0.22, 0.0]} castShadow receiveShadow>
                        <boxGeometry args={[0.85, 0.42, 1.6]} />
                        <meshStandardMaterial color="#6E7E8E" roughness={0.92} />
                      </mesh>
                    )}

                    {/* Coffee Table Top */}
                    <mesh position={[isLarge ? -0.2 : 0, 0.38, 0.05]} castShadow receiveShadow>
                      <boxGeometry args={[isLarge ? 1.2 : 1.05, 0.04, 0.7]} />
                      <meshStandardMaterial color="#CFE0E8" roughness={0.3} metalness={0.1} />
                    </mesh>
                    {/* Coffee Table Legs */}
                    {[
                      [-0.45, -0.25],
                      [0.45, -0.25],
                      [-0.45, 0.25],
                      [0.45, 0.25],
                    ].map(([tlx, tlz], i) => (
                      <mesh key={`ctleg-${i}`} position={[(isLarge ? -0.2 : 0) + tlx, 0.18, 0.05 + tlz]} castShadow>
                        <boxGeometry args={[0.04, 0.36, 0.04]} />
                        <meshStandardMaterial color="#6B5138" roughness={0.7} />
                      </mesh>
                    ))}

                    {/* Accent Planter Pot */}
                    <mesh position={[isLarge ? -1.2 : 0.95, 0.25, 0.7]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.2, 0.15, 0.48, 16]} />
                      <meshStandardMaterial color="#B5683F" roughness={0.8} />
                    </mesh>
                    {/* Architectural Foliage */}
                    <mesh position={[isLarge ? -1.2 : 0.95, 0.68, 0.7]} castShadow>
                      <sphereGeometry args={[0.28, 12, 10]} />
                      <meshStandardMaterial color="#446E4A" roughness={0.9} />
                    </mesh>
                  </group>
                );
              }

              // 6. UTILITY / LAUNDRY
              if (name.includes('util') || name.includes('laundry')) {
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Washing Machine */}
                    <mesh position={[-0.35, 0.45, 0]} castShadow receiveShadow>
                      <boxGeometry args={[0.65, 0.88, 0.65]} />
                      <meshStandardMaterial color="#ECEFF2" roughness={0.3} metalness={0.1} />
                    </mesh>
                    {/* Washer Porthole Door */}
                    <mesh position={[-0.35, 0.45, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
                      <meshStandardMaterial color="#4A5664" roughness={0.2} metalness={0.7} />
                    </mesh>
                    {/* Utility Sink / Counter */}
                    <mesh position={[0.38, 0.42, 0]} castShadow receiveShadow>
                      <boxGeometry args={[0.6, 0.84, 0.6]} />
                      <meshStandardMaterial color="#B0BAC1" roughness={0.65} />
                    </mesh>
                  </group>
                );
              }

              // 7. PARKING BAY
              if (name.includes('park') || name.includes('garage') || name.includes('car')) {
                return (
                  <group key={`fix-${room.id}`} position={[cx, 0, cz]}>
                    {/* Car Body Lower Chassis */}
                    <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
                      <boxGeometry args={[1.85, 0.46, 4.3]} />
                      <meshStandardMaterial color="#38434F" roughness={0.4} metalness={0.6} />
                    </mesh>
                    {/* Car Cabin & Roof */}
                    <mesh position={[0, 0.82, -0.15]} castShadow receiveShadow>
                      <boxGeometry args={[1.65, 0.52, 2.3]} />
                      <meshStandardMaterial color="#1E2630" roughness={0.2} metalness={0.8} />
                    </mesh>
                    {/* Windshield Glazing */}
                    <mesh position={[0, 0.82, 0.95]} rotation={[-0.35, 0, 0]}>
                      <boxGeometry args={[1.55, 0.45, 0.02]} />
                      <meshStandardMaterial color="#7E9EB8" roughness={0.1} transparent opacity={0.65} />
                    </mesh>
                    {/* Rear Window */}
                    <mesh position={[0, 0.82, -1.25]} rotation={[0.35, 0, 0]}>
                      <boxGeometry args={[1.55, 0.45, 0.02]} />
                      <meshStandardMaterial color="#7E9EB8" roughness={0.1} transparent opacity={0.65} />
                    </mesh>
                    {/* 4 Wheels */}
                    {[
                      [-0.94, 0.28, 1.3],
                      [0.94, 0.28, 1.3],
                      [-0.94, 0.28, -1.3],
                      [0.94, 0.28, -1.3],
                    ].map(([wx, wy, wz], wIdx) => (
                      <mesh key={`wheel-${wIdx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
                        <meshStandardMaterial color="#1B1E22" roughness={0.9} />
                      </mesh>
                    ))}
                    {/* Headlights */}
                    <mesh position={[-0.65, 0.38, 2.16]}>
                      <boxGeometry args={[0.3, 0.12, 0.04]} />
                      <meshStandardMaterial color="#FFFEE6" roughness={0.1} emissive="#FFFEE6" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[0.65, 0.38, 2.16]}>
                      <boxGeometry args={[0.3, 0.12, 0.04]} />
                      <meshStandardMaterial color="#FFFEE6" roughness={0.1} emissive="#FFFEE6" emissiveIntensity={0.5} />
                    </mesh>
                  </group>
                );
              }

              return null;
            })}
          </group>
        );
      })}
    </group>
  );
}
