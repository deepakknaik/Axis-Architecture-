'use client';

import * as React from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { ProjectFilters, SortOption } from '@/components/projects/project-filters';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectEmptyState } from '@/components/projects/project-empty-state';
import { NewProjectModal } from '@/components/projects/new-project-modal';
import { useAxisProjectStore } from '@/store/project-store';
import { Project } from '@/lib/types/architectural';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const projects = useAxisProjectStore((s) => s.projects);

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('All');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [sortBy, setSortBy] = React.useState<SortOption>('modified');

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedStatus('ALL');
    setSortBy('modified');
  };

  // Filter & Sort Logic
  const filteredProjects = React.useMemo(() => {
    return projects
      .filter((p) => {
        // Exclude archived projects from primary library
        if (p.status === 'ARCHIVED') return false;

        // Search Query (title or buildingType or description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchType = p.buildingType?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchType && !matchDesc) return false;
        }

        // Building Type Filter
        if (selectedType !== 'All') {
          if (p.buildingType !== selectedType) return false;
        }

        // Status Filter
        if (selectedStatus !== 'ALL') {
          if (p.status !== selectedStatus) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'status':
            return a.status.localeCompare(b.status);
          case 'modified':
          default:
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
  }, [projects, searchQuery, selectedType, selectedStatus, sortBy]);

  return (
    <PageContainer maxWidth="default" className="space-y-6">
      {/* 1. Projects Library Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-axis-border gap-4 select-none">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-axis-text-muted uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-axis-accent" />
            <span>PROJECT LIBRARY</span>
            <span>·</span>
            <span>REPOSITORY / 01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-axis-text-primary">
            Architectural Projects
          </h1>
          <p className="text-xs sm:text-sm text-axis-text-secondary mt-1">
            All architectural floor plans, spatial reconstructions, and building repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
            className="shadow-axis-sm"
          >
            New Project
          </Button>
        </div>
      </div>

      {/* 2. Interactive Filter & Search Controls Bar */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalMatches={filteredProjects.length}
      />

      {/* 3. Projects Grid or Architectural Empty State */}
      {filteredProjects.length > 0 ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <ProjectEmptyState
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
        />
      )}

      {/* 4. New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageContainer>
  );
}
