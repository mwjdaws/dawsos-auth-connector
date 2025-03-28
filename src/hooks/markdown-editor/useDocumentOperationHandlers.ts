
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';

interface UseDocumentOperationHandlersProps {
  title: string;
  content: string;
  templateId: string | null;
  documentId?: string;
  sourceId?: string;
  saveDraft: (title: string, content: string, templateId: string | null, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, userId: string | undefined) => Promise<any>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

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
  const [isSavingManually, setIsSavingManually] = useState(false);
  
  /**
   * Save the document as a draft with user feedback
   * @param isManualSave Whether the save was initiated manually by the user
   * @param isAutoSave Whether the save was initiated by the autosave feature
   */
  const handleSaveDraft = async (isManualSave = true, isAutoSave = false) => {
    // Skip UI feedback for autosave
    if (isManualSave) {
      if (!title.trim()) {
        toast({
          title: "Title Required",
          description: "Please enter a title before saving",
          variant: "destructive",
        });
        return null;
      }
      
      setIsSavingManually(true);
    }
    
    try {
      // Use sourceId as fallback when documentId is not available
      const effectiveDocumentId = documentId || sourceId;
      
      // Get current user ID (from auth context if available)
      const userId = undefined; // Replace with actual user ID from auth context if available
      
      const savedId = await saveDraft(title, content, templateId, userId, isAutoSave);
      
      if (savedId) {
        // Update lastSaved state to reflect the current values
        setLastSavedTitle(title);
        setLastSavedContent(content);
        setIsDirty(false);
        
        // Provide user feedback for manual saves
        if (isManualSave && !isAutoSave) {
          toast({
            title: "Draft Saved",
            description: "Your document has been saved as a draft",
          });
          
          // Call the onSaveDraft callback if provided
          if (onSaveDraft) {
            onSaveDraft(savedId, title, content, templateId);
          }
        }
      }
      
      return savedId;
    } catch (error) {
      if (isManualSave && !isAutoSave) {
        handleError(
          error,
          "Failed to save draft",
          { level: "error", technical: false }
        );
      } else {
        // Log autosave errors but don't show to user
        console.error('Autosave error:', error);
      }
      return null;
    } finally {
      if (isManualSave) {
        setIsSavingManually(false);
      }
    }
  };
  
  /**
   * Publish the document with user feedback
   */
  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return;
    }
    
    // Save first to ensure we have the latest content
    const savedId = await handleSaveDraft(true, false);
    if (!savedId) {
      toast({
        title: "Save Required",
        description: "Your document must be saved before publishing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current user ID (from auth context if available)
      const userId = undefined; // Replace with actual user ID from auth context if available
      
      const result = await publishDocument(title, content, templateId, userId);
      
      if (result.success) {
        toast({
          title: "Published Successfully",
          description: "Your document has been published",
        });
        
        // Call the onPublish callback if provided
        if (onPublish && result.documentId) {
          onPublish(result.documentId, title, content, templateId);
        }
      } else {
        throw new Error(result.error || 'Failed to publish document');
      }
    } catch (error) {
      handleError(
        error,
        "Failed to publish document",
        { level: "error", technical: false }
      );
    }
  };
  
  return {
    handleSaveDraft,
    handlePublish,
    isSavingManually
  };
};
