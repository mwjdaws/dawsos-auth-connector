
/**
 * useTagValidation hook
 * 
 * Validates tag operations based on tag content and rules
 */
import { useState, useCallback } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { handleError, ErrorLevel } from '@/utils/errors';
import { ValidationResult, createValidResult, createInvalidResult } from '@/utils/validation/types';

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
  const validateTag = useCallback((tagName: string): ValidationResult => {
    setLastValidatedTag(tagName);
    
    if (!tagName || tagName.trim() === '') {
      return createInvalidResult('Tag name cannot be empty');
    }
    
    // Validate minimum length
    if (tagName.trim().length < 2) {
      return createInvalidResult('Tag must be at least 2 characters long');
    }
    
    // Validate maximum length
    if (tagName.trim().length > 50) {
      return createInvalidResult('Tag must be less than 50 characters long');
    }
    
    // Check for invalid characters (optional, adjust as needed)
    const invalidCharsRegex = /[^\w\s\-\.]/;
    if (invalidCharsRegex.test(tagName)) {
      return createInvalidResult('Tag contains invalid characters');
    }
    
    return createValidResult();
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
        { level: ErrorLevel.WARNING }
      );
      return false;
    }
    
    // Then validate the tag
    const tagValidation = validateTag(tagName);
    if (!tagValidation.isValid) {
      handleError(
        new Error(tagValidation.errorMessage || 'Invalid tag'),
        tagValidation.errorMessage || 'Invalid tag',
        { level: ErrorLevel.WARNING }
      );
      return false;
    }
    
    return true;
  }, [validateTag]);
  
  /**
   * Get validation result for tag name
   */
  const isValidTag = useCallback((tagName: string): ValidationResult => {
    return validateTag(tagName);
  }, [validateTag]);
  
  return {
    validateTag,
    validateTagOperation,
    isValidTag,
    lastValidatedTag
  };
}

// Default export
export default useTagValidation;
