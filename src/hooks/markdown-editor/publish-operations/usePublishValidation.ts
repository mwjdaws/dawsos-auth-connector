
import { validateDocumentTitle, ValidationResult } from '@/utils/validation';

/**
 * Hook for publish validation operations
 */
export const usePublishValidation = () => {
  /**
   * Validate a document before publishing
   */
  const validateForPublish = (title: string): ValidationResult => {
    const titleValidation = validateDocumentTitle(title);
    
    // If title is invalid, return that error
    if (!titleValidation.isValid) {
      return titleValidation;
    }
    
    // All checks passed
    return {
      isValid: true,
      message: null
    };
  };
  
  return {
    validateForPublish
  };
};
