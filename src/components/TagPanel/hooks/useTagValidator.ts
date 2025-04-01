
import { useState, useCallback } from 'react';
import { handleError, ErrorLevel } from '@/utils/errors';

interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Tag validation hook for validating tags in the TagPanel
 */
export function useTagValidator() {
  const [lastValidated, setLastValidated] = useState<string>('');
  
  /**
   * Validates a tag string based on common rules
   */
  const validateTag = useCallback((tag: string): ValidationResult => {
    setLastValidated(tag);
    
    // Empty check
    if (!tag || tag.trim() === '') {
      return { isValid: false, message: 'Tag cannot be empty' };
    }
    
    // Minimum length check
    if (tag.trim().length < 2) {
      return { isValid: false, message: 'Tag must be at least 2 characters long' };
    }
    
    // Maximum length check
    if (tag.trim().length > 50) {
      return { isValid: false, message: 'Tag must be less than 50 characters long' };
    }
    
    // Characters validation (allow alphanumeric, spaces, dashes, dots)
    const invalidChars = /[^\w\s\-\.]/;
    if (invalidChars.test(tag)) {
      return { isValid: false, message: 'Tag contains invalid characters' };
    }
    
    return { isValid: true, message: null };
  }, []);
  
  /**
   * Validates the tag and reports errors
   */
  const validateTagWithErrorHandling = useCallback((tag: string): boolean => {
    const result = validateTag(tag);
    
    if (!result.isValid && result.message) {
      handleError(
        new Error(result.message),
        result.message,
        { level: ErrorLevel.Warning }
      );
      return false;
    }
    
    return true;
  }, [validateTag]);
  
  return {
    validateTag,
    validateTagWithErrorHandling,
    lastValidated
  };
}

export default useTagValidator;
