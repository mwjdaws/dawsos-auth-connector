
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
} from '@/utils/validation/contentIdValidation';

/**
 * Validates a content ID and provides validation information
 * 
 * @param contentId The content ID to validate
 * @returns Object with validation information
 */
export function useValidateContentId(contentId?: string | null) {
  // Memorize the validation result 
  const result = useMemo(() => {
    return getContentIdValidationResult(contentId);
  }, [contentId]);

  // Determine if the content ID is valid
  const isValid = useMemo(() => {
    return isValidContentId(contentId);
  }, [contentId]);

  // Determine if the content ID is a temporary ID
  const isTemporary = useMemo(() => {
    return isValidContentId(contentId) && isTempId(contentId || '');
  }, [contentId]);

  // Determine if the content ID is a UUID
  const isUuid = useMemo(() => {
    return isValidContentId(contentId) && isUUID(contentId || '');
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
