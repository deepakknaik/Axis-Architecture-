/**
 * Features: Architectural AI Assistant Foundation
 * 
 * Future conversational interface providing structural analysis,
 * code compliance checks, and blueprint interpretation summaries.
 */

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  referencedElementIds?: string[];
}

export interface AIAssistantContext {
  projectId: string;
  currentFloorId?: string;
  selectedElementId?: string;
}
