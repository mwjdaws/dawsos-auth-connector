
import { useState } from 'react';
import { useDocumentVersioning } from '../useDocumentVersioning';
import { useDraftOperations } from '../useDraftOperations';
import { usePublishOperations } from '../usePublishOperations';
import { handleError } from '@/utils/error-handling';
import { DocumentOperationsProps, DocumentOperationResult } from '../types';

/**
 * Core document operations without UI state handling
 */
export const useDocumentOperationsCore = ({
  documentId,
  onSaveDraft,
  onPublish
}: DocumentOperationsProps) => {
  const { createVersion } = useDocumentVersioning();
  
  // Use the draft operations
  const { saveDraft: saveDraftOperation } = useDraftOperations({ createVersion });
  
  /**
   * Save document as a draft with error handling
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave = false
  ): Promise<string | null> => {
    try {
      const result = await saveDraftOperation(
        title, 
        content, 
        templateId, 
        userId, 
        documentId, 
        isAutoSave
      );
      
      if (result.success && result.documentId && onSaveDraft && !isAutoSave) {
        onSaveDraft(result.documentId, title, content, templateId);
      }
      
      return result.documentId;
    } catch (error) {
      handleError(
        error, 
        "An unexpected error occurred while saving the draft", 
        { level: "error", technical: false }
      );
      return null;
    }
  };
  
  // Use the publish operations with the saveDraft function
  const { publishDocument: publishDocumentOperation } = usePublishOperations({ 
    saveDraft: (title, content, templateId, userId, isAutoSave) => 
      saveDraft(title, content, templateId, userId, isAutoSave) 
  });
  
  /**
   * Publish document with error handling
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined
  ): Promise<DocumentOperationResult> => {
    try {
      const result = await publishDocumentOperation(title, content, templateId, userId);
      
      if (result.success && result.documentId && onPublish) {
        onPublish(result.documentId, title, content, templateId);
      }
      
      return result;
    } catch (error) {
      handleError(
        error, 
        "An unexpected error occurred while publishing the document", 
        { level: "error", technical: false }
      );
      return { success: false, error };
    }
  };

  return {
    saveDraft,
    publishDocument
  };
};
