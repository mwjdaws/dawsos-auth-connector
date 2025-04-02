
import { DraftOperationsContext, SaveDraftResult } from '../types';
import { useValidation } from './useValidation';
import { useDatabaseOperations } from './useDatabaseOperations';
import { useVersioning } from './useVersioning';

/**
 * Hook for draft document operations
 */
export const useDraftOperations = (context: DraftOperationsContext) => {
  const { validateDocumentForSave } = useValidation();
  const { performDatabaseOperation } = useDatabaseOperations();
  const { createVersionAfterSave } = useVersioning(context);
  
  /**
   * Save a document as a draft
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId: string | undefined,
    documentId?: string,
    isAutoSave = false
  ): Promise<SaveDraftResult> => {
    // Skip validation for autosave to reduce processing
    if (!isAutoSave) {
      const validation = validateDocumentForSave(title);
      if (!validation.isValid) {
        return { 
          success: false, 
          documentId: null,
          error: validation.errorMessage 
        };
      }
    }

    try {
      // Skip operations for temp documents if no user is authenticated
      if (documentId?.startsWith('temp-') && !userId) {
        console.log('Skipping database operation for temp document without authentication');
        return { 
          success: true, 
          documentId: documentId
        };
      }
      
      // Perform database operations
      const result = await performDatabaseOperation(
        title, 
        content, 
        templateId, 
        externalSourceUrl, 
        userId, 
        documentId
      );
      
      // Create a version if the save was successful
      if (result.success && !isAutoSave && result.documentId) {
        await createVersionAfterSave(result.documentId, content, isAutoSave);
      }
      
      return result;
    } catch (error) {
      console.error('Unexpected error in saveDraft:', error);
      return { 
        success: false, 
        documentId: null,
        error
      };
    }
  };

  return {
    saveDraft
  };
};
