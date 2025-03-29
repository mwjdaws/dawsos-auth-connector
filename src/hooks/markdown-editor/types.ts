
import { Dispatch, SetStateAction } from 'react';

/**
 * Result of a document operation (save or publish)
 * @property success Indicates if the operation was successful
 * @property documentId The ID of the document (if successful)
 * @property error Optional error information if operation failed
 */
export interface DocumentOperationResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Result of saving a draft document
 * @property success Indicates if the save was successful
 * @property documentId The ID of the saved document (if successful)
 * @property error Optional error information if save failed
 */
export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Props for the document operations hooks
 * @property documentId Optional ID of the document being edited
 * @property onSaveDraft Optional callback when a draft is saved
 * @property onPublish Optional callback when a document is published
 */
export interface DocumentOperationsProps {
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Props for document operation handlers
 * Contains all data and functions needed to handle document operations
 */
export interface DocumentOperationHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId?: string;
  sourceId?: string;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined) => Promise<DocumentOperationResult>;
  setLastSavedTitle: Dispatch<SetStateAction<string>>;
  setLastSavedContent: Dispatch<SetStateAction<string>>;
  setLastSavedExternalSourceUrl: Dispatch<SetStateAction<string>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

/**
 * Context object for draft operations
 * @property createVersion Optional function to create a document version
 */
export interface DraftOperationsContext {
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<any>;
}

/**
 * Context object for publish operations
 * @property saveDraft Function to save a draft before publishing
 */
export interface PublishOperationsContext {
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
}

/**
 * Result of publishing a document
 */
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Props for document lifecycle management
 * Contains functions for versioning and content enrichment
 */
export interface DocumentLifecycleProps {
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<any>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

/**
 * Generic operation result interface
 */
export interface OperationResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Options for save handler operations
 * @property isManualSave Whether this is a manual save (user initiated)
 * @property isAutoSave Whether this is an automatic save
 * @property isPublishing Whether this save is part of a publish operation
 */
export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
  isPublishing?: boolean;
}

/**
 * Props for the MarkdownEditor component
 * @property initialTitle Initial title for the document
 * @property initialContent Initial content for the document
 * @property initialTemplateId Optional template ID to apply
 * @property initialExternalSourceUrl Optional URL to an external source
 * @property documentId Optional ID of an existing document
 * @property sourceId Optional source ID for loading content
 * @property onSaveDraft Optional callback when a draft is saved
 * @property onPublish Optional callback when document is published
 */
export interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string;
  sourceId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}
