
/**
 * Hook for validating content IDs
 * 
 * Provides validation for content IDs, checking format and existence
 */
import { useMemo } from 'react';
import { ContentValidationResult } from '@/utils/validation/types';
import { isValidContentId, isTempId, isUUID } from '@/utils/validation/contentIdValidation';

/**
 * Hook for content validation
 * 
 * @param contentId The content ID to validate
 * @returns Content validation result
 */
export function useContentValidator(contentId?: string): ContentValidationResult {
  return useMemo(() => {
    // Check if content ID is provided
    if (!contentId) {
      return {
        contentId: '',
        isValid: false,
        contentExists: false,
        errorMessage: 'Content ID is required'
      };
    }
    
    // Check if content ID is valid
    if (!isValidContentId(contentId)) {
      return {
        contentId,
        isValid: false,
        contentExists: false,
        errorMessage: 'Invalid content ID format'
      };
    }
    
    // If it's a temporary ID
    if (isTempId(contentId)) {
      return {
        contentId,
        isValid: true,
        contentExists: false, // Temporary IDs don't exist in the database yet
        errorMessage: null
      };
    }
    
    // If it's a UUID, we assume it exists
    // In a real implementation, you'd check the database
    if (isUUID(contentId)) {
      return {
        contentId,
        isValid: true,
        contentExists: true,
        errorMessage: null
      };
    }
    
    // Default case
    return {
      contentId,
      isValid: false,
      contentExists: false,
      errorMessage: 'Unknown content ID format'
    };
  }, [contentId]);
}

// Default export for compatibility
export default useContentValidator;
