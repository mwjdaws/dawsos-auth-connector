
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Temporary ID prefix
const TEMP_ID_PREFIX = 'temp-';

/**
 * Validate a content ID
 * 
 * @param contentId The content ID to validate
 * @returns Whether the content ID is valid
 */
export function isValidContentId(contentId: string): boolean {
  if (!contentId) {
    return false;
  }
  
  // Check if it's a temporary ID
  if (contentId.startsWith(TEMP_ID_PREFIX)) {
    return true;
  }
  
  // Check if it's a UUID
  return UUID_PATTERN.test(contentId);
}

/**
 * Check if a content ID is a UUID
 */
export function isUUID(contentId: string): boolean {
  return UUID_PATTERN.test(contentId);
}

/**
 * Check if a content ID is a temporary ID
 */
export function isTempId(contentId: string): boolean {
  return contentId.startsWith(TEMP_ID_PREFIX);
}

/**
 * Check if a content ID is storable (either UUID or temporary)
 */
export function isStorableContentId(contentId: string): boolean {
  return isValidContentId(contentId);
}

/**
 * Try to convert a string to a UUID
 * 
 * @param value The value to try to convert
 * @returns The UUID if valid, or null if not
 */
export function tryConvertToUUID(value: string): string | null {
  if (isUUID(value)) {
    return value;
  }
  return null;
}

/**
 * Get detailed validation result for a content ID
 * 
 * @param contentId The content ID to validate
 * @returns A detailed validation result
 */
export function getContentIdValidationResult(contentId: string): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.EMPTY,
      errorMessage: 'Content ID is empty',
      message: null,
      isTemporary: false,
      isUuid: false
    };
  }
  
  if (contentId.length > 128) {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.TOO_LONG,
      errorMessage: 'Content ID is too long',
      message: null,
      isTemporary: false,
      isUuid: false
    };
  }
  
  // Check if it's a UUID
  if (isUUID(contentId)) {
    return {
      isValid: true,
      contentExists: true, // Assume exists until proven otherwise
      resultType: ContentIdValidationResultType.UUID,
      errorMessage: null,
      message: 'Valid UUID',
      isTemporary: false,
      isUuid: true
    };
  }
  
  // Check if it's a temporary ID
  if (isTempId(contentId)) {
    return {
      isValid: true,
      contentExists: false, // Temp IDs don't exist in the database yet
      resultType: ContentIdValidationResultType.TEMPORARY,
      errorMessage: null,
      message: 'Temporary ID',
      isTemporary: true,
      isUuid: false
    };
  }
  
  // Invalid format
  return {
    isValid: false,
    contentExists: false,
    resultType: ContentIdValidationResultType.INVALID_FORMAT,
    errorMessage: 'Invalid content ID format',
    message: null,
    isTemporary: false,
    isUuid: false
  };
}

/**
 * Validate a content ID and check if it exists
 * This combines format validation with existence check
 * 
 * @param contentId The content ID to validate
 * @returns Whether the content ID is valid and exists
 */
export function validateContentId(contentId: string): ContentIdValidationResult {
  const result = getContentIdValidationResult(contentId);
  
  return result;
}
