import { Dispatch, SetStateAction } from 'react';

export interface DocumentOperationResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface DocumentOperationsProps {
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

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

export interface DraftOperationsContext {
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<any>;
}

export interface PublishOperationsContext {
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
}

export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

// Document lifecycle management
export interface DocumentLifecycleProps {
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<any>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

export interface OperationResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface SaveHandlerOptions {
  isManualSave?: boolean;
  isAutoSave?: boolean;
  isPublishing?: boolean;
}
