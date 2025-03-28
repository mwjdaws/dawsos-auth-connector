
import { useState } from 'react';
import { useDocumentVersioning } from '../useDocumentVersioning';
import { useDraftOperations } from '../useDraftOperations';
import { usePublishOperations } from '../usePublishOperations';
import { handleError } from '@/utils/error-handling';
import { DocumentOperationsProps, DocumentOperationResult } from '../types';
import { supabase } from '@/integrations/supabase/client';

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
      // Get the current user's ID if not provided
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        effectiveUserId = user?.id;
        
        // Log authentication status for debugging
        console.log('Authentication status:', !!user, 'User ID:', effectiveUserId);
      }
      
      // Proceed with saving the draft
      const result = await saveDraftOperation(
        title, 
        content, 
        templateId, 
        effectiveUserId, 
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
      // Get the current user's ID if not provided
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        effectiveUserId = user?.id;
      }
      
      const result = await publishDocumentOperation(title, content, templateId, effectiveUserId);
      
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
