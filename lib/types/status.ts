/**
 * AXIS ARCHITECTURE — Standard Processing & Workflow Status System
 * 
 * Provides unified status definitions for blueprints, detections,
 * 3D meshing, and general pipeline stages.
 */

export type AxisStatusType =
  | 'READY'
  | 'PROCESSING'
  | 'ANALYZING'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'GENERATING'
  | 'COMPLETED'
  | 'FAILED';

export interface StatusConfig {
  label: string;
  description: string;
  badgeClass: string;
  dotClass: string;
  iconName: string;
}

export type StatusConfigMap = Record<AxisStatusType, StatusConfig>;
