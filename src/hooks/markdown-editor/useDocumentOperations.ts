
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDocumentVersioning } from './useDocumentVersioning';
import { handleError } from '@/utils/error-handling';

interface DocumentOperationsProps {
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export const useDocumentOperations = ({
  documentId,
  onSaveDraft,
  onPublish
}: DocumentOperationsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { createVersion } = useDocumentVersioning();

  /**
   * Saves the current document as a draft
   * @param title Document title
   * @param content Document content
   * @param templateId Template ID if any
   * @param userId User ID
   * @param isAutoSave Whether this is triggered by autosave
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave = false
  ) => {
    if (!title.trim()) {
      if (!isAutoSave) {
        toast({
          title: "Title Required",
          description: "Please enter a title before saving",
          variant: "destructive",
        });
      }
      return null;
    }

    if (!userId) {
      if (!isAutoSave) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to save content",
          variant: "destructive",
        });
      }
      return null;
    }

    console.log("Saving document with title:", title, "and user ID:", userId);
    
    setIsSaving(true);
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

      if (onSaveDraft) {
        onSaveDraft(savedDocumentId, title, content, templateId);
      }

      if (!isAutoSave) {
        toast({
          title: "Draft Saved",
          description: documentId ? "Your draft has been updated and previous version saved" : "Your draft has been saved successfully",
        });
      }

      return savedDocumentId;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (!isAutoSave) {
        handleError(
          error,
          "There was an error saving your draft. Please try again.",
          { 
            level: "error", 
            actionLabel: "Retry", 
            action: () => saveDraft(title, content, templateId, userId, isAutoSave) 
          }
        );
      }
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Publishes the current document
   * @param title Document title
   * @param content Document content
   * @param templateId Template ID if any
   * @param userId User ID
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined
  ) => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return { success: false, error: "Title is required" };
    }

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to publish content",
        variant: "destructive",
      });
      return { success: false, error: "Authentication required" };
    }

    console.log("Publishing document with title:", title, "and user ID:", userId);
    
    setIsPublishing(true);
    try {
      // First save the draft to ensure we have the latest content
      const savedId = await saveDraft(title, content, templateId, userId);
      
      if (!savedId) {
        console.error("Failed to save draft before publishing");
        return { success: false, error: "Failed to save draft before publishing" };
      }
      
      console.log("Updating publish status for document ID:", savedId);
      
      // Create enriched metadata for published version
      const publishMetadata = {
        word_count: content.split(/\s+/).length,
        reading_time_minutes: Math.ceil(content.split(/\s+/).length / 200),
        published_by: userId,
        user_id: userId, // Ensure user_id is in metadata
        published_date: new Date().toISOString(),
        version: 1
      };
      
      // Update the published status - EXPLICITLY set published to true
      const { data, error: publishError } = await supabase
        .from('knowledge_sources')
        .update({
          published: true,
          published_at: new Date().toISOString(),
          metadata: publishMetadata
        })
        .eq('id', savedId)
        .select();

      if (publishError) {
        console.error("Error updating publish status:", publishError);
        throw publishError;
      }
      
      console.log("Publish status updated successfully:", data);
      
      // Verify the published status was set correctly
      const { data: verifyData, error: verifyError } = await supabase
        .from('knowledge_sources')
        .select('published, published_at, user_id')
        .eq('id', savedId)
        .single();
        
      if (verifyError) {
        console.warn("Error verifying published status:", verifyError);
      } else {
        console.log("Published content data:", verifyData);
        
        if (!verifyData.published) {
          console.warn("Document not marked as published in database");
          
          // Try one more time to ensure published status is set
          const { error: fixError } = await supabase
            .from('knowledge_sources')
            .update({
              published: true,
              published_at: new Date().toISOString()
            })
            .eq('id', savedId);
            
          if (fixError) {
            console.error("Failed to fix published status:", fixError);
          } else {
            console.log("Fixed published status for document:", savedId);
          }
        }
        
        // Ensure user_id is set correctly
        if (!verifyData.user_id) {
          const { error: fixError } = await supabase
            .from('knowledge_sources')
            .update({ user_id: userId })
            .eq('id', savedId);
            
          if (fixError) {
            console.error("Failed to fix missing user_id:", fixError);
          } else {
            console.log("Fixed missing user_id for document:", savedId);
          }
        }
      }
      
      // Try to trigger AI enrichment via edge function (if available)
      try {
        console.log("Attempting to invoke AI enrichment for document ID:", savedId);
        
        const { data: enrichData, error: enrichError } = await supabase.functions.invoke('enrich-content', {
          body: { 
            documentId: savedId,
            title,
            content
          }
        });
        
        if (enrichError) {
          console.warn('AI enrichment function failed:', enrichError);
          // Continue with publishing even if enrichment fails
        } else {
          console.log("AI enrichment function result:", enrichData);
        }
      } catch (enrichmentError) {
        // Log but don't fail if enrichment function isn't available
        console.log('Content enrichment error:', enrichmentError);
      }
      
      if (onPublish) {
        onPublish(savedId, title, content, templateId);
      }
      
      // Add success toast message
      toast({
        title: "Content Published Successfully",
        description: "Your content has been published and is now publicly available.",
      });
      
      return { success: true, documentId: savedId };
    } catch (error) {
      console.error('Error publishing content:', error);
      
      handleError(
        error,
        "There was an error publishing your content. Please try again.",
        { 
          level: "error", 
          actionLabel: "Retry", 
          action: () => publishDocument(title, content, templateId, userId) 
        }
      );
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error during publishing" 
      };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    isSaving,
    isPublishing,
    saveDraft,
    publishDocument
  };
};
