
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { validateDocumentTitle } from '@/utils/validation';
import { SaveHandlerOptions } from '../types';

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
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<any>;
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
  
  /**
   * Save the document as a draft with user feedback
   */
  const handleSaveDraft = async (options: SaveHandlerOptions = {}) => {
    const { isManualSave = true, isAutoSave = false } = options;
    
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
      
      const savedId = await saveDraft(title, content, templateId, externalSourceUrl, userId, isAutoSave);
      
      if (savedId) {
        // Update lastSaved state to reflect the current values
        setLastSavedTitle(title);
        setLastSavedContent(content);
        setLastSavedExternalSourceUrl(externalSourceUrl);
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
        
        // Run ontology enrichment after successful save
        // Only for manual saves to avoid excessive processing
        if (isManualSave && enrichContentWithOntology && savedId) {
          try {
            // Process in background, don't wait for result
            console.log('Running ontology enrichment after save for document:', savedId);
            enrichContentWithOntology(savedId, content, title, {
              autoLink: false, // Don't auto-link terms for saves
              saveMetadata: true // Just store the suggestions in metadata
            }).catch(err => console.error('Background enrichment error:', err));
          } catch (enrichError) {
            console.error('Error starting ontology enrichment:', enrichError);
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

  return {
    handleSaveDraft,
    isSavingManually
  };
};
