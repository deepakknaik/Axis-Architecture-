'use client';

import * as React from 'react';
import {
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Ban,
  Clock,
  Layers,
  Search,
  ArrowUpDown,
  CheckCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  VerificationItem,
  VerificationStatus,
  ArchitecturalElementType,
} from '@/lib/types/architectural';
import { cn } from '@/lib/utils';

export interface ReviewQueueProps {
  items: VerificationItem[];
  selectedElementId: string | null;
  onSelectItem: (item: VerificationItem) => void;
  onVerifyAll?: () => void;
  className?: string;
}

export function ReviewQueue({
  items,
  selectedElementId,
  onSelectItem,
  onVerifyAll,
  className,
}: ReviewQueueProps) {
  // Filter States (Section 53)
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<'PRIORITY' | 'ID' | 'TYPE'>('PRIORITY');

  // Filter & Sort Items
  const filteredItems = React.useMemo(() => {
    return items
      .filter((item) => {
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
        if (categoryFilter !== 'ALL' && item.elementType !== categoryFilter) return false;
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase();
          const matchId = item.elementId.toLowerCase().includes(q);
          const matchReason = item.reviewReason?.toLowerCase().includes(q);
          const matchType = item.elementType.toLowerCase().includes(q);
          if (!matchId && !matchReason && !matchType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRIORITY') {
          // Unreviewed first, priority items first
          if (a.status === 'UNREVIEWED' && b.status !== 'UNREVIEWED') return -1;
          if (a.status !== 'UNREVIEWED' && b.status === 'UNREVIEWED') return 1;
          if (a.isPriorityReview && !b.isPriorityReview) return -1;
          if (!a.isPriorityReview && b.isPriorityReview) return 1;
          return a.elementId.localeCompare(b.elementId);
        }
        if (sortBy === 'ID') {
          return a.elementId.localeCompare(b.elementId);
        }
        if (sortBy === 'TYPE') {
          return a.elementType.localeCompare(b.elementType);
        }
        return 0;
      });
  }, [items, statusFilter, categoryFilter, searchQuery, sortBy]);

  // Quick Counts for Status Tabs
  const counts = React.useMemo(() => {
    let unreviewed = 0;
    let confirmed = 0;
    let edited = 0;
    let rejected = 0;
    items.forEach((item) => {
      if (item.status === 'UNREVIEWED') unreviewed++;
      else if (item.status === 'CONFIRMED') confirmed++;
      else if (item.status === 'EDITED') edited++;
      else if (item.status === 'REJECTED') rejected++;
    });
    return { unreviewed, confirmed, edited, rejected, total: items.length };
  }, [items]);

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs flex flex-col', className)}>
      {/* Header Bar */}
      <CardHeader className="py-3 px-4 border-b border-axis-border/80 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <ListFilter className="w-3.5 h-3.5 text-axis-accent" />
          <CardTitle className="text-xs font-semibold tracking-wider uppercase text-axis-text-primary">
            Review Queue
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-mono text-[10px] text-axis-text-muted">
            <span className="font-semibold text-axis-accent">{counts.unreviewed}</span> rem / {counts.total}
          </div>
          {onVerifyAll && counts.unreviewed > 0 && (
            <button
              type="button"
              onClick={onVerifyAll}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              title="Verify and confirm all remaining elements at once"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Verify All</span>
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2.5 flex-1 flex flex-col min-h-0">
        {/* Search & Sort Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-axis-text-muted" />
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-axis-surface-subtle border border-axis-border rounded text-axis-text-primary placeholder:text-axis-text-muted focus:outline-none focus:ring-1 focus:ring-axis-accent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-mono bg-axis-surface-subtle border border-axis-border rounded px-2 py-1 text-axis-text-primary focus:outline-none focus:ring-1 focus:ring-axis-accent shrink-0"
          >
            <option value="PRIORITY">Sort: Priority</option>
            <option value="ID">Sort: ID</option>
            <option value="TYPE">Sort: Type</option>
          </select>
        </div>

        {/* Status Filter Tabs (Section 53) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono border-b border-axis-border/60">
          {[
            { key: 'ALL', label: 'ALL', count: counts.total },
            { key: 'UNREVIEWED', label: 'UNREVIEWED', count: counts.unreviewed },
            { key: 'CONFIRMED', label: 'CONFIRMED', count: counts.confirmed },
            { key: 'EDITED', label: 'EDITED', count: counts.edited },
            { key: 'REJECTED', label: 'REJECTED', count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                'px-2 py-0.5 rounded whitespace-nowrap transition-colors border',
                statusFilter === tab.key
                  ? 'bg-axis-accent/15 text-axis-accent border-axis-accent/40 font-semibold'
                  : 'bg-transparent text-axis-text-secondary border-transparent hover:bg-axis-surface'
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Category Pills (Section 53) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
          {['ALL', 'WALL', 'DOOR', 'WINDOW', 'ROOM', 'STAIR', 'COLUMN'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-1.5 py-0.2 rounded transition-colors uppercase tracking-wider',
                categoryFilter === cat
                  ? 'bg-axis-surface-active text-axis-text-primary font-bold border border-axis-border'
                  : 'text-axis-text-muted hover:text-axis-text-primary hover:bg-axis-surface'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Queue Items Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[380px]">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-axis-text-muted text-xs">
              No architectural elements match current filters.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedElementId === item.elementId;
              const isConfirmed = item.status === 'CONFIRMED';
              const isEdited = item.status === 'EDITED';
              const isRejected = item.status === 'REJECTED';
              const isUnreviewed = item.status === 'UNREVIEWED';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(item)}
                  aria-pressed={isSelected}
                  className={cn(
                    'w-full flex items-start justify-between p-2.5 rounded text-left transition-all border group focus:outline-none focus:ring-1 focus:ring-axis-accent',
                    isSelected
                      ? 'bg-axis-accent/10 border-axis-accent shadow-axis-xs'
                      : 'bg-axis-surface-subtle/50 border-axis-border/70 hover:bg-axis-surface hover:border-axis-border'
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Index Sequence Number */}
                    <span className="font-mono text-[10px] text-axis-text-muted shrink-0 mt-0.5 w-4 text-right">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'font-mono text-xs font-semibold tracking-tight',
                            isSelected ? 'text-axis-accent font-bold' : 'text-axis-text-primary'
                          )}
                        >
                          {item.elementId}
                        </span>
                        <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-axis-surface text-axis-text-muted border border-axis-border/60">
                          {item.elementType}
                        </span>
                        {item.isPriorityReview && isUnreviewed && (
                          <span className="font-mono text-[9px] text-amber-700 font-bold uppercase tracking-wider">
                            ★ PRIORITY
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-axis-text-secondary truncate max-w-[210px] leading-tight">
                        {item.reviewReason || 'Validation required'}
                      </p>
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <span
                    className={cn(
                      'font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border shrink-0 ml-2 tracking-wider',
                      isConfirmed && 'bg-status-verified-bg text-status-verified-dot border-status-verified-border',
                      isEdited && 'bg-axis-accent/15 text-axis-accent border-axis-accent/30',
                      isRejected && 'bg-red-500/10 text-red-600 border-red-500/30',
                      isUnreviewed && 'bg-amber-100 text-amber-800 border-amber-300'
                    )}
                  >
                    {isUnreviewed ? (item.isPriorityReview ? 'REVIEW REQUIRED' : 'UNREVIEWED') : item.status}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
