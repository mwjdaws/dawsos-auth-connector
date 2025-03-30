
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Validates if a given string is a valid content ID
 */
export function validateContentId(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      errorMessage: 'Content ID is required',
      type: 'empty'
    };
  }

  // UUID regex pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Custom temporary ID pattern (e.g., temp-123456)
  const tempIdPattern = /^temp-[a-zA-Z0-9-]+$/;
  
  if (!uuidPattern.test(contentId) && !tempIdPattern.test(contentId)) {
    return {
      isValid: false,
      errorMessage: 'Invalid content ID format',
      type: 'invalid'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null,
    type: 'valid'
  };
}

/**
 * Simple check if a content ID is valid (without detailed error)
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const tempIdPattern = /^temp-[a-zA-Z0-9-]+$/;
  
  return uuidPattern.test(contentId) || tempIdPattern.test(contentId);
}

/**
 * Gets a validation result with additional context information
 * For compatibility with other validation functions
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  return validateContentId(contentId);
}
