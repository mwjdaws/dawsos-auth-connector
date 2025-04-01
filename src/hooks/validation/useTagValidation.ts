
/**
 * Hook for validating tags with appropriate error handling
 */

import { useCallback } from 'react';
import { TagValidationResult, createTagValidationResult } from '@/utils/validation/types';
import { handleError, ErrorLevel } from '@/utils/errors';

/**
 * Minimum and maximum tag length constraints
 */
const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 50;

/**
 * Hook for validating tag operations
 */
export function useTagValidation() {
  /**
   * Check if a tag name is valid
   * 
   * @param tagName - Tag name to validate
   * @returns TagValidationResult
   */
  const validateTag = useCallback((tagName: string): TagValidationResult => {
    try {
      // Check if tag is empty
      if (!tagName || tagName.trim() === '') {
        return createTagValidationResult(false, 'Tag name cannot be empty');
      }
      
      // Check minimum length
      if (tagName.trim().length < MIN_TAG_LENGTH) {
        return createTagValidationResult(
          false, 
          `Tag must be at least ${MIN_TAG_LENGTH} characters`
        );
      }
      
      // Check maximum length
      if (tagName.trim().length > MAX_TAG_LENGTH) {
        return createTagValidationResult(
          false,
          `Tag must be less than ${MAX_TAG_LENGTH} characters`
        );
      }
      
      // Check for invalid characters
      if (!/^[a-zA-Z0-9\s-_:.#]+$/.test(tagName)) {
        return createTagValidationResult(
          false,
          'Tag contains invalid characters'
        );
      }
      
      // Tag is valid
      return createTagValidationResult(true);
    } catch (error) {
      handleError(
        error,
        'Error validating tag',
        { level: ErrorLevel.WARNING }
      );
      
      return createTagValidationResult(false, 'Error validating tag');
    }
  }, []);
  
  /**
   * Validate a tag operation against both content and tag validation
   * 
   * @param contentIsValid - Whether the content ID is valid
   * @param tagName - Tag name to validate
   * @returns TagValidationResult
   */
  const validateTagOperation = useCallback((
    contentIsValid: boolean,
    tagName: string
  ): TagValidationResult => {
    try {
      // First check if the content is valid
      if (!contentIsValid) {
        return createTagValidationResult(
          false,
          'Cannot perform tag operation: invalid content ID'
        );
      }
      
      // Then validate the tag
      return validateTag(tagName);
    } catch (error) {
      handleError(
        error,
        'Error validating tag operation',
        { level: ErrorLevel.WARNING }
      );
      
      return createTagValidationResult(false, 'Error validating tag operation');
    }
  }, [validateTag]);
  
  return {
    validateTag,
    validateTagOperation
  };
}

export default useTagValidation;
