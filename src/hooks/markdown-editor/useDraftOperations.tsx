
import { supabase } from '@/integrations/supabase/client';
import { DraftOperationsContext, SaveDraftResult } from './types';
import { handleError } from '@/utils/error-handling';
import { convertErrorOptions } from '@/utils/errors/compatibility';
import { validateDocumentTitle } from '@/utils/validation/documentValidation';

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
    externalSourceUrl: string,
    userId: string | undefined,
    documentId?: string,
    isAutoSave = false
  ): Promise<SaveDraftResult> => {
    // Skip validation for autosave to reduce processing
    if (!isAutoSave) {
      const validation = validateDocumentTitle(title);
      if (!validation.isValid) {
        return { 
          success: false, 
          documentId: null,
          error: validation.errorMessage 
        };
      }
    }

    try {
      // Skip operations for temp documents if no user is authenticated
      if (documentId?.startsWith('temp-') && !userId) {
        console.log('Skipping database operation for temp document without authentication');
        return { 
          success: true, 
          documentId: documentId
        };
      }
      
      // Log the operation details for debugging
      console.log('Saving draft:', { 
        title, 
        content: content.substring(0, 50) + '...', 
        templateId,
        externalSourceUrl,
        userId, 
        documentId, 
        isAutoSave 
      });

      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        external_source_url: externalSourceUrl,
        user_id: userId || null
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

        // Create a version if successful and not an autosave
        if (!error && !isAutoSave && context.createVersion) {
          try {
            await context.createVersion(documentId, content, {
              reason: 'Manual save',
              auto_version: false
            });
          } catch (versionError) {
            // Log version creation error but don't fail the save operation
            console.error('Error creating version but continuing:', versionError);
            handleError(
              versionError,
              "Warning: Could not create document version",
              convertErrorOptions({ 
                level: "warning", 
                technical: true, 
                silent: isAutoSave 
              })
            );
          }
        }
      } else if (userId) {
        // Only create new document if user is authenticated
        console.log('Creating new document for user:', userId);
        const response = await supabase
          .from('knowledge_sources')
          .insert([{
            title,
            content,
            template_id: templateId,
            external_source_url: externalSourceUrl,
            user_id: userId
          }])
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
          convertErrorOptions({ 
            level: "error", 
            technical: true, 
            silent: isAutoSave 
          })
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
      console.error('Unexpected error while saving draft:', error);
      handleError(
        error,
        "Unexpected error while saving draft",
        convertErrorOptions({ 
          level: "error", 
          technical: true, 
          silent: isAutoSave 
        })
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
