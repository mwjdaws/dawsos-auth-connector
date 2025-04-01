import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { SaveDraftResult } from '../types';
import { ErrorLevel } from '@/utils/error-handling';

/**
 * Hook for database operations related to drafts
 * 
 * This hook encapsulates all database interactions for saving drafts,
 * providing a clean interface for the rest of the application to use.
 * It handles both creation of new documents and updates to existing ones.
 */
export const useDatabaseOperations = () => {
  /**
   * Perform database operations for saving a draft
   * 
   * This function handles the complexity of determining whether to create
   * a new document or update an existing one. It also manages temporary
   * documents for unauthenticated users.
   * 
   * @param title Document title
   * @param content Document content
   * @param templateId Optional template ID
   * @param externalSourceUrl External source URL if applicable
   * @param userId User ID of the document owner
   * @param documentId Optional existing document ID
   * @returns Promise resolving to a SaveDraftResult object
   */
  const performDatabaseOperation = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined,
    documentId?: string
  ): Promise<SaveDraftResult> => {
    try {
      // Log the operation details for debugging
      console.log('Performing database operation:', { 
        title, 
        content: content.substring(0, 50) + '...', 
        templateId,
        externalSourceUrl,
        userId, 
        documentId
      });

      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        external_source_url: externalSourceUrl,
        user_id: userId
      };

      let data;
      let error;

      // If we have a valid UUID documentId, update the existing document
      if (documentId && !documentId.startsWith('temp-')) {
        console.log('Updating existing document:', documentId);
        const response = await supabase
          .from('knowledge_sources')
          .update({ 
            updated_at: new Date().toISOString(),
            ...knowledgeData
          })
          .eq('id', documentId)
          .select()
          .single();
        
        data = response.data;
        error = response.error;
      } else if (userId) {
        // Only create new document if user is authenticated
        console.log('Creating new document for user:', userId);
        const response = await supabase
          .from('knowledge_sources')
          .insert([knowledgeData])
          .select()
          .single();
        
        data = response.data;
        error = response.error;
      } else {
        console.log('No user ID available for creating document');
        return { 
          success: false, 
          documentId: null,
          error: 'Authentication required to save document'
        };
      }

      if (error) {
        console.error('Database error while saving draft:', error);
        handleError(
          error,
          "Database error while saving draft",
          { level: ErrorLevel.Error, technical: true, silent: false }
        );
        return { 
          success: false, 
          documentId: null,
          error
        };
      }

      if (!data && !documentId?.startsWith('temp-')) {
        return { 
          success: false, 
          documentId: null,
          error: 'No data returned from operation'
        };
      }
      
      return { 
        success: true, 
        documentId: data?.id || documentId
      };
    } catch (error) {
      console.error('Unexpected error in database operation:', error);
      handleError(
        error,
        "Unexpected error in database operation",
        { level: ErrorLevel.Error, technical: true, silent: false }
      );
      return { 
        success: false, 
        documentId: null,
        error
      };
    }
  };

  return {
    performDatabaseOperation
  };
};
