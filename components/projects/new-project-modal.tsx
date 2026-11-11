'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, Check, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Project, BuildingType } from '@/lib/types/architectural';
import { useAxisProjectStore } from '@/store/project-store';
import { useProjectWorkflowStore } from '@/store/project-workflow-store';
import { ROUTES } from '@/lib/constants/navigation';

export interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const router = useRouter();
  const addProject = useAxisProjectStore((s) => s.addProject);
  const projects = useAxisProjectStore((s) => s.projects);

  // Form State
  const [title, setTitle] = React.useState('');
  const [buildingType, setBuildingType] = React.useState<BuildingType>('Residential');
  const [unitSystem, setUnitSystem] = React.useState<'METRIC' | 'IMPERIAL'>('METRIC');
  const [description, setDescription] = React.useState('');
  const [floorsCount, setFloorsCount] = React.useState(2);

  // Validation & Loading
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setBuildingType('Residential');
      setUnitSystem('METRIC');
      setDescription('');
      setFloorsCount(2);
      setError('');
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a project name.');
      return;
    }

    // Check duplicate name within local project set
    const duplicate = projects.some(
      (p) => p.title.toLowerCase() === trimmedTitle.toLowerCase() && p.status !== 'ARCHIVED'
    );
    if (duplicate) {
      setError('A project with this title already exists. Please choose a unique name.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Controlled brief prototype creation transition
    setTimeout(() => {
      const generatedId = `proj_${trimmedTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

      // Pick matching thumbnail variant based on building type
      const thumbnailVariant =
        buildingType === 'Commercial'
          ? 'office'
          : buildingType === 'Office'
          ? 'office'
          : buildingType === 'Other'
          ? 'urban'
          : 'villa';

      const newProject: Project = {
        id: generatedId,
        title: trimmedTitle,
        codeName: trimmedTitle.slice(0, 6).toUpperCase(),
        description: description.trim() || undefined,
        buildingType,
        floorsCount,
        status: 'READY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastModified: 'Just now',
        thumbnailVariant,
        blueprints: [],
        settings: {
          defaultScaleUnit: unitSystem,
          standardWallHeight: 3.0,
          standardWallThickness: 0.2,
          gridSnapIncrement: 0.05,
          autoDetectOpenings: true,
        },
      };

      addProject(newProject);
      // Initialize workflow state with UPLOAD AVAILABLE and later stages LOCKED (Section 05)
      useProjectWorkflowStore.getState().initProjectWorkflow(newProject, false);
      setIsLoading(false);
      setIsSuccess(true);

      // Navigate to project's blueprint upload workspace
      setTimeout(() => {
        onClose();
        router.push(ROUTES.PROJECTS.BLUEPRINT(generatedId));
      }, 400);
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Initialize architectural project metadata and spatial parameters."
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading || isSuccess}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || isSuccess}
          >
            {isSuccess ? 'Project Created' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="p-3 rounded-axis-xs bg-status-failed-bg border border-status-failed-border text-status-failed-text text-xs flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Name Field */}
        <div>
          <label
            htmlFor="projectName"
            className="block text-xs font-medium text-axis-text-primary mb-1.5"
          >
            Project Name <span className="text-axis-accent">*</span>
          </label>
          <Input
            id="projectName"
            required
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Residence 01"
            disabled={isLoading || isSuccess}
          />
        </div>

        {/* Building Type & Unit System Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="buildingType"
              className="block text-xs font-medium text-axis-text-primary mb-1.5"
            >
              Building Type <span className="text-axis-accent">*</span>
            </label>
            <Select
              id="buildingType"
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value as BuildingType)}
              disabled={isLoading || isSuccess}
              options={[
                { label: 'Residential', value: 'Residential' },
                { label: 'Commercial', value: 'Commercial' },
                { label: 'Office', value: 'Office' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </div>

          <div>
            <label
              htmlFor="unitSystem"
              className="block text-xs font-medium text-axis-text-primary mb-1.5"
            >
              Measurement Units
            </label>
            <Select
              id="unitSystem"
              value={unitSystem}
              onChange={(e) => setUnitSystem(e.target.value as 'METRIC' | 'IMPERIAL')}
              disabled={isLoading || isSuccess}
              options={[
                { label: 'Metric (m)', value: 'METRIC' },
                { label: 'Imperial (ft)', value: 'IMPERIAL' },
              ]}
            />
          </div>
        </div>

        {/* Estimated Floors Count */}
        <div>
          <label
            htmlFor="floorsCount"
            className="block text-xs font-medium text-axis-text-primary mb-1.5"
          >
            Planned Story / Floor Levels
          </label>
          <Select
            id="floorsCount"
            value={floorsCount}
            onChange={(e) => setFloorsCount(Number(e.target.value))}
            disabled={isLoading || isSuccess}
            options={[
              { label: '1 Floor (Single Level)', value: 1 },
              { label: '2 Floors', value: 2 },
              { label: '3 Floors', value: 3 },
              { label: '4 Floors', value: 4 },
              { label: '5+ Floors', value: 5 },
            ]}
          />
        </div>

        {/* Optional Description */}
        <div>
          <label
            htmlFor="projectDescription"
            className="block text-xs font-medium text-axis-text-primary mb-1.5"
          >
            Project Description (Optional)
          </label>
          <textarea
            id="projectDescription"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the architectural project..."
            disabled={isLoading || isSuccess}
            className="flex w-full rounded-axis-xs border border-axis-border bg-axis-bg-elevated px-3 py-2 text-xs text-axis-text-primary shadow-axis-xs placeholder:text-axis-text-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent focus-visible:border-axis-accent resize-none disabled:opacity-50"
          />
        </div>

        <div className="pt-2 text-[11px] text-axis-text-muted/80 font-mono flex items-center justify-between border-t border-axis-border/60">
          <span>SPEC: AXIS-PARAMETRIC-V1</span>
          <span>DATUM: +0.000m</span>
        </div>
      </form>
    </Modal>
  );
}
