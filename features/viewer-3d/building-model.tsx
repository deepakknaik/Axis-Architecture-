'use client';

import * as React from 'react';
import { BuildingModel, Room3D } from '@/lib/reconstruction/types';
import { CategoryVisibilityState, DEFAULT_CATEGORY_VISIBILITY } from '@/lib/reconstruction/interaction-types';
import { FloorSlabMesh } from './floor-slab-mesh';
import { WallMesh } from './wall-mesh';
import { DoorMesh } from './door-mesh';
import { WindowMesh } from './window-mesh';
import { ColumnMesh } from './column-mesh';
import { StairMesh } from './stair-mesh';
import { RoomMesh } from './room-mesh';
import { DimensionOverlay3D } from './dimension-overlay-3d';
import { RoofMesh } from './roof-mesh';
import { RoomLabels3D } from './room-labels-3d';
import { InteriorFixturesGroup } from './interior-fixtures-group';

export interface BuildingModelGroupProps {
  model: BuildingModel;
  selectedElementId?: string | null;
  hoveredElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onHoverElement?: (id: string | null) => void;
  categoryVisibility?: CategoryVisibilityState;
  wireframe?: boolean;
  activeFloorId?: string | 'ALL';
  fadeNonSelectedFloors?: boolean;
}

export function BuildingModelGroup({
  model,
  selectedElementId,
  hoveredElementId,
  onSelectElement,
  onHoverElement,
  categoryVisibility = DEFAULT_CATEGORY_VISIBILITY,
  wireframe = false,
  activeFloorId = 'ALL',
  fadeNonSelectedFloors = true,
}: BuildingModelGroupProps) {
  return (
    <group
      onPointerMissed={() => {
        onSelectElement?.(null);
      }}
    >
      {model.floors.map((floor) => {
        const isFloorActive = activeFloorId === 'ALL' || activeFloorId === floor.id;

        // If not fading and floor is not active, skip rendering
        if (!isFloorActive && !fadeNonSelectedFloors) {
          return null;
        }

        return (
          <group
            key={floor.id}
            position={[0, 0, 0]}
          >
            {/* 1. Floor Slab */}
            {categoryVisibility.floors && floor.slab && (
              <FloorSlabMesh
                slab={floor.slab}
                wireframe={wireframe}
              />
            )}

            {/* 2. Room Floor Boundaries */}
            {categoryVisibility.rooms &&
              floor.rooms?.map((room) => (
                <RoomMesh
                  key={room.id}
                  room={room}
                  isSelected={selectedElementId === room.id}
                  isHovered={hoveredElementId === room.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                />
              ))}

            {/* 3. Walls */}
            {categoryVisibility.walls &&
              floor.walls.map((wall) => (
                <WallMesh
                  key={wall.id}
                  wall={wall}
                  isSelected={selectedElementId === wall.id}
                  isHovered={hoveredElementId === wall.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                  wireframe={wireframe}
                />
              ))}

            {/* 4. Doors */}
            {categoryVisibility.doors &&
              floor.doors.map((door) => (
                <DoorMesh
                  key={door.id}
                  door={door}
                  isSelected={selectedElementId === door.id}
                  isHovered={hoveredElementId === door.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                  wireframe={wireframe}
                />
              ))}

            {/* 5. Windows */}
            {categoryVisibility.windows &&
              floor.windows.map((win) => (
                <WindowMesh
                  key={win.id}
                  window={win}
                  isSelected={selectedElementId === win.id}
                  isHovered={hoveredElementId === win.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                  wireframe={wireframe}
                />
              ))}

            {/* 6. Columns */}
            {categoryVisibility.columns &&
              floor.columns.map((col) => (
                <ColumnMesh
                  key={col.id}
                  column={col}
                  isSelected={selectedElementId === col.id}
                  isHovered={hoveredElementId === col.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                  wireframe={wireframe}
                />
              ))}

            {/* 7. Stairs */}
            {categoryVisibility.stairs &&
              floor.stairs.map((stair) => (
                <StairMesh
                  key={stair.id}
                  stair={stair}
                  isSelected={selectedElementId === stair.id}
                  isHovered={hoveredElementId === stair.id}
                  onSelect={onSelectElement}
                  onHover={onHoverElement}
                  wireframe={wireframe}
                />
              ))}
          </group>
        );
      })}

      {/* 8. Dimension Callouts Overlay */}
      {categoryVisibility.dimensions && (
        <DimensionOverlay3D
          model={model}
          visible={categoryVisibility.dimensions}
          selectedElementId={selectedElementId}
        />
      )}

      {/* 9. Procedural Interior Fixtures */}
      {Boolean(categoryVisibility.fixtures ?? true) && (
        <InteriorFixturesGroup
          floors={model.floors}
          activeFloorId={activeFloorId}
          visible={Boolean(categoryVisibility.fixtures ?? true)}
        />
      )}

      {/* 10. Floating 3D Room Badges */}
      {Boolean(categoryVisibility.labels ?? true) && (
        <RoomLabels3D
          floors={model.floors}
          activeFloorId={activeFloorId}
          visible={Boolean(categoryVisibility.labels ?? true)}
          selectedRoomId={selectedElementId}
          onSelectRoom={onSelectElement}
        />
      )}

      {/* 11. Roof Structure */}
      {Boolean(categoryVisibility.roof) && (
        <RoofMesh
          model={model}
          visible={Boolean(categoryVisibility.roof)}
          wireframe={wireframe}
        />
      )}
    </group>
  );
}
