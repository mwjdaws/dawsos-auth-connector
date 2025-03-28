
import { handleError } from '@/utils/error-handling';
import { DraftOperationsContext } from '../types';

/**
 * Hook for version creation after draft operations
 */
export const useVersioning = (context: DraftOperationsContext) => {
  /**
   * Create a version after successfully saving a draft
   */
  const createVersionAfterSave = async (
    documentId: string, 
    content: string,
    isAutoSave: boolean
  ) => {
    if (!context.createVersion) {
      return;
    }
    
    try {
      if (!isAutoSave) {
        await context.createVersion(documentId, content, {
          reason: 'Manual save',
          auto_version: false
        });
      }
    } catch (versionError) {
      // Log version creation error but don't fail the save operation
      console.error('Error creating version but continuing:', versionError);
      handleError(
        versionError,
        "Warning: Could not create document version",
        { level: "warning", technical: true, silent: isAutoSave }
      );
    }
  };
  
  return {
    createVersionAfterSave
  };
};
