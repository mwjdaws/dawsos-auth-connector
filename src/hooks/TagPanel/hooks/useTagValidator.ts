
import { useState, useCallback } from 'react';
import { 
  createValidResult, 
  createInvalidResult, 
  createTagValidationResult
} from '@/utils/validation/types';

/**
 * Hook for validating tags before operations
 */
export function useTagValidator() {
  const [validationResult, setValidationResult] = useState<TagValidationResult>({
    isValid: true,
    message: null,
    errorMessage: null,
    resultType: 'tag'
  });

  /**
   * Validates a tag name before creation or update
   */
  const validateTag = useCallback((tagName: string): TagValidationResult => {
    // Reset validation state
    let result: TagValidationResult = {
      isValid: true,
      message: null,
      errorMessage: null,
      resultType: 'tag'
    };

    // Check if tag is empty
    if (!tagName || tagName.trim() === '') {
      result = createTagValidationResult(
        false,
        'Tag name cannot be empty',
        null
      );
      setValidationResult(result);
      return result;
    }

    // Check if tag is too short
    if (tagName.trim().length < 2) {
      result = createTagValidationResult(
        false,
        'Tag must be at least 2 characters long',
        null
      );
      setValidationResult(result);
      return result;
    }

    // Check if tag is too long
    if (tagName.trim().length > 50) {
      result = createTagValidationResult(
        false,
        'Tag cannot exceed 50 characters',
        null
      );
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
