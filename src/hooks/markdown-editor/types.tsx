
/**
 * Types for markdown editor operations
 */
import { ValidationResult } from '@/utils/validation/types';
import { Json } from '@/types/supabase';

// Base operation result
export interface OperationResult {
  success: boolean;
  error?: any;
}

// Document operation result
export interface DocumentOperationResult extends OperationResult {
  contentId: string | null;
}

// Draft operation context
export interface DraftOperationsContext {
  documentId?: string | null;
  sourceId?: string | null;
  userId?: string | undefined;
}

// Draft save result
export interface SaveDraftResult extends OperationResult {
  documentId: string | null;
}

// Publish operation context
export interface PublishOperationsContext {
  documentId?: string | null;
  sourceId?: string | null;
  userId?: string | undefined;
  saveDraft?: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string) => Promise<string | null>;
}

// Publish result
export interface PublishResult extends OperationResult {
  documentId: string | null;
}

// Props for the main markdown editor
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

// Props for document operations hook
export interface DocumentOperationsProps {
  documentId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Props for document operation handlers
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId?: string | null;
  sourceId?: string | null;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument?: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined) => Promise<DocumentOperationResult>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Options for save operations
export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
}

// Props for content loader
export interface UseContentLoaderProps {
  sourceId: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  setExternalSourceUrl: React.Dispatch<React.SetStateAction<string>>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsPublished: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

// Knowledge source version type
export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  content: string;
  version_number: number;
  created_at: string | null;
  metadata: Json;
}

// Related notes
export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}

// Ontology term
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
}

// Related term
export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  relation_type: string;
}
