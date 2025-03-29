
import { useDocumentOperationsCore } from './core';
import { useDocumentOperationState } from './state';
import { DocumentOperationsProps } from '../types';

/**
 * Main hook for document operations including saving and publishing
 * 
 * This hook combines core operation functionality with state management
 * to provide a complete interface for document operations with proper
 * loading states for UI feedback.
 * 
 * The operations are:
 * - saveDraft: Save the document as a draft
 * - publishDocument: Publish the document
 * 
 * Each operation handles its own loading state internally.
 * 
 * @param props Configuration for document operations
 * @returns Object with operations and loading states
 */
export const useDocumentOperations = (props: DocumentOperationsProps) => {
  const { saveDraft, publishDocument } = useDocumentOperationsCore(props);
  const { isSaving, isPublishing, setIsSaving, setIsPublishing } = useDocumentOperationState();
  
  /**
   * Save document as a draft with state handling
   * 
   * This function wraps the core saveDraft operation with loading state
   * management to provide UI feedback during the operation.
   * 
   * @param title Document title
   * @param content Document content
   * @param templateId Optional template ID
   * @param externalSourceUrl Optional external source URL
   * @param userId User ID of the document owner
   * @param isAutoSave Whether this is an autosave operation
   * @returns Promise resolving to the document ID or null
   */
  const saveDraftWithState = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined,
    isAutoSave = false
  ) => {
    setIsSaving(true);
    try {
      return await saveDraft(title, content, templateId, externalSourceUrl, userId, isAutoSave);
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Publish document with state handling
   * 
   * This function wraps the core publishDocument operation with loading state
   * management to provide UI feedback during the operation.
   * 
   * @param title Document title
   * @param content Document content
   * @param templateId Optional template ID
   * @param externalSourceUrl Optional external source URL
   * @param userId User ID of the document owner
   * @returns Promise resolving to the operation result
   */
  const publishDocumentWithState = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined
  ) => {
    setIsPublishing(true);
    try {
      return await publishDocument(title, content, templateId, externalSourceUrl, userId);
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
