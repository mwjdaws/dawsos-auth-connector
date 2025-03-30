
import { validateDocumentTitle } from '@/utils/validation';

interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Hook for publish validation operations
 */
export const usePublishValidation = () => {
  /**
   * Validate a document before publishing
   */
  const validateForPublish = (title: string): ValidationResult => {
    const result = validateDocumentTitle(title);
    
    return {
      isValid: result.isValid,
      errorMessage: result.isValid ? null : result.message
    };
  };
  
  return {
    validateForPublish
  };
};
