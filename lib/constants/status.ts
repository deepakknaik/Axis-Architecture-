import { AxisStatusType, StatusConfigMap } from '../types/status';

export const AXIS_STATUS_CONFIG: StatusConfigMap = {
  READY: {
    label: 'Ready',
    description: 'Awaiting execution or input',
    badgeClass: 'bg-status-ready-bg border-status-ready-border text-status-ready-text',
    dotClass: 'bg-status-ready-dot',
    iconName: 'CircleCheck',
  },
  PROCESSING: {
    label: 'Processing',
    description: 'Pipeline task currently executing',
    badgeClass: 'bg-status-processing-bg border-status-processing-border text-status-processing-text',
    dotClass: 'bg-status-processing-dot animate-pulse',
    iconName: 'Loader2',
  },
  ANALYZING: {
    label: 'Analyzing',
    description: 'Blueprints parsing and vector element segmentation',
    badgeClass: 'bg-status-analyzing-bg border-status-analyzing-border text-status-analyzing-text',
    dotClass: 'bg-status-analyzing-dot animate-pulse',
    iconName: 'ScanLine',
  },
  NEEDS_REVIEW: {
    label: 'Needs Review',
    description: 'Human-in-the-loop verification required for uncertain detections',
    badgeClass: 'bg-status-review-bg border-status-review-border text-status-review-text',
    dotClass: 'bg-status-review-dot',
    iconName: 'AlertCircle',
  },
  VERIFIED: {
    label: 'Verified',
    description: 'Elements confirmed and calibrated by architect',
    badgeClass: 'bg-status-verified-bg border-status-verified-border text-status-verified-text',
    dotClass: 'bg-status-verified-dot',
    iconName: 'CheckCheck',
  },
  GENERATING: {
    label: 'Generating',
    description: 'Synthesizing dimensional 3D geometry from validated floor plans',
    badgeClass: 'bg-status-generating-bg border-status-generating-border text-status-generating-text',
    dotClass: 'bg-status-generating-dot animate-pulse',
    iconName: 'Boxes',
  },
  COMPLETED: {
    label: 'Completed',
    description: 'Reconstruction pipeline successfully finished',
    badgeClass: 'bg-status-completed-bg border-status-completed-border text-status-completed-text',
    dotClass: 'bg-status-completed-dot',
    iconName: 'Check',
  },
  FAILED: {
    label: 'Failed',
    description: 'Operation halted due to error or invalid blueprint asset',
    badgeClass: 'bg-status-failed-bg border-status-failed-border text-status-failed-text',
    dotClass: 'bg-status-failed-dot',
    iconName: 'XCircle',
  },
};
