
import { validateDocumentTitle } from '@/utils/validation/documentValidation';
import type { ValidationResult } from '@/utils/validation/types';

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
