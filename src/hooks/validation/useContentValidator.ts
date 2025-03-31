
/**
 * useContentValidator - Hook to validate content IDs and existence
 */
import { useState, useEffect } from 'react';
import { useContentExists } from '@/hooks/metadata/useContentExists';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { ContentValidationResult, createContentValidationResult } from '@/utils/validation/types';

/**
 * Validates a content ID and checks if it exists in the database
 * 
 * @param contentId The content ID to validate
 * @returns Validation result with status and error message
 */
export function useContentValidator(contentId: string | null | undefined): ContentValidationResult {
  const [validationResult, setValidationResult] = useState<ContentValidationResult>(() => {
    return createContentValidationResult(
      false,
      false,
      contentId ? `Validating content ID: ${contentId}` : 'No content ID provided',
      contentId
    );
  });
  
  // First check if content ID format is valid
  const isValid = contentId ? isValidContentId(contentId) : false;
  
  // If valid format, check if it exists in the database
  const { 
    data: exists = false, 
    isLoading,
    error
  } = useContentExists(isValid ? contentId : null, {
    enabled: isValid,
    retry: 1
  });
  
  // Update validation result based on validation status
  useEffect(() => {
    if (!contentId) {
      setValidationResult(createContentValidationResult(
        false,
        false,
        'No content ID provided',
        null
      ));
    } else if (!isValid) {
      setValidationResult(createContentValidationResult(
        false,
        false,
        `Invalid content ID format: ${contentId}`,
        contentId
      ));
    } else if (error) {
      setValidationResult(createContentValidationResult(
        false,
        false,
        `Error checking content existence: ${error.message}`,
        contentId
      ));
    } else if (!isLoading && !exists) {
      setValidationResult(createContentValidationResult(
        false,
        false,
        `Content with ID ${contentId} does not exist`,
        contentId
      ));
    } else if (!isLoading && exists) {
      setValidationResult(createContentValidationResult(
        true,
        true,
        `Content with ID ${contentId} exists`,
        contentId
      ));
    }
  }, [contentId, isValid, exists, isLoading, error]);
  
  return validationResult;
}

export default useContentValidator;
