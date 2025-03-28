
import { useDocumentOperationsCore } from './core';
import { useDocumentOperationState } from './state';
import { DocumentOperationsProps } from '../types';

/**
 * Main hook for document operations including saving and publishing
 * Combines operation core functionality with state management
 */
export const useDocumentOperations = (props: DocumentOperationsProps) => {
  const { saveDraft, publishDocument } = useDocumentOperationsCore(props);
  const { isSaving, isPublishing, setIsSaving, setIsPublishing } = useDocumentOperationState();
  
  /**
   * Save document as a draft with state handling
   */
  const saveDraftWithState = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave = false
  ) => {
    setIsSaving(true);
    try {
      return await saveDraft(title, content, templateId, userId, isAutoSave);
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Publish document with state handling
   */
  const publishDocumentWithState = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined
  ) => {
    setIsPublishing(true);
    try {
      return await publishDocument(title, content, templateId, userId);
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    isSaving,
    isPublishing,
    saveDraft: saveDraftWithState,
    publishDocument: publishDocumentWithState
  };
};

// Re-export for compatibility
export * from './core';
export * from './state';
