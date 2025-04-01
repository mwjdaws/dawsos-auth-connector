
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
  associationId?: string;
}

export interface RelatedTerm {
  term_id: string;
  term: string;
  relation_type: string;
  domain?: string;
  description?: string;
}

/**
 * Document operations result
 */
export interface DocumentOperationResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Save draft operation result
 */
export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Publish result
 */
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Document operations props
 */
export interface DocumentOperationsProps {
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Document operation handler props
 */
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId?: string | null;
  sourceId?: string | null;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string) => Promise<DocumentOperationResult>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Draft operations context
 */
export interface DraftOperationsContext {
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

/**
 * Publish operations context
 */
export interface PublishOperationsContext {
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string, isAutoSave?: boolean) => Promise<string | null>;
}

/**
 * Markdown editor props
 */
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

/**
 * Save handler options
 */
export interface SaveHandlerOptions {
  isAutoSave?: boolean;
  skipValidation?: boolean;
}
