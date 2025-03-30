
import { validateDocumentTitle } from '@/utils/validation';

/**
 * Interface for validation results
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Hook for validation operations
 */
export const useValidation = () => {
  const validateTitle = (title: string): ValidationResult => {
    const result = validateDocumentTitle(title);
    
    return {
      isValid: result.isValid,
      errorMessage: result.isValid ? null : result.message
    };
  };
  
  return {
    validateTitle
  };
};
