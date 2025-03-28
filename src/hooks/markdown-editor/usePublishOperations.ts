
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { validateDocumentTitle } from '@/utils/validation';
import { PublishOperationsContext, PublishResult } from './types';

/**
 * Hook for document publishing operations
 */
export const usePublishOperations = (context: PublishOperationsContext) => {
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
    // Always validate title for publishing
    const validation = validateDocumentTitle(title);
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
      
      // Now update the document to mark it as published
      if (!userId) {
        return { 
          success: false, 
          documentId: null,
          error: 'Authentication required to publish document' 
        };
      }
      
      // Update the document's published status
      console.log('Publishing document:', savedId);
      const { error: updateError } = await supabase
        .from('knowledge_sources')
        .update({ 
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', savedId);
      
      if (updateError) {
        console.error('Error updating document publish status:', updateError);
        handleError(
          updateError,
          "Failed to update document publish status",
          { level: "error", technical: true }
        );
        return { 
          success: false, 
          documentId: null,
          error: updateError
        };
      }
      
      // Optionally trigger content enrichment if available
      try {
        // This is where we would call a content enrichment service
        // For now, let's just log that we would do this
        console.log('Content would be enriched here for document:', savedId);
        
        // If we had a function like this:
        // await enrichContent(savedId, content);
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
