
import { useCallback, useEffect, useState } from 'react';
import { 
  validateContentId,
  isValidContentId,
  getContentIdValidationResult 
} from '@/utils/validation/contentIdValidation';
import { ContentIdValidationResult } from '@/utils/validation/types';

/**
 * Hook for validating content IDs and checking existence
 * 
 * @param contentId The content ID to validate
 * @returns Validation result object
 */
export function useContentValidator(contentId: string | null | undefined) {
  const [validationResult, setValidationResult] = useState<ContentIdValidationResult>(() => 
    getContentIdValidationResult(contentId)
  );
  
  // Update validation when contentId changes
  useEffect(() => {
    setValidationResult(getContentIdValidationResult(contentId));
  }, [contentId]);
  
  // Function to manually validate
  const validate = useCallback(() => {
    const newResult = getContentIdValidationResult(contentId);
    setValidationResult(newResult);
    return newResult;
  }, [contentId]);
  
  return {
    ...validationResult,
    validate
  };
}

export default useContentValidator;
