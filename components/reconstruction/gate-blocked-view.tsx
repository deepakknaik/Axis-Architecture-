'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReconstructionGateResult } from '@/lib/reconstruction/types';

export interface GateBlockedViewProps {
  projectId: string;
  gateResult: ReconstructionGateResult;
  onAutoVerifyAndContinue?: () => void;
}

export function GateBlockedView({
  projectId,
  gateResult,
  onAutoVerifyAndContinue,
}: GateBlockedViewProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <Card className="border-amber-300/80 bg-amber-50/40 shadow-sm">
        <CardHeader className="border-b border-amber-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-stone-900 tracking-tight">
                Reconstruction Gate Active — Verification Required
              </CardTitle>
              <p className="text-xs text-stone-600 mt-0.5">
                Strict Architectural Data Boundary (Section 02 & 03)
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-5 text-sm">
          <div className="p-4 rounded-md bg-white border border-amber-200 text-stone-800 space-y-2">
            <p className="font-medium text-stone-900 leading-snug">
              {gateResult.reason}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              To prevent hallucinated geometry, the 3D Reconstruction Engine only consumes
              human-verified architectural primitives. Unreviewed or uncertain detections must be
              validated before real-scale extrusion can proceed.
            </p>
          </div>

          {/* Gate Metric Status Breakdown */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded bg-white border border-stone-200">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Verified Elements</span>
              <span className="text-lg font-mono font-bold text-stone-900">
                {gateResult.totalVerified}
              </span>
            </div>
            <div className="p-3 rounded bg-white border border-stone-200">
              <span className="text-[10px] font-mono uppercase text-amber-700 block">Requires Review</span>
              <span className="text-lg font-mono font-bold text-amber-600">
                {gateResult.unresolvedCount}
              </span>
            </div>
            <div className="p-3 rounded bg-white border border-stone-200">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Scale Metric Status</span>
              <span className="text-xs font-mono font-bold text-stone-800 mt-1 block">
                {gateResult.scaleStatus}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-amber-200/60">
            <Link href={`/projects/${projectId}/analysis?mode=review`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                leftIcon={<FileCheck className="w-4 h-4" />}
                className="w-full text-xs font-medium"
              >
                Go to Human Verification Review
              </Button>
            </Link>

            {onAutoVerifyAndContinue && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAutoVerifyAndContinue}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                className="w-full sm:w-auto text-xs"
              >
                Approve Detections & Launch 3D
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
