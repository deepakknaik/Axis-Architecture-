'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, FileText, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatShortChecksum } from '@/lib/blueprint/checksum';
import { ROUTES } from '@/lib/constants/navigation';

export interface BlueprintReadyStateProps {
  projectId: string;
  filename: string;
  fileSizeFormatted: string;
  checksumSHA256: string;
  format: string;
  onReset: () => void;
}

export function BlueprintReadyState({
  projectId,
  filename,
  fileSizeFormatted,
  checksumSHA256,
  format,
  onReset,
}: BlueprintReadyStateProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none animate-in fade-in duration-200">
      <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-md p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Success Checkmark Seal */}
          <div className="w-14 h-14 rounded-full bg-status-verified-bg border border-status-verified-border text-status-verified-dot flex items-center justify-center shadow-axis-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-axis-accent font-semibold">
                INGESTION PIPELINE COMPLETED
              </span>
              <StatusBadge status="READY" size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-axis-text-primary">
              Blueprint Ready
            </h2>
            <p className="text-xs text-axis-text-secondary max-w-md leading-relaxed mx-auto">
              The architectural source plan has been validated, cryptographically hashed, and registered in the workspace for spatial vector analysis.
            </p>
          </div>

          {/* Source Specification Summary Table */}
          <div className="w-full max-w-lg rounded-axis-sm bg-axis-surface/60 border border-axis-border/80 p-4 text-xs space-y-2.5 text-left my-2">
            <div className="flex items-center justify-between pb-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Source File</span>
              <span className="font-mono font-medium text-axis-text-primary truncate max-w-[240px]">
                {filename}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Integrity Verification</span>
              <span className="font-mono text-status-verified-text flex items-center gap-1 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHA-256 VERIFIED</span>
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">File Format</span>
              <span className="font-mono text-axis-text-primary uppercase font-medium">
                {format} DOCUMENT
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">File Size</span>
              <span className="font-mono text-axis-text-primary font-medium">
                {fileSizeFormatted}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-axis-text-secondary">Digest Hash</span>
              <span className="font-mono text-[11px] text-axis-text-muted">
                {formatShortChecksum(checksumSHA256, 10, 10)}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={ROUTES.PROJECTS.ANALYSIS(projectId)} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto px-6 shadow-axis-sm text-sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Analysis
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto"
              onClick={onReset}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Replace Blueprint
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
