'use client';

import * as React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { ProcessingPanel } from '@/components/dashboard/processing-panel';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { NewProjectModal } from '@/components/projects/new-project-modal';
import { useAxisProjectStore } from '@/store/project-store';

export default function DashboardPage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = React.useState(false);
  const projects = useAxisProjectStore((s) => s.projects);

  return (
    <PageContainer maxWidth="default" className="space-y-8">
      {/* 1. Dashboard Hero Header */}
      <DashboardHero
        onNewProject={() => setIsNewProjectModalOpen(true)}
        userName="Deepak"
      />

      {/* 2. Key Summary KPI Metrics */}
      <DashboardStats projects={projects} />

      {/* 3. Recent Projects Preview Section */}
      <RecentProjects projects={projects} />

      {/* 4. Active Pipeline Processing & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <ProcessingPanel />
        <ActivityTimeline />
      </div>

      {/* New Project Creation Flow Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </PageContainer>
  );
}
