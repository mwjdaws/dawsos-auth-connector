
import { supabase } from '@/integrations/supabase/client';
import { DraftOperationsContext, SaveDraftResult } from './types';
import { handleError } from '@/utils/error-handling';

/**
 * Hook for draft document operations
 */
export const useDraftOperations = (context: DraftOperationsContext) => {
  /**
   * Save a document as a draft
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    documentId?: string,
    isAutoSave = false
  ): Promise<SaveDraftResult> => {
    if (!title.trim()) {
      return { 
        success: false, 
        documentId: null,
        error: 'Title is required' 
      };
    }

    try {
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: userId
      };

      let data;
      let error;

      // If we have a valid UUID documentId, update the existing document
      if (documentId && !documentId.startsWith('temp-')) {
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

        // Create a version if successful and not an autosave
        if (!error && !isAutoSave && context.createVersion) {
          await context.createVersion(documentId, content, {
            reason: 'Manual save',
            auto_version: false
          });
        }
      } else {
        // Create new document
        const response = await supabase
          .from('knowledge_sources')
          .insert([knowledgeData])
          .select()
          .single();
        
        data = response.data;
        error = response.error;
      }

      if (error) {
        handleError(
          error,
          "Database error while saving draft",
          { level: "error", technical: true }
        );
        return { 
          success: false, 
          documentId: null,
          error
        };
      }

      if (!data) {
        return { 
          success: false, 
          documentId: null,
          error: 'No data returned from operation'
        };
      }
      
      return { 
        success: true, 
        documentId: data.id
      };
    } catch (error) {
      handleError(
        error,
        "Unexpected error while saving draft",
        { level: "error", technical: true }
      );
      return { 
        success: false, 
        documentId: null,
        error
      };
    }
  };

  return {
    saveDraft
  };
};
