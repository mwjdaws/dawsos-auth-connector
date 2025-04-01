
/**
 * Hook for validating content IDs with error handling
 */

import { useState, useCallback } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { ContentIdValidationResult, createContentIdValidationResult } from '@/utils/validation/types';
import { handleError, ErrorLevel } from '@/utils/errors';

/**
 * Hook for validating a content ID and providing friendly error messages
 * 
 * @returns Validation state and functions
 */
export function useContentIdValidation() {
  const [validationResult, setValidationResult] = useState<ContentIdValidationResult>(
    createContentIdValidationResult(false, false, null)
  );

  /**
   * Validate a content ID string
   * 
   * @param contentId - ID to validate
   * @param contentExists - Whether the content exists in the database
   * @returns ContentIdValidationResult
   */
  const validateContentId = useCallback((contentId: string, contentExists: boolean = false): ContentIdValidationResult => {
    try {
      if (!contentId || contentId.trim() === '') {
        return createContentIdValidationResult(
          false,
          false,
          'Content ID is required'
        );
      }
      
      // Check if content ID is valid
      const isValid = isValidContentId(contentId);
      
      if (!isValid) {
        return createContentIdValidationResult(
          false,
          false,
          'Invalid content ID format'
        );
      }
      
      // If we get here, the ID format is valid
      return createContentIdValidationResult(
        true,
        contentExists,
        contentExists ? 'Content ID is valid and exists' : 'Content ID format is valid'
      );
    } catch (error) {
      handleError(
        error,
        'Error validating content ID',
        { level: ErrorLevel.WARNING }
      );
      
      return createContentIdValidationResult(
        false,
        false,
        'Error validating content ID'
      );
    }
  }, []);

  /**
   * Set a new content ID to validate
   * 
   * @param contentId - New content ID to validate
   * @param contentExists - Whether the content exists
   */
  const setContentId = useCallback((contentId: string, contentExists: boolean = false) => {
    const result = validateContentId(contentId, contentExists);
    setValidationResult(result);
    return result;
  }, [validateContentId]);

  return {
    validationResult,
    validateContentId,
    setContentId,
    isValid: validationResult.isValid,
    contentExists: validationResult.contentExists,
    errorMessage: validationResult.errorMessage,
  };
}

export default useContentIdValidation;
