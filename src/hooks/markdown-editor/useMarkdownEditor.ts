
import { useEffect } from 'react';
import { useContentState } from './useContentState';
import { useContentLoader } from './useContentLoader';
import { useDocumentOperations } from './useDocumentOperations';
import { useDocumentOperationHandlers } from './useDocumentOperationHandlers';
import { useTemplateHandling } from './useTemplateHandling';
import { useAutosave } from './useAutosave';
import { MarkdownEditorProps } from './types';
import { handleError } from '@/utils/error-handling';

/**
 * Main orchestration hook for the markdown editor
 */
export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
  sourceId,
  onSaveDraft,
  onPublish
}: MarkdownEditorProps) => {
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
    isPublished,
    setIsPublished,
    lastSavedTitle,
    setLastSavedTitle,
    lastSavedContent,
    setLastSavedContent
  } = useContentState({
    initialTitle,
    initialContent,
    initialTemplateId
  });

  // Load existing content
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

  // Document operations
  const {
    isSaving,
    isPublishing,
    saveDraft,
    publishDocument
  } = useDocumentOperations({
    documentId,
    onSaveDraft,
    onPublish
  });

  // Operation handlers (with UI feedback)
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

  // Template handling
  const {
    isLoadingTemplate,
    handleTemplateChange
  } = useTemplateHandling({
    setTitle,
    setContent,
    setTemplateId,
    setIsDirty
  });

  // Configure autosave
  useAutosave({
    isDirty,
    isSaving,
    isPublishing,
    documentId: documentId || sourceId,
    onSave: () => handleSaveDraft(true),
    interval: 30000, // Increased to 30 seconds to reduce save frequency
    enabled: !!documentId || !!sourceId // Only enable when we have a valid document
  });

  // Initialize content when props change
  useEffect(() => {
    try {
      setTitle(initialTitle);
      setContent(initialContent);
      setTemplateId(initialTemplateId);
      setLastSavedTitle(initialTitle);
      setLastSavedContent(initialContent);
      setIsDirty(false);
    } catch (error) {
      handleError(error, "Error initializing editor content");
    }
  }, [initialTitle, initialContent, initialTemplateId]);

  return {
    // Content state
    title,
    setTitle,
    content,
    setContent,
    templateId,
    
    // Operation states
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty,
    isPublished,
    isLoading,
    
    // Operations
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  };
};
