
import { useTransition } from 'react';
import { useDocumentOperations } from './useDocumentOperations';
import { useTemplateHandling } from './useTemplateHandling';
import { useAutosave } from './useAutosave';
import { useContentState } from './useContentState';
import { useContentLoader } from './useContentLoader';
import { useDocumentOperationHandlers } from './useDocumentOperationHandlers';

interface UseMarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  sourceId?: string; // For loading existing content
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
  sourceId,
  onSaveDraft,
  onPublish
}: UseMarkdownEditorProps) => {
  // Use transition for UI updates
  const [isPending, startTransition] = useTransition();
  
  // Content state management
  const {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    setTemplateId,
    isDirty,
    setIsDirty,
    lastSavedTitle,
    setLastSavedTitle,
    lastSavedContent,
    setLastSavedContent,
    isPublished,
    setIsPublished
  } = useContentState({
    initialTitle,
    initialContent,
    initialTemplateId,
    sourceId,
    documentId
  });

  // Content loading
  const { isLoading } = useContentLoader({
    sourceId,
    setTitle,
    setContent,
    setTemplateId,
    setLastSavedTitle,
    setLastSavedContent,
    setIsPublished,
    setIsDirty
  });

  // Template handling
  const {
    isLoadingTemplate,
    handleTemplateChange
  } = useTemplateHandling(setTitle, setContent, setIsDirty);

  // Document operations
  const {
    isSaving,
    isPublishing,
    saveDraft,
    publishDocument
  } = useDocumentOperations({
    documentId: documentId || sourceId, // Use sourceId if documentId is not provided
    onSaveDraft,
    onPublish
  });

  // Document operation handlers
  const {
    handleSaveDraft,
    handlePublish
  } = useDocumentOperationHandlers({
    title,
    content,
    templateId,
    documentId,
    sourceId,
    saveDraft,
    publishDocument,
    setLastSavedTitle,
    setLastSavedContent,
    setIsDirty,
    onSaveDraft,
    onPublish
  });

  // Set up autosave
  useAutosave({
    isDirty,
    isSaving,
    isPublishing,
    documentId: documentId || sourceId, // Use sourceId if documentId is not provided
    onSave: () => handleSaveDraft(true)
  });

  return {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty,
    isPublished,
    isLoading,
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
