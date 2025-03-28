
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { PublishOperationsContext, PublishResult } from './types';
import { usePublishValidation } from './publish-operations/usePublishValidation';
import { usePublishDatabase } from './publish-operations/usePublishDatabase';

/**
 * Hook for document publishing operations
 */
export const usePublishOperations = (context: PublishOperationsContext) => {
  const { validateForPublish } = usePublishValidation();
  const { updatePublishStatus, triggerContentEnrichment } = usePublishDatabase();
  
  /**
   * Publish a document
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined
  ): Promise<PublishResult> => {
    // Validate before publishing
    const validation = validateForPublish(title);
    if (!validation.isValid) {
      return { 
        success: false, 
        documentId: null,
        error: validation.errorMessage 
      };
    }

    try {
      // First, save the latest content as a draft
      const savedId = await context.saveDraft(title, content, templateId, externalSourceUrl, userId, false);
      
      if (!savedId) {
        return { 
          success: false, 
          documentId: null,
          error: 'Failed to save document before publishing' 
        };
      }
      
      // Verify user authentication
      if (!userId) {
        return { 
          success: false, 
          documentId: null,
          error: 'Authentication required to publish document' 
        };
      }
      
      // Update the document's published status
      console.log('Publishing document:', savedId);
      const publishResult = await updatePublishStatus(savedId);
      
      if (!publishResult.success) {
        return publishResult;
      }
      
      // Optionally trigger content enrichment (non-blocking)
      try {
        await triggerContentEnrichment(savedId, content);
      } catch (enrichError) {
        // Log but don't fail the publish operation
        console.error('Error enriching content (non-critical):', enrichError);
        handleError(
          enrichError,
          "Warning: Content enrichment failed but document was published",
          { level: "warning", technical: true }
        );
      }
      
      return {
        success: true,
        documentId: savedId
      };
    } catch (error) {
      console.error('Unexpected error in publishDocument:', error);
      handleError(
        error,
        "An unexpected error occurred while publishing the document",
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
    publishDocument
  };
};
