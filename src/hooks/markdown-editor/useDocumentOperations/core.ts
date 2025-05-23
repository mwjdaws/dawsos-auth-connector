
import { useState } from 'react';
import { useDocumentVersioning } from '../useDocumentVersioning';
import { useDraftOperations } from '../draft-operations/useDraftOperations';
import { usePublishOperations } from '../usePublishOperations';
import { handleError } from '@/utils/error-handling';
import { convertErrorOptions } from '@/utils/errors/compatibility';
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
    externalSourceUrl: string,
    userId: string | undefined,
    isAutoSave = false
  ): Promise<string | null> => {
    try {
      // Get the current user's ID if not provided
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          effectiveUserId = user?.id;
          
          // Log authentication status for debugging
          console.log('Authentication status:', !!user, 'User ID:', effectiveUserId);
        } catch (authError) {
          console.error('Error getting current user:', authError);
          if (!isAutoSave) {
            handleError(
              authError, 
              "Could not verify authentication status", 
              convertErrorOptions({ 
                level: "warning", 
                technical: false 
              })
            );
          }
        }
      }
      
      // Proceed with saving the draft
      const result = await saveDraftOperation(
        title, 
        content, 
        templateId, 
        externalSourceUrl, 
        effectiveUserId, 
        documentId, 
        isAutoSave
      );
      
      // Handle successful save with callback
      if (result.success && result.documentId && onSaveDraft && !isAutoSave) {
        try {
          onSaveDraft(result.documentId, title, content, templateId, externalSourceUrl);
        } catch (callbackError) {
          // Log but don't fail the operation if callback fails
          console.error('Error in onSaveDraft callback:', callbackError);
        }
      }
      
      // Handle error case
      if (!result.success) {
        console.error('Draft save operation failed:', result.error);
        if (!isAutoSave) {
          handleError(
            result.error, 
            "An error occurred while saving the draft", 
            convertErrorOptions({ 
              level: "error", 
              technical: false 
            })
          );
        }
        return null;
      }
      
      return result.documentId;
    } catch (error) {
      console.error('Unexpected error in saveDraft:', error);
      if (!isAutoSave) {
        handleError(
          error, 
          "An unexpected error occurred while saving the draft", 
          convertErrorOptions({ 
              level: "error", 
              technical: false 
          })
        );
      }
      return null;
    }
  };
  
  // Use the publish operations with the saveDraft function
  const { publishDocument: publishDocumentOperation } = usePublishOperations({ 
    saveDraft
  });
  
  /**
   * Publish document with error handling
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined
  ): Promise<DocumentOperationResult> => {
    try {
      // Get the current user's ID if not provided
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          effectiveUserId = user?.id;
          
          if (!effectiveUserId) {
            return { 
              success: false, 
              documentId: null,
              error: "Authentication required to publish document" 
            };
          }
        } catch (authError) {
          console.error('Error getting current user:', authError);
          handleError(
            authError, 
            "Could not verify authentication status", 
            convertErrorOptions({ 
                level: "error", 
                technical: false 
            })
          );
          return { 
            success: false, 
            documentId: null,
            error: "Authentication error" 
          };
        }
      }
      
      const result = await publishDocumentOperation(title, content, templateId, externalSourceUrl, effectiveUserId);
      
      // Handle successful publish with callback
      if (result.success && result.documentId && onPublish) {
        try {
          onPublish(result.documentId, title, content, templateId, externalSourceUrl);
        } catch (callbackError) {
          // Log but don't fail the operation if callback fails
          console.error('Error in onPublish callback:', callbackError);
        }
      }
      
      // Handle error case without duplicating handleError (publishDocumentOperation already handles errors)
      if (!result.success) {
        console.error('Document publish operation failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Unexpected error in publishDocument:', error);
      handleError(
        error, 
        "An unexpected error occurred while publishing the document", 
        convertErrorOptions({ 
            level: "error", 
            technical: false 
        })
      );
      return { success: false, documentId: null, error };
    }
  };

  return {
    saveDraft,
    publishDocument
  };
};
