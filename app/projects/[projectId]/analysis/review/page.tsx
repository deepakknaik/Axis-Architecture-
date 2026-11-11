'use client';

import * as React from 'react';
import { AnalysisWorkspaceView } from '@/components/blueprint/analysis-workspace-view';

export default function ReviewNestedPage({
  params,
}: {
  params: { projectId: string };
}) {
  return <AnalysisWorkspaceView projectId={params.projectId} initialMode="review" />;
}
