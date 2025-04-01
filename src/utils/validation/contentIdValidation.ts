
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Checks if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Checks if a string is a temporary ID
 */
export function isTempId(str: string): boolean {
  return str.startsWith('temp-');
}

/**
 * Validates if a string is a valid content ID
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Attempts to convert a string to a UUID
 */
export function tryConvertToUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  
  if (isUUID(contentId)) {
    return contentId;
  }
  
  // Extract UUID from temp ID if possible
  if (isTempId(contentId)) {
    const match = contentId.match(/temp-(.*)/);
    if (match && match[1] && isUUID(match[1])) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Check if a content ID is storable in the database
 */
export function isStorableContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Get validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      errorMessage: 'Content ID is required',
      resultType: ContentIdValidationResultType.INVALID,
      message: 'No content ID provided',
      contentExists: false
    };
  }
  
  if (isUUID(contentId)) {
    return {
      isValid: true,
      errorMessage: null,
      resultType: ContentIdValidationResultType.UUID,
      message: 'Valid UUID',
      contentExists: true
    };
  }
  
  if (isTempId(contentId)) {
    return {
      isValid: true,
      errorMessage: null,
      resultType: ContentIdValidationResultType.TEMP,
      message: 'Temporary ID',
      contentExists: false
    };
  }
  
  return {
    isValid: false,
    errorMessage: 'Invalid content ID format',
    resultType: ContentIdValidationResultType.INVALID,
    message: 'Invalid format',
    contentExists: false
  };
}

/**
 * Legacy function for backward compatibility
 */
export function validateContentId(contentId?: string | null): boolean {
  return isValidContentId(contentId);
}
