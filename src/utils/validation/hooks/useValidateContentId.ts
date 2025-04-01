
import { useState, useCallback } from 'react';
import { validateContentId } from '../contentIdValidation';
import { ContentIdValidationResult } from '../types';

/**
 * Custom hook for validating content IDs with state management
 * 
 * @returns Object with validation state and functions
 */
export function useValidateContentId() {
  const [validationResult, setValidationResult] = useState<ContentIdValidationResult | null>(null);
  
  const validate = useCallback((contentId: string, contentExists?: boolean) => {
    const result = validateContentId(contentId, contentExists);
    setValidationResult(result);
    return result;
  }, []);
  
  const reset = useCallback(() => {
    setValidationResult(null);
  }, []);
  
  return {
    validationResult,
    validate,
    reset,
    isValid: validationResult ? validationResult.isValid : false,
    error: validationResult ? validationResult.errorMessage : null
  };
}
