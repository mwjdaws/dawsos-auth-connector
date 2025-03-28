
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseDocumentOperationHandlersProps {
  title: string;
  content: string;
  templateId: string | null;
  documentId?: string;
  sourceId?: string;
  saveDraft: (title: string, content: string, templateId: string | null, userId: string, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, userId: string) => Promise<any>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

/**
 * Hook for handling document save and publish operations
 */
export const useDocumentOperationHandlers = ({
  title,
  content,
  templateId,
  documentId,
  sourceId,
  saveDraft,
  publishDocument,
  setLastSavedTitle,
  setLastSavedContent,
  setIsDirty,
  onSaveDraft,
  onPublish
}: UseDocumentOperationHandlersProps) => {
  const { user } = useAuth();

  // Handle save draft wrapper
  const handleSaveDraft = async (isAutoSave = false) => {
    if (!user) {
      if (!isAutoSave) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to save drafts",
          variant: "destructive",
        });
      }
      return null;
    }
    
    // Ensure we always pass a valid user.id
    if (!user.id) {
      console.error("User object exists but has no ID property");
      if (!isAutoSave) {
        toast({
          title: "Authentication Error",
          description: "User ID not available. Please try logging out and back in.",
          variant: "destructive",
        });
      }
      return null;
    }
    
    console.log("Saving draft with user ID:", user.id);
    
    const result = await saveDraft(title, content, templateId, user.id, isAutoSave);
    if (result) {
      // Update last saved state
      setLastSavedTitle(title);
      setLastSavedContent(content);
      setIsDirty(false);
    }
    return result;
  };

  // Handle publish wrapper with improved error handling and console logs
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to publish content",
        variant: "destructive",
      });
      return;
    }
    
    // Explicit check for user.id
    if (!user.id) {
      console.error("User object exists but has no ID property");
      toast({
        title: "Authentication Error",
        description: "User ID not available. Please try logging out and back in.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Publishing document with user ID:", user.id);
      
      // First save the draft to ensure we have the latest content
      const savedId = await handleSaveDraft(false);
      console.log("Draft saved with ID:", savedId);
      
      if (!savedId) {
        console.error("Failed to save draft before publishing");
        toast({
          title: "Error Publishing",
          description: "Could not save document before publishing. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Now publish the document
      console.log("Attempting to publish document ID:", savedId);
      const publishResult = await publishDocument(title, content, templateId, user.id);
      
      if (publishResult && publishResult.success) {
        console.log("Document successfully published with ID:", savedId);
        
        if (onPublish) {
          onPublish(savedId, title, content, templateId);
        }
        
        // Check if the document was actually published in the database
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('published, published_at')
          .eq('id', savedId)
          .single();
          
        if (error) {
          console.warn("Error verifying published status:", error);
        } else if (data && !data.published) {
          console.warn("Document not marked as published in database after publish operation");
          
          // Attempt to fix the published status
          const { error: updateError } = await supabase
            .from('knowledge_sources')
            .update({
              published: true,
              published_at: new Date().toISOString(),
            })
            .eq('id', savedId);
            
          if (updateError) {
            console.error("Failed to update published status:", updateError);
          } else {
            console.log("Fixed published status for document:", savedId);
          }
        } else {
          console.log("Document correctly marked as published in database:", data);
        }
      } else {
        console.error("Publish operation failed:", publishResult?.error || "Unknown error");
        toast({
          title: "Error Publishing",
          description: publishResult?.error || "There was an error publishing your content. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in publish workflow:', error);
      toast({
        title: "Error Publishing",
        description: error instanceof Error ? error.message : "There was an error publishing your content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleSaveDraft,
    handlePublish
  };
};
