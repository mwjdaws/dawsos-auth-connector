
/**
 * Hook for content ID validation only 
 * 
 * This is a simplified hook that only validates content IDs,
 * useful for components that only need basic validation.
 */
import { useMemo } from 'react';
import { 
  isValidContentId, 
  isTempId, 
  isUUID, 
  getContentIdValidationResult 
} from '../contentIdValidation';
import { ContentIdValidationResult } from '../types';

/**
 * Validates a content ID and provides validation information
 * 
 * @param contentId The content ID to validate
 * @returns Object with validation information
 */
export function useValidateContentId(contentId?: string | null) {
  // Memorize the validation result 
  const result = useMemo<ContentIdValidationResult>(() => {
    if (!contentId) {
      return getContentIdValidationResult('');
    }
    return getContentIdValidationResult(contentId);
  }, [contentId]);

  // Determine if the content ID is valid
  const isValid = useMemo(() => {
    if (!contentId) return false;
    return isValidContentId(contentId);
  }, [contentId]);

  // Determine if the content ID is a temporary ID
  const isTemporary = useMemo(() => {
    if (!contentId) return false;
    return isTempId(contentId);
  }, [contentId]);

  // Determine if the content ID is a UUID
  const isUuid = useMemo(() => {
    if (!contentId) return false;
    return isUUID(contentId);
  }, [contentId]);

  return {
    isValid,
    isTemporary,
    isUuid,
    validationResult: result,
    errorMessage: result.errorMessage
  };
}

// Default export
export default useValidateContentId;
