
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

// Save handler options
export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
  skipVersioning?: boolean;
  createVersion?: boolean;
}

// Document operation handler props
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId: string | null;
  sourceId: string | null;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string) => Promise<DocumentOperationResult>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Props for the publish handler
export interface UsePublishHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  saveDraft: (options?: SaveHandlerOptions) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string) => Promise<DocumentOperationResult>;
  onPublish: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Document lifecycle props
export interface UseDocumentLifecycleProps {
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Main markdown editor props
export interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}
