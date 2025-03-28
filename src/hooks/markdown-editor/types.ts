
import { Json } from '@/integrations/supabase/types';

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

export interface DraftOperationsContext {
  createVersion?: (documentId: string, content: string, metadata?: Json) => Promise<void>;
}
