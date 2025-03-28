
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
      return;
    }

    setIsSaving(true);
    try {
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: userId,
      };

      let savedDocumentId = documentId;
      let response;

      if (documentId) {
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
        // Create new document
        response = await supabase
          .from('knowledge_sources')
          .insert(knowledgeData)
          .select()
          .single();
      }

      if (response.error) {
        throw response.error;
      }

      savedDocumentId = response.data.id;

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
      return;
    }

    setIsPublishing(true);
    try {
      // First save the draft to ensure we have the latest content
      const savedId = await saveDraft(title, content, templateId, userId);
      
      if (savedId) {
        // Update the published status
        const { error: publishError } = await supabase
          .from('knowledge_sources')
          .update({
            published: true,
            published_at: new Date().toISOString()
          })
          .eq('id', savedId);

        if (publishError) throw publishError;
        
        // Try to trigger AI enrichment via edge function (if available)
        try {
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
          }
        } catch (enrichmentError) {
          // Log but don't fail if enrichment function isn't available
          console.log('Content enrichment not available:', enrichmentError);
        }
        
        if (onPublish) {
          onPublish(savedId, title, content, templateId);
        }
        
        toast({
          title: "Content Published",
          description: "Your content has been published successfully",
        });
      }
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "Error Publishing",
        description: "There was an error publishing your content. Please try again.",
        variant: "destructive",
      });
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
