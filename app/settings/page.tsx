import React from 'react';
import { Settings, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';

export default function SettingsPage() {
  return (
    <PageContainer maxWidth="narrow" className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-axis-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium tracking-tight text-axis-text-primary">
              Studio Settings
            </h1>
            <StatusBadge status="READY" size="sm" />
          </div>
          <p className="text-xs text-axis-text-secondary mt-1">
            Global units, CAD snap increments, scale tolerances, and team workspace preferences.
          </p>
        </div>
      </div>

      <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sliders className="w-4 h-4 text-axis-accent" />
            Architectural Units & Defaults
          </CardTitle>
          <CardDescription>
            Configured in accordance with ProjectSettings schema in lib/types/architectural.ts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Default Dimension Unit:</span>
              <span className="font-mono font-medium text-axis-text-primary">Metric (meters)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-axis-border/60">
              <span className="text-axis-text-secondary">Standard Wall Height:</span>
              <span className="font-mono font-medium text-axis-text-primary">3.00 m</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-axis-text-secondary">Default Wall Thickness:</span>
              <span className="font-mono font-medium text-axis-text-primary">0.20 m</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
