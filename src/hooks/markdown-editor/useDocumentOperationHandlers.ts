
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { validateDocumentTitle } from '@/utils/validation';
import { useDocumentVersioning } from './useDocumentVersioning';

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
  const { createVersion } = useDocumentVersioning();
  
  /**
   * Save the document as a draft with user feedback
   * @param isManualSave Whether the save was initiated manually by the user
   * @param isAutoSave Whether the save was initiated by the autosave feature
   */
  const handleSaveDraft = async (isManualSave = true, isAutoSave = false) => {
    // Skip validation for autosave
    if (isManualSave && !isAutoSave) {
      const validation = validateDocumentTitle(title);
      if (!validation.isValid) {
        toast({
          title: "Invalid Title",
          description: validation.errorMessage,
          variant: "destructive",
        });
        return null;
      }
    }
    
    if (isManualSave) {
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
        
        // Create a version for manual saves only
        if (isManualSave && !isAutoSave && savedId) {
          try {
            console.log('Creating version after manual save for document:', savedId);
            await createVersion(savedId, content, {
              reason: 'Manual save',
              auto_version: false
            });
          } catch (versionError) {
            console.error('Error creating version after save:', versionError);
          }
        }
        
        // Provide user feedback for manual saves
        if (isManualSave && !isAutoSave) {
          toast({
            title: "Draft Saved",
            description: "Your document has been saved as a draft",
          });
          
          // Call the onSaveDraft callback if provided
          if (onSaveDraft) {
            try {
              onSaveDraft(savedId, title, content, templateId);
            } catch (callbackError) {
              console.error('Error in onSaveDraft callback:', callbackError);
            }
          }
        }
      } else if (isManualSave && !isAutoSave) {
        // Only show error for manual saves that failed
        toast({
          title: "Save Failed",
          description: "There was a problem saving your document",
          variant: "destructive",
        });
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
    // Always validate title for publishing
    const validation = validateDocumentTitle(title);
    if (!validation.isValid) {
      toast({
        title: "Invalid Title",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    try {
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
      
      // Get current user ID (from auth context if available)
      const userId = undefined; // Replace with actual user ID from auth context if available
      
      const result = await publishDocument(title, content, templateId, userId);
      
      if (result.success) {
        // Create a version for the published document
        if (result.documentId) {
          try {
            console.log('Creating version after publish for document:', result.documentId);
            await createVersion(result.documentId, content, {
              reason: 'Published document',
              published: true
            });
          } catch (versionError) {
            console.error('Error creating version after publish:', versionError);
          }
        }
        
        toast({
          title: "Published Successfully",
          description: "Your document has been published",
        });
        
        // Call the onPublish callback if provided
        if (onPublish && result.documentId) {
          try {
            onPublish(result.documentId, title, content, templateId);
          } catch (callbackError) {
            console.error('Error in onPublish callback:', callbackError);
          }
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
