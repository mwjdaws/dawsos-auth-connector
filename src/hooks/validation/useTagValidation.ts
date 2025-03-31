
/**
 * useTagValidation hook
 * 
 * Validates tag operations based on tag content and rules
 */
import { useState, useCallback } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { handleError } from '@/utils/errors/handle';

// Tag validation result interface
export interface TagValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Hook for validating tag operations
 */
export function useTagValidation() {
  const [lastValidatedTag, setLastValidatedTag] = useState<string>('');
  
  /**
   * Validate a tag name based on common rules
   * 
   * @param tagName The tag name to validate
   * @returns Validation result object
   */
  const validateTag = useCallback((tagName: string): TagValidationResult => {
    setLastValidatedTag(tagName);
    
    if (!tagName || tagName.trim() === '') {
      return {
        isValid: false,
        errorMessage: 'Tag name cannot be empty'
      };
    }
    
    // Validate minimum length
    if (tagName.trim().length < 2) {
      return {
        isValid: false,
        errorMessage: 'Tag must be at least 2 characters long'
      };
    }
    
    // Validate maximum length
    if (tagName.trim().length > 50) {
      return {
        isValid: false,
        errorMessage: 'Tag must be less than 50 characters long'
      };
    }
    
    // Check for invalid characters (optional, adjust as needed)
    const invalidCharsRegex = /[^\w\s\-\.]/;
    if (invalidCharsRegex.test(tagName)) {
      return {
        isValid: false,
        errorMessage: 'Tag contains invalid characters'
      };
    }
    
    return {
      isValid: true,
      errorMessage: null
    };
  }, []);
  
  /**
   * Validate a tag operation with content ID validation
   * 
   * @param tagName Tag name
   * @param contentId Content ID
   * @returns Whether the operation can proceed
   */
  const validateTagOperation = useCallback((tagName: string, contentId?: string): boolean => {
    // First validate the content ID
    if (contentId && !isValidContentId(contentId)) {
      handleError(
        new Error('Invalid content ID'),
        'Cannot perform tag operation: invalid content ID',
        { level: 'warning' }
      );
      return false;
    }
    
    // Then validate the tag
    const tagValidation = validateTag(tagName);
    if (!tagValidation.isValid) {
      handleError(
        new Error(tagValidation.errorMessage || 'Invalid tag'),
        tagValidation.errorMessage || 'Invalid tag',
        { level: 'warning' }
      );
      return false;
    }
    
    return true;
  }, [validateTag]);
  
  return {
    validateTag,
    validateTagOperation,
    lastValidatedTag
  };
}

// Default export
export default useTagValidation;
