
/**
 * useContentValidator - Hook to validate content IDs and existence
 */
import { useState, useEffect } from 'react';
import { useContentExists } from '@/hooks/metadata/useContentExists';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface ContentValidationResult {
  isValid: boolean;
  contentExists: boolean;
  errorMessage: string | null;
}

/**
 * Validates a content ID and checks if it exists in the database
 * 
 * @param contentId The content ID to validate
 * @returns Validation result with status and error message
 */
export function useContentValidator(contentId: string | null | undefined): ContentValidationResult {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
  
  // Update error message based on validation status
  useEffect(() => {
    if (!contentId) {
      setErrorMessage('No content ID provided');
    } else if (!isValid) {
      setErrorMessage(`Invalid content ID format: ${contentId}`);
    } else if (error) {
      setErrorMessage(`Error checking content existence: ${error.message}`);
    } else if (!isLoading && !exists) {
      setErrorMessage(`Content with ID ${contentId} does not exist`);
    } else {
      setErrorMessage(null);
    }
  }, [contentId, isValid, exists, isLoading, error]);
  
  return {
    isValid,
    contentExists: exists,
    errorMessage
  };
}

export default useContentValidator;
