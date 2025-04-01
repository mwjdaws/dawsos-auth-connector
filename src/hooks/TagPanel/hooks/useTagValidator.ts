
import { useState, useCallback } from 'react';

export interface TagValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Hook for validating tags before operations
 */
export function useTagValidator() {
  const [validationResult, setValidationResult] = useState<TagValidationResult>({
    isValid: true,
    message: null
  });

  /**
   * Validates a tag name before creation or update
   */
  const validateTag = useCallback((tagName: string): TagValidationResult => {
    // Reset validation state
    let result: TagValidationResult = {
      isValid: true,
      message: null
    };

    // Check if tag is empty
    if (!tagName || tagName.trim() === '') {
      result = {
        isValid: false,
        message: 'Tag name cannot be empty'
      };
      setValidationResult(result);
      return result;
    }

    // Check if tag is too short
    if (tagName.trim().length < 2) {
      result = {
        isValid: false,
        message: 'Tag must be at least 2 characters long'
      };
      setValidationResult(result);
      return result;
    }

    // Check if tag is too long
    if (tagName.trim().length > 50) {
      result = {
        isValid: false,
        message: 'Tag cannot exceed 50 characters'
      };
      setValidationResult(result);
      return result;
    }

    // Set validation state and return result
    setValidationResult(result);
    return result;
  }, []);

  return {
    validateTag,
    validationResult
  };
}

export default useTagValidator;
