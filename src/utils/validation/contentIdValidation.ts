
/**
 * Content ID validation utilities
 * 
 * Functions for validating content IDs.
 */

import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TEMP_ID_PATTERN = /^temp-[\w-]+$/;

/**
 * Checks if a string is a valid UUID
 */
export function isUUID(id: string): boolean {
  return UUID_PATTERN.test(id);
}

/**
 * Checks if a string is a valid temporary ID
 */
export function isTempId(id: string): boolean {
  return TEMP_ID_PATTERN.test(id);
}

/**
 * Gets the validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      resultType: ContentIdValidationResultType.INVALID,
      message: 'Content ID is missing',
      errorMessage: 'Content ID is missing'
    };
  }
  
  if (isUUID(contentId)) {
    return {
      isValid: true,
      resultType: ContentIdValidationResultType.UUID,
      message: 'Valid UUID',
      errorMessage: null
    };
  }
  
  if (isTempId(contentId)) {
    return {
      isValid: true,
      resultType: ContentIdValidationResultType.TEMP,
      message: 'Valid temporary ID',
      errorMessage: null
    };
  }
  
  return {
    isValid: false,
    resultType: ContentIdValidationResultType.INVALID,
    message: 'Invalid content ID format',
    errorMessage: 'Invalid content ID format'
  };
}

/**
 * Checks if a content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
}
