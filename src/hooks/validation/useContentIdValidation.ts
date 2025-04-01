
/**
 * Hook for validating content IDs with error handling
 */

import { useState, useCallback } from 'react';
import { isValidContentId, isUUID, isTempId, getContentIdValidationResult } from '@/utils/validation/contentIdValidation';
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

  // Determine if the content ID is a UUID
  const isUuid = useCallback((contentId: string): boolean => {
    return isUUID(contentId);
  }, []);

  // Determine if the content ID is temporary
  const isTemporary = useCallback((contentId: string): boolean => {
    return isTempId(contentId);
  }, []);

  // Is the ID storable (either already a UUID or a temp ID that can be converted)
  const isStorable = useCallback((contentId: string): boolean => {
    return isUUID(contentId) || isTempId(contentId);
  }, []);

  // Convert a temporary ID to a UUID
  const convertToUuid = useCallback((contentId: string): string => {
    // This is a placeholder. In a real implementation, this would convert a temp ID to a UUID
    return contentId;
  }, []);

  return {
    validationResult,
    validateContentId,
    setContentId,
    isValid: validationResult.isValid,
    contentExists: validationResult.contentExists,
    errorMessage: validationResult.errorMessage,
    isUuid,
    isTemporary,
    isStorable,
    convertToUuid
  };
}

export default useContentIdValidation;
