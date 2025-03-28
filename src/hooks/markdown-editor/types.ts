
import { useDocumentVersioning } from './useDocumentVersioning';

export interface DocumentOperationsProps {
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: Error | string | null;
}

export interface DocumentOperationResult {
  success: boolean;
  documentId?: string;
  error?: any;
}

export interface PublishResult extends DocumentOperationResult {
  error?: string | null;
}

export interface DraftOperationsContext {
  createVersion: ReturnType<typeof useDocumentVersioning>['createVersion'];
}

export interface PublishOperationsContext {
  saveDraft: (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave?: boolean
  ) => Promise<string | null>;
}

export interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  sourceId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}
