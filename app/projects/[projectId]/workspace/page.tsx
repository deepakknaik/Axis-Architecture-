'use client';

import * as React from 'react';
import { WorkspaceView } from '@/components/reconstruction/workspace-view';

export default function ProjectWorkspacePage({
  params,
}: {
  params: { projectId: string };
}) {
  return <WorkspaceView projectId={params.projectId} />;
}
