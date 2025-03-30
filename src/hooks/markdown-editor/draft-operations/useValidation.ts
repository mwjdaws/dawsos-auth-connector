
import { validateDocumentTitle } from '@/utils/validation';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Hook for document validation operations
 */
export const useValidation = () => {
  /**
   * Validate a document before saving
   */
  const validateDocumentForSave = (title: string): ValidationResult => {
    return validateDocumentTitle(title);
  };
  
  return {
    validateDocumentForSave
  };
};
