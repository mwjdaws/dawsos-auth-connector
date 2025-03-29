
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { PublishResult } from '../types';

/**
 * Hook for database operations related to publishing
 */
export const usePublishDatabase = () => {
  /**
   * Update the publish status of a document
   */
  const updatePublishStatus = async (documentId: string): Promise<PublishResult> => {
    try {
      // Update the document's published status
      // Note: Using 'published' instead of 'is_published' to match the actual column name
      const { error: updateError } = await supabase
        .from('knowledge_sources')
        .update({ 
          published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
      
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
      
      return {
        success: true,
        documentId
      };
    } catch (error) {
      console.error('Error in updatePublishStatus:', error);
      handleError(
        error,
        "Database error during publish operation",
        { level: "error", technical: true }
      );
      return { 
        success: false, 
        documentId: null,
        error
      };
    }
  };

  /**
   * Trigger content enrichment after publishing
   */
  const triggerContentEnrichment = async (documentId: string, content: string): Promise<void> => {
    try {
      // This is where we would call a content enrichment service
      // For now, let's just log that we would do this
      console.log('Content would be enriched here for document:', documentId);
      
      // If we had a function like this:
      // await enrichContent(savedId, content);
    } catch (error) {
      console.error('Error in content enrichment:', error);
      // We don't rethrow because this is a non-critical operation
    }
  };
  
  return {
    updatePublishStatus,
    triggerContentEnrichment
  };
};
