
import { validateDocumentTitle, ValidationResult } from '@/utils/validation';

/**
 * Hook for validation operations
 */
export const useValidation = () => {
  /**
   * Validate a document title
   */
  const validateTitle = (title: string): ValidationResult => {
    return validateDocumentTitle(title);
  };
  
  /**
   * Validate a document before saving
   */
  const validateDocumentForSave = (title: string): ValidationResult => {
    return validateDocumentTitle(title);
  };
  
  return {
    validateTitle,
    validateDocumentForSave
  };
};
