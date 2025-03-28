
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDocumentVersioning } from './useDocumentVersioning';

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
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: userId,
      };

      console.log("Document data to save:", knowledgeData);
      
      let savedDocumentId = documentId;
      let response;

      if (documentId) {
        console.log("Updating existing document ID:", documentId);
        
        // Before updating the document, create a version of the current content
        await createVersion(documentId, isAutoSave);

        // Update existing document
        response = await supabase
          .from('knowledge_sources')
          .update(knowledgeData)
          .eq('id', documentId)
          .select()
          .single();
      } else {
        console.log("Creating new document");
        
        // Create new document
        response = await supabase
          .from('knowledge_sources')
          .insert(knowledgeData)
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
        toast({
          title: "Error Saving Draft",
          description: "There was an error saving your draft. Please try again.",
          variant: "destructive",
        });
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
      
      // Update the published status
      const { data, error: publishError } = await supabase
        .from('knowledge_sources')
        .update({
          published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', savedId)
        .select();

      if (publishError) {
        console.error("Error updating publish status:", publishError);
        throw publishError;
      }
      
      console.log("Publish status updated successfully:", data);
      
      // Try to trigger AI enrichment via edge function (if available)
      try {
        console.log("Attempting to invoke AI enrichment for document ID:", savedId);
        
        const { error: enrichError } = await supabase.functions.invoke('enrich-content', {
          body: { 
            documentId: savedId,
            title,
            content
          }
        });
        
        if (enrichError) {
          console.warn('AI enrichment function failed or not available:', enrichError);
          // Continue with publishing even if enrichment fails
        } else {
          console.log("AI enrichment function invoked successfully");
        }
      } catch (enrichmentError) {
        // Log but don't fail if enrichment function isn't available
        console.log('Content enrichment not available or failed:', enrichmentError);
      }
      
      if (onPublish) {
        onPublish(savedId, title, content, templateId);
      }
      
      return { success: true, documentId: savedId };
    } catch (error) {
      console.error('Error publishing content:', error);
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
