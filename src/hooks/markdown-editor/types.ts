
/**
 * Types for markdown editor
 */

// Type for save draft handler options
export interface SaveHandlerOptions {
  /**
   * Whether this is a manual save initiated by the user
   */
  isManualSave?: boolean;
  
  /**
   * Whether this is an autosave
   */
  isAutoSave?: boolean;
}

// Type for draft operation results
export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

// Type for publish operation results
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

// Document operations context type
export interface DraftOperationsContext {
  // Function to create a version of the document
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
  
  // Function to enrich content with ontology terms
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Ontology term type
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
}

// Related term type
export interface RelatedTerm {
  id: string;
  term: string;
  relevance: number;
}

// Result type for document operations
export interface DocumentOperationResult {
  success: boolean;
  documentId: string | null; 
  error?: any;
}

// Props type for document lifecycle
export interface UseDocumentLifecycleProps {
  // Function to create a version of the document
  createVersion: (documentId: string, content: string, metadata?: any, isAutoSave?: boolean) => Promise<void>;
  
  // Function to enrich content with ontology terms (optional)
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Props for document operation handlers
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId: string | null;
  sourceId: string | null;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any, isAutoSave?: boolean) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Related note type for suggestions
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}
