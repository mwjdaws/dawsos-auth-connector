
import { validateDocumentTitle, ValidationResult } from '@/utils/validation';

/**
 * Hook for validation operations
 */
export const useValidation = () => {
  const validateTitle = (title: string): ValidationResult => {
    return validateDocumentTitle(title);
  };
  
  return {
    validateTitle
  };
};
