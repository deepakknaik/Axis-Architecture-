'use client';

import * as React from 'react';
import { History, Check, Edit3, Ban, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { VerificationHistoryEntry } from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface VerificationHistoryProps {
  history: VerificationHistoryEntry[];
  onSelectElement?: (elementId: string) => void;
  className?: string;
}

export function VerificationHistory({
  history,
  onSelectElement,
  className,
}: VerificationHistoryProps) {
  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs', className)}>
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Review History & Audit
          </CardTitle>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-axis-text-muted bg-axis-surface px-1.5 py-0.2 rounded border border-axis-border">
          LOCAL AUDIT
        </span>
      </CardHeader>

      <CardContent className="p-3 space-y-2 text-xs">
        {history.length === 0 ? (
          <div className="py-6 text-center text-axis-text-muted space-y-1">
            <Clock className="w-4 h-4 mx-auto opacity-50 mb-1" />
            <p className="text-[11px]">No reviews recorded yet.</p>
            <p className="text-[10px] text-axis-text-secondary">Confirm or edit detections to begin audit log.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {history.map((entry) => {
              const isConfirmed = entry.newStatus === 'CONFIRMED';
              const isEdited = entry.newStatus === 'EDITED';
              const isRejected = entry.newStatus === 'REJECTED';

              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectElement?.(entry.elementId)}
                  className="flex items-start justify-between p-2 rounded bg-axis-surface/50 border border-axis-border/60 hover:bg-axis-surface hover:border-axis-accent/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {/* Status Icon */}
                    <div
                      className={cn(
                        'w-5 h-5 rounded-xs flex items-center justify-center shrink-0 mt-0.5 border text-[10px]',
                        isConfirmed && 'bg-status-verified-bg text-status-verified-dot border-status-verified-border',
                        isEdited && 'bg-axis-accent/15 text-axis-accent border-axis-accent/30',
                        isRejected && 'bg-red-500/10 text-red-600 border-red-500/30'
                      )}
                    >
                      {isConfirmed && <Check className="w-3 h-3 stroke-[2.5]" />}
                      {isEdited && <Edit3 className="w-3 h-3" />}
                      {isRejected && <Ban className="w-3 h-3" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-axis-text-primary text-[11px] group-hover:text-axis-accent transition-colors">
                          {entry.elementId}
                        </span>
                        <span
                          className={cn(
                            'font-mono text-[9px] uppercase font-bold tracking-wider',
                            isConfirmed && 'text-status-verified-dot',
                            isEdited && 'text-axis-accent',
                            isRejected && 'text-red-600'
                          )}
                        >
                          {entry.newStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-axis-text-secondary truncate max-w-[200px]">
                        {entry.note || entry.changesSummary || 'Validated'}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-axis-text-muted shrink-0 ml-2">
                    {entry.formattedTime}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
