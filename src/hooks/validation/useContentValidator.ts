
import { useCallback, useEffect, useState } from 'react';
import { ContentIdValidationResult, validateContentId } from '@/utils/validation';

/**
 * Hook for validating content IDs and checking existence
 * 
 * @param contentId The content ID to validate
 * @returns Validation result object
 */
export function useContentValidator(contentId: string | null | undefined) {
  const [validationResult, setValidationResult] = useState<ContentIdValidationResult>(() => 
    validateContentId(contentId)
  );
  
  // Update validation when contentId changes
  useEffect(() => {
    setValidationResult(validateContentId(contentId));
  }, [contentId]);
  
  // Function to manually validate
  const validate = useCallback(() => {
    setValidationResult(validateContentId(contentId));
    return validationResult;
  }, [contentId, validationResult]);
  
  return {
    ...validationResult,
    validate
  };
}

export default useContentValidator;
