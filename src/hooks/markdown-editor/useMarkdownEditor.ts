
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
 * 
 * This hook composes multiple specialized hooks to provide a complete
 * editing experience with save, publish, template handling, and autosave
 * functionality. It serves as the primary interface between the editor UI
 * and the underlying data management.
 * 
 * Features:
 * - Content state management (title, content, dirty state)
 * - Content loading from sources
 * - Document operations (save, publish)
 * - Template application
 * - Autosave functionality
 * 
 * @param props Configuration options for the markdown editor
 * @returns Complete state and operations for the markdown editor UI
 */
export const useMarkdownEditor = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  initialExternalSourceUrl = '',
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
    externalSourceUrl,
    setExternalSourceUrl,
    isDirty,
    setIsDirty,
    isPublished,
    setIsPublished,
    lastSavedTitle,
    setLastSavedTitle,
    lastSavedContent,
    setLastSavedContent,
    lastSavedExternalSourceUrl,
    setLastSavedExternalSourceUrl
  } = useContentState({
    initialTitle,
    initialContent,
    initialTemplateId,
    initialExternalSourceUrl
  });

  // Load existing content
  const { isLoading } = useContentLoader({
    sourceId,
    setTitle,
    setContent,
    setTemplateId,
    setExternalSourceUrl,
    setLastSavedTitle,
    setLastSavedContent,
    setLastSavedExternalSourceUrl,
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
    externalSourceUrl,
    documentId,
    sourceId,
    saveDraft,
    publishDocument,
    setLastSavedTitle,
    setLastSavedContent,
    setLastSavedExternalSourceUrl,
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
  
  // Use autosave with correct params and proper Promise handling
  useAutosave(
    isDirty && !isTemp, 
    30000, // 30 seconds interval
    () => handleSaveDraft({ isManualSave: false, isAutoSave: true }) // isManualSave=false, isAutoSave=true
  );

  // Initialize content when props change
  useEffect(() => {
    try {
      setTitle(initialTitle);
      setContent(initialContent);
      setTemplateId(initialTemplateId);
      setExternalSourceUrl(initialExternalSourceUrl);
      setLastSavedTitle(initialTitle);
      setLastSavedContent(initialContent);
      setLastSavedExternalSourceUrl(initialExternalSourceUrl);
      setIsDirty(false);
    } catch (error) {
      handleError(
        error, 
        "Error initializing editor content", 
        { level: "error" }
      );
    }
  }, [initialTitle, initialContent, initialTemplateId, initialExternalSourceUrl]);

  return {
    // Content state
    title,
    setTitle,
    content,
    setContent,
    templateId,
    setTemplateId, // Explicitly expose setTemplateId
    externalSourceUrl,
    setExternalSourceUrl,
    
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
