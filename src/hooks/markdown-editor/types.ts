
import { Json } from '@/types/supabase';

/**
 * Options for the Markdown Editor
 */
export interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string | null;
  sourceId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Props for document operations
 */
export interface DocumentOperationsProps {
  documentId: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Options for save handler
 */
export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
}

/**
 * Props for the publish handler
 */
export interface UsePublishHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  saveDraft: (options?: SaveHandlerOptions) => Promise<string | null>;
  publishDocument: any;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

/**
 * Props for document lifecycle hooks
 */
export interface UseDocumentLifecycleProps {
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

/**
 * Result of document operations
 */
export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

/**
 * Result of publishing operations
 */
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Context for draft operations
 */
export interface DraftOperationsContext {
  userId?: string;
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

/**
 * Result of draft save operations
 */
export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Context for publish operations
 */
export interface PublishOperationsContext {
  userId?: string;
}

/**
 * Ontology term definition
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
}

/**
 * Related term definition
 */
export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  relation_type: string;
}

/**
 * Related note definition
 */
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}
