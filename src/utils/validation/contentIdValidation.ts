
/**
 * Content ID Validation 
 * 
 * Utility functions for validating content IDs across the application.
 */
import { 
  ContentIdValidationResult, 
  ContentIdValidationResultType 
} from './types';

// Regex for UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Regex for temporary ID validation (typically starting with "temp-" followed by alphanumeric chars)
const TEMP_ID_REGEX = /^temp-[a-zA-Z0-9_-]+$/;

// Max length for a content ID
const MAX_CONTENT_ID_LENGTH = 100;

/**
 * Checks if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

/**
 * Checks if a string is a temporary ID
 */
export function isTempId(str: string): boolean {
  return TEMP_ID_REGEX.test(str);
}

/**
 * Checks if a content ID is valid (either UUID or temporary ID)
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  if (contentId.length > MAX_CONTENT_ID_LENGTH) return false;
  
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Try to convert a string to a UUID if possible
 */
export function tryConvertToUUID(str?: string | null): string | null {
  if (!str) return null;
  
  // If already a UUID, return as is
  if (isUUID(str)) return str;
  
  // Remove non-alphanumeric characters and try to format as UUID
  try {
    const clean = str.replace(/[^a-f0-9]/gi, '').toLowerCase();
    if (clean.length < 32) return null;
    
    const uuid = [
      clean.substring(0, 8),
      clean.substring(8, 12),
      clean.substring(12, 16),
      clean.substring(16, 20),
      clean.substring(20, 32)
    ].join('-');
    
    return isUUID(uuid) ? uuid : null;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if a content ID can be stored in the database
 * (only UUIDs, not temporary IDs)
 */
export function isStorableContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Get detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.EMPTY,
      errorMessage: 'Content ID is required',
      isTemporary: false,
      isUuid: false
    };
  }
  
  if (contentId.length > MAX_CONTENT_ID_LENGTH) {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.TOO_LONG,
      errorMessage: `Content ID exceeds maximum length (${MAX_CONTENT_ID_LENGTH})`,
      isTemporary: false,
      isUuid: false
    };
  }
  
  // Check for temp ID
  if (isTempId(contentId)) {
    return {
      isValid: true,
      contentExists: false, // Temp IDs are not assumed to exist in the database
      resultType: ContentIdValidationResultType.TEMPORARY,
      errorMessage: null,
      isTemporary: true,
      isUuid: false
    };
  }
  
  // Check for UUID
  if (isUUID(contentId)) {
    return {
      isValid: true,
      contentExists: true, // We assume UUIDs exist, but this should be checked separately
      resultType: ContentIdValidationResultType.VALID,
      errorMessage: null,
      isTemporary: false,
      isUuid: true
    };
  }
  
  // Invalid format
  return {
    isValid: false,
    contentExists: false,
    resultType: ContentIdValidationResultType.INVALID_FORMAT,
    errorMessage: 'Invalid content ID format',
    isTemporary: false,
    isUuid: false
  };
}
