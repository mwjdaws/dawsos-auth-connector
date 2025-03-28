
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
    return validateDocumentTitle(title);
  };
  
  return {
    validateForPublish
  };
};
