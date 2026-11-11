import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';

export default function HelpPage() {
  return (
    <PageContainer maxWidth="narrow" className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-axis-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium tracking-tight text-axis-text-primary">
              Help & Documentation
            </h1>
            <StatusBadge status="READY" size="sm" />
          </div>
          <p className="text-xs text-axis-text-secondary mt-1">
            Spatial reconstruction reference manuals, scale calibration guides, and keyboard shortcuts.
          </p>
        </div>
      </div>

      <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-axis-accent" />
            AXIS Technical Documentation
          </CardTitle>
          <CardDescription>
            Reference specification for 2D-to-3D geometric extrusion and human verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-axis-text-secondary">
            Calibration guidelines and CAD drawing standards are available for authorized studio staff.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
