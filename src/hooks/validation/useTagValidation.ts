
import { useCallback } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { createTagValidationResult } from '@/utils/validation/types';
import { TagValidationResult } from '@/utils/validation/types';
import { ErrorLevel } from '@/utils/errors/types';
import { handleError } from '@/utils/errors';

interface UseTagValidationProps {
  contentId?: string;
}

export function useTagValidation(props?: UseTagValidationProps) {
  const { contentId } = props || {};

  /**
   * Validate a tag value
   */
  const validateTag = useCallback((tagValue: string): TagValidationResult => {
    // Check if tag is empty
    if (!tagValue || !tagValue.trim()) {
      return createTagValidationResult(false, 'Tag cannot be empty');
    }
    
    // Check for minimum length
    if (tagValue.trim().length < 2) {
      return createTagValidationResult(false, 'Tag must be at least 2 characters long');
    }
    
    // Check for maximum length
    if (tagValue.trim().length > 50) {
      return createTagValidationResult(false, 'Tag must be at most 50 characters long');
    }
    
    // Perform any additional validation rules here
    
    // Return success if all checks pass
    return createTagValidationResult(true, null);
  }, []);

  /**
   * Validate tag operation based on current context
   */
  const validateTagOperation = useCallback((tagValue: string): TagValidationResult => {
    // If contentId is explicitly in the props, validate it
    if (contentId !== undefined) {
      if (!contentId || !isValidContentId(contentId)) {
        return createTagValidationResult(false, 'Invalid content ID');
      }
    }
    
    // Then validate the tag itself
    return validateTag(tagValue);
  }, [contentId, validateTag]);

  /**
   * Validate all aspects of a tag operation with error handling.
   */
  const validateTagAndHandleErrors = useCallback((tagValue: string): boolean => {
    // Validate the tag operation
    const result = validateTagOperation(tagValue);
    
    // Show error message if validation fails
    if (!result.isValid) {
      handleError(
        new Error(result.errorMessage || 'Invalid tag'),
        { 
          level: ErrorLevel.Warning,
          message: result.errorMessage || 'Invalid tag'
        }
      );
      return false;
    }
    
    return true;
  }, [validateTagOperation]);

  return {
    validateTag,
    validateTagOperation,
    validateTagAndHandleErrors
  };
}
