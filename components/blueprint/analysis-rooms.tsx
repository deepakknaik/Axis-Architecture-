'use client';

import * as React from 'react';
import { Home, CheckCircle2, ChevronRight, SquareDashed } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RoomElement } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface AnalysisRoomsProps {
  rooms: RoomElement[];
  selectedRoomId: string | null;
  onSelectRoom: (room: RoomElement | null) => void;
  className?: string;
}

export function AnalysisRooms({
  rooms,
  selectedRoomId,
  onSelectRoom,
  className,
}: AnalysisRoomsProps) {
  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Home className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Spaces & Envelopes
          </CardTitle>
        </div>
        <span className="font-mono text-[10px] text-axis-text-muted">
          {rooms.length} Spaces
        </span>
      </CardHeader>

      <CardContent className="p-2 space-y-1 max-h-[340px] overflow-y-auto">
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const dimensions = `${room.dimensions.width.toFixed(2)} × ${room.dimensions.length.toFixed(2)} m`;
          const area = `${room.calculatedAreaSqMeters.toFixed(1)} m²`;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(isSelected ? null : room)}
              aria-pressed={isSelected}
              className={cn(
                'w-full flex items-center justify-between p-2 rounded text-left transition-all border group focus:outline-none focus:ring-1 focus:ring-axis-accent',
                isSelected
                  ? 'bg-axis-accent/10 border-axis-accent/40 shadow-axis-xs'
                  : 'bg-transparent border-transparent hover:bg-axis-surface hover:border-axis-border/60'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Room ID Tag */}
                <div
                  className={cn(
                    'font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 transition-colors',
                    isSelected
                      ? 'bg-axis-accent text-white border-axis-accent'
                      : 'bg-axis-surface text-axis-text-secondary border-axis-border group-hover:border-axis-accent/40'
                  )}
                >
                  {room.id}
                </div>

                {/* Room Name & Dimensions */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs font-medium tracking-tight truncate',
                        isSelected ? 'text-axis-accent font-semibold' : 'text-axis-text-primary'
                      )}
                    >
                      {room.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-axis-text-muted block">
                    {dimensions}
                  </span>
                </div>
              </div>

              {/* Area Badge */}
              <div className="flex items-center gap-1 text-right shrink-0 ml-2">
                <span className="font-mono text-[11px] font-semibold text-axis-text-secondary">
                  {area}
                </span>
                <ChevronRight
                  className={cn(
                    'w-3 h-3 transition-transform text-axis-text-muted',
                    isSelected && 'rotate-90 text-axis-accent'
                  )}
                />
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
