'use client';

import * as React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface ActivityEvent {
  id: string;
  time: string;
  project: string;
  action: string;
  type: 'completed' | 'started' | 'review' | 'updated';
}

export function ActivityTimeline() {
  const events: ActivityEvent[] = [
    {
      id: '1',
      time: '02:14 PM',
      project: 'Residence 01',
      action: 'Blueprint vector analysis completed (35 walls identified)',
      type: 'completed',
    },
    {
      id: '2',
      time: '11:42 AM',
      project: 'Villa North',
      action: '3D parametric geometry generation initiated',
      type: 'started',
    },
    {
      id: '3',
      time: 'Yesterday',
      project: 'Office Hub',
      action: 'Level 03 and Level 04 structural grid synced',
      type: 'updated',
    },
    {
      id: '4',
      time: '2 days ago',
      project: 'Studio Residence',
      action: 'Human verification queue flagged 2 opening clearances',
      type: 'review',
    },
  ];

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-status-completed-dot" />;
      case 'started':
        return <RefreshCw className="w-3.5 h-3.5 text-status-processing-dot animate-spin" />;
      case 'review':
        return <AlertCircle className="w-3.5 h-3.5 text-status-review-dot" />;
      case 'updated':
      default:
        return <FileText className="w-3.5 h-3.5 text-axis-text-muted" />;
    }
  };

  return (
    <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-axis-text-muted">
            RECENT ACTIVITY TIMELINE
          </CardTitle>
          <span className="font-mono text-[10px] text-axis-text-muted">LOG // RECENT</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-axis-border">
          {events.map((event) => (
            <div key={event.id} className="relative flex items-start gap-3 text-xs">
              {/* Dot / Icon on timeline line */}
              <div className="absolute -left-4 top-0.5 w-3 h-3 rounded-full bg-axis-bg-elevated border border-axis-border flex items-center justify-center">
                {getIcon(event.type)}
              </div>

              <div className="flex-1 min-w-0 pl-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-axis-text-primary text-xs truncate">
                    {event.project}
                  </span>
                  <span className="font-mono text-[10px] text-axis-text-muted shrink-0">
                    {event.time}
                  </span>
                </div>
                <p className="text-axis-text-secondary text-[11px] mt-0.5 leading-snug">
                  {event.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
