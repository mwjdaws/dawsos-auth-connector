
/**
 * Types for markdown editor components
 */

// Re-export ontology types
export * from './ontology';

// Add other necessary type exports - these are placeholders for the errors
export interface SaveDraftResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

export interface DraftOperationsContext {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  error: Error | null;
  saveDraft: (title: string, content: string) => Promise<string | null>;
  reset: () => void;
}

export interface PublishResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

export interface PublishOperationsContext {
  isPublishing: boolean;
  error: Error | null;
  publish: (title: string, content: string) => Promise<string | null>;
  reset: () => void;
}

export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}
