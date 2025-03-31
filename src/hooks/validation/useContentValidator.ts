
/**
 * useContentValidator Hook
 * 
 * Validates content IDs and checks if content exists in the database
 */
import { useMemo } from 'react';
import { isValidContentId, getContentIdValidationResult } from '@/utils/validation/contentIdValidation';
import { useContentExists } from '@/hooks/metadata/useContentExists';

/**
 * Hook for validating content IDs
 * 
 * @param contentId The content ID to validate
 * @returns Validation state for the content ID
 */
export function useContentValidator(contentId?: string | null) {
  // Check if the content ID is valid
  const validationResult = useMemo(() => {
    return getContentIdValidationResult(contentId);
  }, [contentId]);
  
  // Check if the content exists in the database
  const { data: exists, isLoading, error } = useContentExists(
    contentId && validationResult.isValid ? contentId : null
  );
  
  // Combine validation and existence check
  return {
    isValid: validationResult.isValid,
    isTemp: validationResult.isTemp,
    isUuid: validationResult.isUuid,
    contentExists: !!exists,
    isLoading,
    error,
    errorMessage: validationResult.errorMessage
  };
}

export default useContentValidator;
