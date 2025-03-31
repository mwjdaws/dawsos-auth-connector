
/**
 * Types for markdown editor hooks
 */

export interface EditorState {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  isDirty: boolean;
  isLoading: boolean;
  error: Error | null;
  isPublished: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isLoadingTemplate: boolean;
}

export interface DocumentOperationsProps {
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface SaveHandlerOptions {
  isAutoSave?: boolean;
  isManualSave?: boolean;
}

export interface UseMarkdownEditorProps {
  initialTitle: string;
  initialContent: string;
  initialTemplateId: string | null;
  initialExternalSourceUrl: string;
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

export interface DraftOperationsContext {
  sourceId?: string | null;
  documentId?: string | null;
  userId?: string;
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

export interface UseDocumentLifecycleProps {
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

export interface PublishOperationsContext {
  sourceId?: string | null;
  documentId?: string | null;
  userId?: string;
}
