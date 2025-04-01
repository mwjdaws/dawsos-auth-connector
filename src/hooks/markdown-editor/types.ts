
/**
 * Types for Markdown Editor functionality
 */

// Base document types
export interface DocumentMetadata {
  id?: string;
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  sourceId?: string | null;
}

// Content state management
export interface ContentState {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  isDirty: boolean;
  isPublished: boolean;
  lastSavedTitle: string;
  lastSavedContent: string;
  lastSavedExternalSourceUrl: string;
}

// Props for the MarkdownEditor component
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

// Props for the document operations hook
export interface DocumentOperationsProps {
  documentId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Props for the document operation handlers
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId?: string | null;
  sourceId?: string | null;
  saveDraft: (options?: SaveHandlerOptions) => Promise<string | null>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Options for save handler
export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
  showToast?: boolean;
  suppressValidation?: boolean;
}

// Props for publish handler
export interface UsePublishHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  saveDraft: (options?: SaveHandlerOptions) => Promise<string | null>;
  publishDocument: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => Promise<boolean>;
  onPublish: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
}

// Props for document lifecycle operations
export interface UseDocumentLifecycleProps {
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

// Re-export ontology types
export type { OntologyTerm, RelatedTerm } from '@/types/ontology';
