
import { validateDocumentTitle, validateDocumentForSave } from '@/utils/validation/documentValidation';
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
  const validateDocumentForSaving = (title: string): ValidationResult => {
    return validateDocumentForSave(title);
  };
  
  return {
    validateTitle,
    validateDocumentForSave: validateDocumentForSaving
  };
};
