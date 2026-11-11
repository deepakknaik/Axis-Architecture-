/**
 * AXIS ARCHITECTURE — Route Architecture Constants
 */

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: '/dashboard',
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (projectId: string) => `/projects/${projectId}`,
    BLUEPRINT: (projectId: string) => `/projects/${projectId}/blueprint`,
    ANALYSIS: (projectId: string) => `/projects/${projectId}/analysis`,
    REVIEW: (projectId: string) => `/projects/${projectId}/analysis?mode=review`,
    WORKSPACE: (projectId: string) => `/projects/${projectId}/workspace`,
  },
  BLUEPRINT_ENGINE: '/projects/proj_axis_demo_01/blueprint',
  WORKSPACE_3D: '/projects/proj_axis_demo_01/workspace',
  AI_ASSISTANT: '/ai-assistant',
  TEMPLATES: '/templates',
  SETTINGS: '/settings',
  HELP: '/help',
} as const;

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Overview',
    href: ROUTES.HOME,
  },
  {
    label: 'Projects',
    href: ROUTES.PROJECTS.LIST,
  },
  {
    label: 'Design System',
    href: '/#design-system',
  },
];

/**
 * Check if a given pathname belongs to the authenticated application shell
 */
export function isAuthenticatedRoute(pathname: string): boolean {
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/login/')) {
    return false;
  }
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/projects' ||
    pathname.startsWith('/projects/') ||
    pathname === '/blueprint' ||
    pathname.startsWith('/blueprint/') ||
    pathname === '/workspace' ||
    pathname.startsWith('/workspace/') ||
    pathname === '/ai-assistant' ||
    pathname.startsWith('/ai-assistant/') ||
    pathname === '/templates' ||
    pathname.startsWith('/templates/') ||
    pathname === '/settings' ||
    pathname.startsWith('/settings/') ||
    pathname === '/help' ||
    pathname.startsWith('/help/')
  );
}
