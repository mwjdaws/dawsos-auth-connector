
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { SaveHandlerOptions } from '../types';
import { useDocumentLifecycle } from '../useDocumentLifecycle';

interface UseSaveDraftHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  documentId?: string;
  sourceId?: string;
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined, isAutoSave?: boolean) => Promise<string | null>;
  setLastSavedTitle: (title: string) => void;
  setLastSavedContent: (content: string) => void;
  setLastSavedExternalSourceUrl: (url: string) => void;
  setIsDirty: (isDirty: boolean) => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any, isAutoSave?: boolean) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

export const useSaveDraftHandler = ({
  title,
  content,
  templateId,
  externalSourceUrl,
  documentId,
  sourceId,
  saveDraft,
  setLastSavedTitle,
  setLastSavedContent,
  setLastSavedExternalSourceUrl,
  setIsDirty,
  onSaveDraft,
  createVersion,
  enrichContentWithOntology
}: UseSaveDraftHandlerProps) => {
  const [isSavingManually, setIsSavingManually] = useState(false);
  
  // Use the document lifecycle hook
  const { 
    validateDocument, 
    createDocumentVersion, 
    enrichDocumentContent 
  } = useDocumentLifecycle({
    createVersion,
    enrichContentWithOntology
  });
  
  /**
   * Save the document as a draft with user feedback
   */
  const handleSaveDraft = async (options: SaveHandlerOptions = {}) => {
    const { isManualSave = true, isAutoSave = false } = options;
    
    // Skip validation for autosave, validate manually saved documents
    if (isManualSave && !isAutoSave) {
      if (!validateDocument(title, isAutoSave)) {
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
      
      const savedId = await saveDraft(title, content, templateId, externalSourceUrl, userId, isAutoSave);
      
      if (savedId) {
        // Update lastSaved state to reflect the current values
        setLastSavedTitle(title);
        setLastSavedContent(content);
        setLastSavedExternalSourceUrl(externalSourceUrl);
        setIsDirty(false);
        
        // Create a version for manual saves only
        // IMPORTANT: Version is created AFTER successful save, ensuring we have a valid savedId
        if (!isAutoSave) {  // Changed to skip version creation only for autosaves
          await createDocumentVersion(
            savedId, 
            content, 
            {
              reason: isManualSave ? 'Manual save' : 'System save',
              auto_version: !isManualSave
            },
            isAutoSave
          );
        }
        
        // Run ontology enrichment after successful save
        // Only for manual saves to avoid excessive processing
        if (isManualSave && !isAutoSave) {  // Added explicit check for !isAutoSave for clarity
          await enrichDocumentContent(
            savedId,
            content,
            title,
            isAutoSave,
            false
          );
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
              onSaveDraft(savedId, title, content, templateId, externalSourceUrl);
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
        // Use the handleError utility directly for error handling in the catch block
        toast({
          title: "Failed to save draft",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        });
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

  return {
    handleSaveDraft,
    isSavingManually
  };
};
