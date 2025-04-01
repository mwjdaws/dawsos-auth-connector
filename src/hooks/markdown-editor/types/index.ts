
/**
 * Types for markdown editor components
 */

// Re-export ontology types
export * from './ontology';

// Document operation results
export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

export interface SaveDraftResult extends DocumentOperationResult {
  // Add any save-draft specific fields here
}

export interface PublishResult extends DocumentOperationResult {
  // Add any publish-specific fields here
}

export interface DraftOperationsContext {
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  error: Error | null;
  saveDraft: (title: string, content: string) => Promise<string | null>;
  reset: () => void;
}

export interface PublishOperationsContext {
  isPublishing: boolean;
  error: Error | null;
  publish: (title: string, content: string) => Promise<string | null>;
  reset: () => void;
}

// Document operations props
export interface DocumentOperationsProps {
  documentId: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}
