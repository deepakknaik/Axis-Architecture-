import { create } from 'zustand';
import {
  Project,
  Blueprint,
  BlueprintAnalysis,
  VerificationItem,
  BlueprintVerification,
  BuildingModel,
  BuildingFloor,
  ArchitecturalElement,
} from '@/lib/types/architectural';
import { AxisStatusType } from '@/lib/types/status';
import { INITIAL_MOCK_PROJECTS } from '@/lib/constants/projects-data';

export interface Viewer3DState {
  viewMode: 'ORBIT' | 'TOP_DOWN' | 'FIRST_PERSON' | 'ISOMETRIC';
  showWireframe: boolean;
  showDimensions: boolean;
  showGrid: boolean;
  sliceFloorOnly: boolean;
  ambientOcclusion: boolean;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
}

export interface AxisProjectStoreState {
  // Projects Library State (Part 04)
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  archiveProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  setProjectBlueprint: (projectId: string, blueprint: Blueprint) => void;

  // Active Project Context (Part 01)
  currentProject: Project | null;
  currentBlueprint: Blueprint | null;
  analysisResult: BlueprintAnalysis | null;
  verificationItems: VerificationItem[];
  buildingModel: BuildingModel | null;

  // Selection & Workspace State
  selectedFloor: BuildingFloor | null;
  selectedElement: ArchitecturalElement | null;
  selectedVerificationItem: VerificationItem | null;

  // Verification Domain State (Part 07)
  blueprintVerifications: Record<string, BlueprintVerification>;
  currentVerification: BlueprintVerification | null;
  setCurrentVerification: (verification: BlueprintVerification | null) => void;
  setBlueprintVerification: (blueprintId: string, verification: BlueprintVerification) => void;
  getBlueprintVerification: (blueprintId: string) => BlueprintVerification | undefined;

  // Viewport & Rendering State
  viewerState: Viewer3DState;

  // System Pipeline Processing State
  processingState: {
    status: AxisStatusType;
    stepMessage: string;
    progressPercent: number;
    error: string | null;
  };

  // Foundational Store Actions
  setCurrentProject: (project: Project | null) => void;
  setCurrentBlueprint: (blueprint: Blueprint | null) => void;
  setAnalysisResult: (analysis: BlueprintAnalysis | null) => void;
  setVerificationItems: (items: VerificationItem[]) => void;
  updateVerificationItem: (id: string, updates: Partial<VerificationItem>) => void;
  setBuildingModel: (model: BuildingModel | null) => void;
  setSelectedFloor: (floor: BuildingFloor | null) => void;
  setSelectedElement: (element: ArchitecturalElement | null) => void;
  setSelectedVerificationItem: (item: VerificationItem | null) => void;
  setViewerState: (updates: Partial<Viewer3DState>) => void;
  setProcessingState: (updates: Partial<AxisProjectStoreState['processingState']>) => void;
  resetProjectState: () => void;
}

const initialViewerState: Viewer3DState = {
  viewMode: 'ISOMETRIC',
  showWireframe: false,
  showDimensions: true,
  showGrid: true,
  sliceFloorOnly: false,
  ambientOcclusion: true,
  cameraPosition: [15, 20, 15],
  targetPosition: [0, 0, 0],
};

const initialProcessingState: AxisProjectStoreState['processingState'] = {
  status: 'READY',
  stepMessage: 'Awaiting architectural plan',
  progressPercent: 0,
  error: null,
};

// Safe helper to read stored projects or fall back to initial mock records
function getInitialProjects(): Project[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('axis_projects_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_MOCK_PROJECTS to ensure catalog projects always have their source blueprints
          return parsed.map((p: Project) => {
            const initial = INITIAL_MOCK_PROJECTS.find((m) => m.id === p.id);
            if (initial && (!p.blueprints || p.blueprints.length === 0)) {
              return { ...p, blueprints: initial.blueprints, status: initial.status };
            }
            return p;
          });
        }
      }
    } catch {
      // Fallback if parsing fails
    }
  }
  return INITIAL_MOCK_PROJECTS;
}

// Safe helper to persist projects
function saveProjects(projects: Project[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('axis_projects_v1', JSON.stringify(projects));
    } catch {
      // Ignore quota errors in private browsing
    }
  }
}

// Safe helpers to persist verifications (Part 07 - without storing binaries)
function getInitialVerifications(): Record<string, BlueprintVerification> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('axis_verifications_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
  }
  return {};
}

function saveVerifications(verifications: Record<string, BlueprintVerification>) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('axis_verifications_v1', JSON.stringify(verifications));
    } catch {
      // Ignore quota errors
    }
  }
}

export const useAxisProjectStore = create<AxisProjectStoreState>((set, get) => ({
  // Projects Library State
  projects: getInitialProjects(),

  setProjects: (projects) => {
    saveProjects(projects);
    set({ projects });
  },

  addProject: (newProject) => {
    set((state) => {
      const updated = [newProject, ...state.projects];
      saveProjects(updated);
      return { projects: updated };
    });
  },

  updateProject: (id, updates) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      saveProjects(updated);
      return { projects: updated };
    });
  },

  archiveProject: (id) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id ? { ...p, status: 'ARCHIVED' as const } : p
      );
      saveProjects(updated);
      return { projects: updated };
    });
  },

  getProjectById: (id: string) => {
    return get().projects.find((p) => p.id === id);
  },

  setProjectBlueprint: (projectId: string, blueprint: Blueprint) => {
    set((state) => {
      const updated = state.projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            blueprints: [blueprint, ...(p.blueprints || []).filter((b) => b.id !== blueprint.id)],
            status: 'ANALYSIS' as const,
            updatedAt: new Date().toISOString(),
            lastModified: 'Just now',
          };
        }
        return p;
      });
      saveProjects(updated);
      return {
        projects: updated,
        currentBlueprint: blueprint,
      };
    });
  },

  // Active Context State (Part 01 Foundation)
  currentProject: null,
  currentBlueprint: null,
  analysisResult: null,
  verificationItems: [],
  buildingModel: null,
  selectedFloor: null,
  selectedElement: null,
  selectedVerificationItem: null,
  viewerState: initialViewerState,
  processingState: initialProcessingState,

  // Verification Domain State (Part 07)
  blueprintVerifications: getInitialVerifications(),
  currentVerification: null,

  setCurrentVerification: (verification) => set({ currentVerification: verification }),

  setBlueprintVerification: (blueprintId, verification) => {
    set((state) => {
      const updated = {
        ...state.blueprintVerifications,
        [blueprintId]: verification,
      };
      saveVerifications(updated);
      return {
        blueprintVerifications: updated,
        currentVerification: state.currentVerification?.blueprintId === blueprintId ? verification : state.currentVerification,
      };
    });
  },

  getBlueprintVerification: (blueprintId) => {
    return get().blueprintVerifications[blueprintId];
  },

  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentBlueprint: (blueprint) => set({ currentBlueprint: blueprint }),
  setAnalysisResult: (analysis) => set({ analysisResult: analysis }),
  setVerificationItems: (items) => set({ verificationItems: items }),

  updateVerificationItem: (id, updates) =>
    set((state) => ({
      verificationItems: state.verificationItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  setBuildingModel: (model) => set({ buildingModel: model }),
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setSelectedVerificationItem: (item) => set({ selectedVerificationItem: item }),

  setViewerState: (updates) =>
    set((state) => ({
      viewerState: { ...state.viewerState, ...updates },
    })),

  setProcessingState: (updates) =>
    set((state) => ({
      processingState: { ...state.processingState, ...updates },
    })),

  resetProjectState: () =>
    set({
      currentProject: null,
      currentBlueprint: null,
      analysisResult: null,
      verificationItems: [],
      buildingModel: null,
      selectedFloor: null,
      selectedElement: null,
      selectedVerificationItem: null,
      viewerState: initialViewerState,
      processingState: initialProcessingState,
    }),
}));
