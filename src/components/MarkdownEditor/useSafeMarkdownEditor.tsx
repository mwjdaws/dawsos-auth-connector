
import { useMarkdownEditor as useOriginalMarkdownEditor } from './useMarkdownEditor';
import { nullifyUndefined } from '@/types/compat';

// This interface follows the original props but makes callbacks optional
interface UseSafeMarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string | null;
  sourceId?: string | null;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

// Wrapper hook that handles undefined callbacks safely
export const useSafeMarkdownEditor = (props: UseSafeMarkdownEditorProps) => {
  // Create safe wrapper handlers that check if callbacks exist
  const handleSaveDraftWrapper = (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => {
    if (props.onSaveDraft) {
      props.onSaveDraft(id, title, content, templateId, externalSourceUrl);
    }
  };
  
  const handlePublishWrapper = (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => {
    if (props.onPublish) {
      props.onPublish(id, title, content, templateId, externalSourceUrl);
    }
  };
  
  // Call the original hook with the wrapped handlers
  const editorState = useOriginalMarkdownEditor({
    initialTitle: props.initialTitle || '',
    initialContent: props.initialContent || '',
    initialTemplateId: nullifyUndefined(props.initialTemplateId),
    initialExternalSourceUrl: props.initialExternalSourceUrl || '',
    documentId: nullifyUndefined(props.documentId),
    sourceId: nullifyUndefined(props.sourceId),
    onSaveDraft: handleSaveDraftWrapper,
    onPublish: handlePublishWrapper
  });
  
  return editorState;
};
