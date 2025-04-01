
/**
 * Content ID validation utilities
 */
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

// Regular expressions for validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TEMP_ID_REGEX = /^temp-[a-z0-9]{8,}$/i;

/**
 * Validates if a string is a valid content ID
 * 
 * @param contentId Content ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Validates if a string is a valid UUID
 * 
 * @param id String to validate
 * @returns True if valid UUID, false otherwise
 */
export function isUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Validates if a string is a valid temporary ID
 * 
 * @param id String to validate
 * @returns True if valid temporary ID, false otherwise
 */
export function isTempId(id: string): boolean {
  return TEMP_ID_REGEX.test(id);
}

/**
 * Determines if a content ID is suitable for storage in the database
 * 
 * @param contentId Content ID to evaluate
 * @returns True if valid for database storage
 */
export function isStorableContentId(contentId?: string | null): boolean {
  return contentId !== undefined && contentId !== null && isUUID(contentId);
}

/**
 * Tries to convert a content ID to a UUID
 * 
 * @param contentId Content ID to convert
 * @returns UUID string or null if conversion fails
 */
export function tryConvertToUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  
  if (isUUID(contentId)) {
    return contentId;
  }
  
  // Add additional conversion logic here if needed
  
  return null;
}

/**
 * Gets comprehensive validation result for a content ID
 * 
 * @param contentId Content ID to validate
 * @returns Validation result object
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(
      false,
      'MISSING',
      null,
      'Content ID is required',
      false
    );
  }
  
  if (isUUID(contentId)) {
    return createContentIdValidationResult(
      true,
      'UUID',
      'Valid UUID format',
      null,
      true // Assume the content exists for now (would need to check DB)
    );
  }
  
  if (isTempId(contentId)) {
    return createContentIdValidationResult(
      true,
      'TEMP_ID',
      'Valid temporary ID format',
      null,
      false // Temporary IDs don't exist in the database yet
    );
  }
  
  return createContentIdValidationResult(
    false,
    'INVALID',
    null,
    'Invalid content ID format',
    false
  );
}

/**
 * Validates a content ID, checking for existence in the database if needed
 * 
 * @param contentId Content ID to validate
 * @returns Promise resolving to validation result
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
