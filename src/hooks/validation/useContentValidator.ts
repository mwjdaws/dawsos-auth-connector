
import { useCallback, useEffect, useState } from 'react';
import { 
  validateContentId, 
  isValidContentId,
  ContentIdValidationResult
} from '@/utils/validation/contentIdValidation';

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
    const newResult = validateContentId(contentId);
    setValidationResult(newResult);
    return newResult;
  }, [contentId]);
  
  return {
    ...validationResult,
    validate
  };
}

export default useContentValidator;
