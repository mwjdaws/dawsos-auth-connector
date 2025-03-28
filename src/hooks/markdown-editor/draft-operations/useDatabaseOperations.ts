
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { SaveDraftResult } from '../types';

/**
 * Hook for database operations related to drafts
 */
export const useDatabaseOperations = () => {
  /**
   * Perform database operations for saving a draft
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
            ...knowledgeData,
            updated_at: new Date().toISOString()
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
          { level: "error", technical: true, silent: false }
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
        { level: "error", technical: true, silent: false }
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
