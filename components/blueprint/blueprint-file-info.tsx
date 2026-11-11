'use client';

import * as React from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Compass,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatShortChecksum } from '@/lib/blueprint/checksum';
import { cn } from '@/lib/utils';

export interface BlueprintFileInfoProps {
  file: File;
  sanitizedFilename: string;
  sizeFormatted: string;
  checksumSHA256?: string;
  dimensions?: { width: number; height: number } | null;
  projectUnits?: 'METRIC' | 'IMPERIAL';
  onRemove: () => void;
  onReplace: () => void;
  onIngest: () => void;
  isIngesting?: boolean;
  className?: string;
}

export function BlueprintFileInfo({
  file,
  sanitizedFilename,
  sizeFormatted,
  checksumSHA256,
  dimensions,
  projectUnits = 'METRIC',
  onRemove,
  onReplace,
  onIngest,
  isIngesting = false,
  className,
}: BlueprintFileInfoProps) {
  const [copiedHash, setCopiedHash] = React.useState(false);

  const handleCopyChecksum = () => {
    if (!checksumSHA256) return;
    navigator.clipboard.writeText(checksumSHA256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const extension = sanitizedFilename.slice(sanitizedFilename.lastIndexOf('.')).toUpperCase();

  return (
    <Card className={cn('bg-axis-bg-elevated border-axis-border shadow-axis-xs flex flex-col justify-between', className)}>
      <div>
        <CardHeader className="pb-3 border-b border-axis-border/80">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-axis-text-muted uppercase tracking-wider">
              BLUEPRINT SPECIFICATION
            </span>
            <Badge variant="accent" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
              VALIDATED
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold tracking-tight text-axis-text-primary break-all pt-1">
            {sanitizedFilename}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Metadata Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">File Format</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {extension.replace('.', '')} DOCUMENT
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Source Size</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {sizeFormatted}
              </span>
            </div>

            {dimensions && (
              <div className="flex items-center justify-between py-1.5 border-b border-axis-border/60">
                <span className="text-axis-text-secondary">Pixel Canvas</span>
                <span className="font-mono font-medium text-axis-text-primary">
                  {dimensions.width} × {dimensions.height} px
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Project Units</span>
              <span className="font-mono font-medium text-axis-text-primary">
                {projectUnits === 'METRIC' ? 'METRIC (m)' : 'IMPERIAL (ft)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Blueprint Units</span>
              <span className="font-mono text-[11px] text-axis-text-muted">
                NOT YET RESOLVED
              </span>
            </div>

            {/* Cryptographic SHA-256 Checksum Item */}
            <div className="py-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-axis-text-secondary flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-status-verified-dot" />
                  <span>SHA-256 Checksum</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyChecksum}
                  className="font-mono text-[10px] text-axis-accent hover:underline inline-flex items-center gap-1 focus-visible:outline-none"
                  title="Copy full cryptographic digest"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-status-completed-dot" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2 rounded bg-axis-surface/60 border border-axis-border/80 font-mono text-[11px] text-axis-text-primary select-all break-all">
                {checksumSHA256 ? formatShortChecksum(checksumSHA256, 12, 12) : 'Computing digest...'}
              </div>
            </div>
          </div>

          {/* Architectural Preservation Note */}
          <div className="p-3 rounded-axis-xs bg-axis-surface/40 border border-axis-border/80 text-[11px] text-axis-text-secondary leading-relaxed space-y-1">
            <span className="font-mono text-[9px] font-semibold text-axis-accent uppercase tracking-wider block">
              SOURCE PRESERVED
            </span>
            <p>
              AXIS does not modify the original blueprint during ingestion. All future vector interpretations operate on derived representations.
            </p>
          </div>
        </CardContent>
      </div>

      {/* Action Controls Footer */}
      <div className="p-5 pt-3 border-t border-axis-border/80 space-y-3">
        <Button
          variant="primary"
          size="md"
          className="w-full justify-center shadow-axis-xs text-sm"
          onClick={onIngest}
          isLoading={isIngesting}
          disabled={isIngesting || !checksumSHA256}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isIngesting ? 'Ingesting Blueprint...' : 'Ingest Blueprint'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReplace}
            disabled={isIngesting}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Replace
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            disabled={isIngesting}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
}
