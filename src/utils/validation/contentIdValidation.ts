
/**
 * Validation utilities for content IDs
 */
import { ValidationResult, ContentIdValidationResult, ContentIdValidationResultType } from './types';
import { createValidationResult } from './types';

/**
 * Validates if a string is a valid content ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  // Check if it's a UUID format
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidPattern.test(contentId);
  
  // Check if it's a temporary ID format (starts with temp-)
  const isTempId = contentId.startsWith('temp-');
  
  return isUuid || isTempId;
}

/**
 * Gets a validation result for a content ID
 * @param contentId The content ID to validate
 * @returns A validation result object
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      errorMessage: 'Content ID is required',
      type: 'empty'
    };
  }
  
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidPattern.test(contentId);
  const isTempId = contentId.startsWith('temp-');
  
  if (isUuid) {
    return {
      isValid: true,
      errorMessage: null,
      type: ContentIdValidationResultType.UUID
    };
  }
  
  if (isTempId) {
    return {
      isValid: true,
      errorMessage: null,
      type: ContentIdValidationResultType.TEMP
    };
  }
  
  return {
    isValid: false,
    errorMessage: 'Invalid content ID format',
    type: ContentIdValidationResultType.INVALID
  };
}
