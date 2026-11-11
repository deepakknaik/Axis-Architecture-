import React from 'react';
import { Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';

export default function TemplatesPage() {
  return (
    <PageContainer maxWidth="narrow" className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-axis-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium tracking-tight text-axis-text-primary">
              Architectural Templates
            </h1>
            <StatusBadge status="READY" size="sm" />
          </div>
          <p className="text-xs text-axis-text-secondary mt-1">
            Pre-calibrated residential, commercial, and structural plan presets.
          </p>
        </div>
      </div>

      <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4 text-axis-accent" />
            Studio Template Library
          </CardTitle>
          <CardDescription>
            Custom blueprint scale calibrations and zoning presets will be maintained here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-axis-text-secondary">
            Standard ISO 1:50, 1:100, and ANSI architectural templates configured.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
