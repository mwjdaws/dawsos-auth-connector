
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { DraftOperationsContext, SaveDraftResult } from './types';

/**
 * Handles saving a document as a draft
 */
export const useDraftOperations = ({ createVersion }: DraftOperationsContext) => {
  /**
   * Saves the current document as a draft
   * @param title Document title
   * @param content Document content
   * @param templateId Template ID if any
   * @param userId User ID
   * @param documentId Existing document ID
   * @param isAutoSave Whether this is triggered by autosave
   * @returns Promise with the saved document ID or null
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    documentId: string | undefined,
    isAutoSave = false
  ): Promise<SaveDraftResult> => {
    if (!title.trim()) {
      if (!isAutoSave) {
        toast({
          title: "Title Required",
          description: "Please enter a title before saving",
          variant: "destructive",
        });
      }
      return { success: false, documentId: null, error: "Title is required" };
    }

    if (!userId) {
      if (!isAutoSave) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to save content",
          variant: "destructive",
        });
      }
      return { success: false, documentId: null, error: "Authentication required" };
    }

    console.log("Saving document with title:", title, "and user ID:", userId);
    
    try {
      // Create basic metadata
      const metadata = {
        word_count: content.split(/\s+/).length,
        last_saved: new Date().toISOString(),
        author_id: userId,
        user_id: userId, // Explicitly include user_id in metadata
        draft_version: documentId ? 'update' : 'new'
      };
      
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: userId, // Ensure user_id is set
        metadata
      };

      console.log("Document data to save:", knowledgeData);
      
      let savedDocumentId = documentId;
      let response;

      if (documentId) {
        console.log("Updating existing document ID:", documentId);
        
        // Before updating the document, create a version of the current content
        await createVersion(documentId, isAutoSave);

        // Get existing publish status to preserve it
        const { data: existingData, error: fetchError } = await supabase
          .from('knowledge_sources')
          .select('published, published_at')
          .eq('id', documentId)
          .single();
          
        if (fetchError) {
          console.error("Error fetching existing document data:", fetchError);
          throw fetchError;
        }
        
        const isPublished = existingData?.published === true;
        const publishedAt = existingData?.published_at;

        // Update existing document
        response = await supabase
          .from('knowledge_sources')
          .update({
            ...knowledgeData,
            updated_at: new Date().toISOString(),
            published: isPublished, // Preserve published status
            published_at: publishedAt // Preserve published timestamp
          })
          .eq('id', documentId)
          .select();
      } else {
        console.log("Creating new document with user_id:", userId);
        
        // Create new document
        response = await supabase
          .from('knowledge_sources')
          .insert({
            ...knowledgeData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: userId,
            published: false // New documents start unpublished
          })
          .select()
          .single();
      }

      if (response.error) {
        console.error("Database error during save:", response.error);
        throw response.error;
      }

      console.log("Save operation response:", response);
      savedDocumentId = response.data.id;
      console.log("Document saved with ID:", savedDocumentId);

      // Verify saved data
      const { data: verifyData, error: verifyError } = await supabase
        .from('knowledge_sources')
        .select('user_id, published')
        .eq('id', savedDocumentId)
        .single();

      if (verifyError) {
        console.warn("Error verifying saved data:", verifyError);
      } else {
        console.log("Saved draft data:", verifyData);
        
        // Ensure user_id is set correctly
        if (!verifyData.user_id) {
          const { error: fixError } = await supabase
            .from('knowledge_sources')
            .update({ user_id: userId })
            .eq('id', savedDocumentId);
            
          if (fixError) {
            console.error("Failed to fix missing user_id:", fixError);
          } else {
            console.log("Fixed missing user_id for document:", savedDocumentId);
          }
        }
      }

      if (!isAutoSave) {
        toast({
          title: "Draft Saved",
          description: documentId ? "Your draft has been updated and previous version saved" : "Your draft has been saved successfully",
        });
      }

      return { success: true, documentId: savedDocumentId };
    } catch (error) {
      console.error('Error saving draft:', error);
      if (!isAutoSave) {
        handleError(
          error,
          "There was an error saving your draft. Please try again.",
          { 
            level: "error", 
            actionLabel: "Retry", 
            action: () => saveDraft(title, content, templateId, userId, documentId, isAutoSave) 
          }
        );
      }
      return { success: false, documentId: null, error };
    }
  };

  return { saveDraft };
};
