
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { useAuth } from '@/hooks/useAuth';

interface UseDocumentOperationHandlersProps {
  title: string;
  content: string;
  templateId: string | null;
  documentId?: string;
  sourceId?: string;
  saveDraft: (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave?: boolean
  ) => Promise<string | null>;
  publishDocument: (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined
  ) => Promise<any>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

/**
 * Hook for document operation handlers with UI feedback
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
  const [isSavingManually, setIsSavingManually] = useState(false);

  // Get the effective document ID (either documentId or sourceId)
  const effectiveDocumentId = documentId || sourceId;
  const isTemp = effectiveDocumentId ? effectiveDocumentId.startsWith('temp-') : false;

  /**
   * Handle saving a draft with feedback
   */
  const handleSaveDraft = async (showFeedback = true) => {
    if (!title.trim()) {
      if (showFeedback) {
        toast({
          title: "Title Required",
          description: "Please enter a title before saving",
          variant: "destructive",
        });
      }
      return null;
    }

    if (!showFeedback) {
      // For autosave, don't show UI feedback but still save
      // Skip autosave for temporary documents
      if (isTemp) {
        return null;
      }
      
      try {
        const savedId = await saveDraft(title, content, templateId, user?.id, true);
        
        if (savedId) {
          setLastSavedTitle(title);
          setLastSavedContent(content);
          setIsDirty(false);
        }
        
        return savedId;
      } catch (error) {
        // Silent failure for autosave
        console.error('Autosave failed:', error);
        return null;
      }
    }

    // Manual save with UI feedback
    try {
      setIsSavingManually(true);
      
      const savedId = await saveDraft(title, content, templateId, user?.id, false);
      
      if (savedId) {
        setLastSavedTitle(title);
        setLastSavedContent(content);
        setIsDirty(false);
        
        if (onSaveDraft) {
          onSaveDraft(savedId, title, content, templateId);
        }
        
        toast({
          title: "Draft Saved",
          description: "Your document has been saved",
        });
      }
      
      return savedId;
    } catch (error) {
      handleError(
        error, 
        "Failed to save draft", 
        { 
          level: "error",
          actionLabel: "Try Again",
          action: () => handleSaveDraft(true)
        }
      );
      return null;
    } finally {
      setIsSavingManually(false);
    }
  };

  /**
   * Handle publishing a document with feedback
   */
  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return null;
    }
    
    // Cannot publish temporary documents
    if (isTemp) {
      toast({
        title: "Save Required",
        description: "Please save the document as a draft before publishing",
        variant: "warning",
      });
      return null;
    }
    
    try {
      // First ensure we have the latest content saved
      const savedId = await handleSaveDraft(false);
      
      if (!savedId) {
        throw new Error("Failed to save document before publishing");
      }
      
      const result = await publishDocument(title, content, templateId, user?.id);
      
      if (result.success) {
        if (onPublish) {
          onPublish(savedId, title, content, templateId);
        }
        
        toast({
          title: "Document Published",
          description: "Your document has been published successfully",
        });
        
        return result;
      } else {
        throw new Error(result.error || "Unknown error during publishing");
      }
    } catch (error) {
      handleError(
        error, 
        "Failed to publish document", 
        { 
          level: "error",
          actionLabel: "Try Again",
          action: () => handlePublish()
        }
      );
      return null;
    }
  };

  return {
    handleSaveDraft,
    handlePublish,
    isSavingManually
  };
};
