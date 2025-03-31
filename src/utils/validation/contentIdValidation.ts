
/**
 * Content ID validation utilities
 */

import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Check if a content ID is a valid UUID
 */
const isUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Check if a content ID is a valid temporary ID
 */
const isTempId = (id: string): boolean => {
  return id.startsWith('temp-') && id.length > 5;
}

/**
 * Check if a content ID is a valid string ID (used for legacy purposes)
 */
const isStringId = (id: string): boolean => {
  return id.length > 3 && id.startsWith('content-');
}

/**
 * Validate a content ID and return detailed validation result
 */
export const validateContentId = (contentId?: string | null): ContentIdValidationResult => {
  if (!contentId) {
    return {
      type: ContentIdValidationResultType.INVALID,
      isValid: false,
      message: 'Content ID is required'
    };
  }
  
  if (isUuid(contentId)) {
    return {
      type: ContentIdValidationResultType.UUID,
      isValid: true,
      message: null
    };
  }
  
  if (isTempId(contentId)) {
    return {
      type: ContentIdValidationResultType.TEMP,
      isValid: true,
      message: null
    };
  }
  
  if (isStringId(contentId)) {
    return {
      type: ContentIdValidationResultType.STRING,
      isValid: true,
      message: null
    };
  }
  
  return {
    type: ContentIdValidationResultType.INVALID,
    isValid: false,
    message: 'Invalid content ID format'
  };
}

/**
 * Simple check if a content ID is valid (for quick validation)
 */
export const isValidContentId = (contentId?: string | null): boolean => {
  if (!contentId) return false;
  return validateContentId(contentId).isValid;
}

/**
 * Get detailed validation result for content ID
 */
export const getContentIdValidationResult = validateContentId;
