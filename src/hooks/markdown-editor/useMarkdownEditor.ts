
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
    handlePublish,
    isSavingManually
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

  // Configure autosave - avoid autosaving for temp documents
  const effectiveDocumentId = documentId || sourceId;
  const isTemp = effectiveDocumentId ? effectiveDocumentId.startsWith('temp-') : false;
  
  // Fixed: Call useAutosave with the correct individual parameters, not an object
  useAutosave(
    isDirty,
    30000, // 30 seconds interval to reduce save frequency
    () => handleSaveDraft(false, true) // isManualSave=false, isAutoSave=true
  );

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
      handleError(
        error, 
        "Error initializing editor content", 
        { level: "error" }
      );
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
    isSaving: isSaving || isSavingManually,
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
