
import { DraftOperationsContext } from '../types';

/**
 * Hook for version management in draft operations
 */
export const useVersioning = (context: DraftOperationsContext) => {
  /**
   * Create a version after saving a draft
   */
  const createVersionAfterSave = async (
    documentId: string,
    content: string,
    isAutoSave = false
  ): Promise<void> => {
    try {
      // Skip version creation for auto-save to reduce database load
      if (isAutoSave || !context.createVersion) {
        return;
      }
      
      console.log('Creating version after save for document:', documentId);
      await context.createVersion(documentId, content, {
        reason: 'Manual save',
        auto_save: isAutoSave
      });
    } catch (error) {
      console.error('Error creating version after save:', error);
      // Silent failure for versioning - it shouldn't block the save operation
    }
  };

  return {
    createVersionAfterSave
  };
};
