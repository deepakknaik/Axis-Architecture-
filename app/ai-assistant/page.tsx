import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageContainer } from '@/components/layout/page-container';

export default function AiAssistantPage() {
  return (
    <PageContainer maxWidth="narrow" className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-axis-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-medium tracking-tight text-axis-text-primary">
              AI Spatial Assistant
            </h1>
            <StatusBadge status="READY" size="sm" />
          </div>
          <p className="text-xs text-axis-text-secondary mt-1">
            Intelligent building code verification, spatial queries, and structural assistance.
          </p>
        </div>
      </div>

      <Card className="bg-axis-bg-elevated border-axis-border shadow-axis-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-axis-accent" />
              AI Assistant Shell Route
            </CardTitle>
            <span className="font-mono text-[10px] text-axis-text-muted uppercase">
              MODULE / AI-01
            </span>
          </div>
          <CardDescription>
            Conversational spatial reasoning and building compliance engine scheduled for Part 05.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-axis-xs bg-axis-surface/40 border border-axis-border text-xs text-axis-text-secondary space-y-2">
            <div className="flex items-center gap-2 font-mono text-axis-text-primary">
              <Terminal className="w-3.5 h-3.5 text-axis-accent" />
              <span>CONTRACT INTERFACE: features/ai-assistant/index.ts</span>
            </div>
            <p>
              Data contracts for AIAssistantMessage and spatial context queries are pre-configured.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
