
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
  const handleSaveDraftWrapper = props.onSaveDraft 
    ? (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => {
        props.onSaveDraft?.(id, title, content, templateId, externalSourceUrl);
      }
    : undefined;
    
  const handlePublishWrapper = props.onPublish
    ? (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => {
        props.onPublish?.(id, title, content, templateId, externalSourceUrl);
      }
    : undefined;
  
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
