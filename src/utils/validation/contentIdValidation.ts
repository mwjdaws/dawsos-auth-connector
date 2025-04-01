
/**
 * Content ID validation utilities
 */
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

// Max character length for a content ID
const MAX_CONTENT_ID_LENGTH = 100;

// UUID v4 regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Temporary ID pattern (starts with 'temp_')
const TEMP_ID_PATTERN = /^temp_/i;

/**
 * Checks if a string is a valid UUID v4
 */
export function isUUID(str: string): boolean {
  return UUID_PATTERN.test(str);
}

/**
 * Checks if a string is a temporary ID
 */
export function isTempId(str: string): boolean {
  return TEMP_ID_PATTERN.test(str);
}

/**
 * Validates if a content ID is in a valid format
 */
export function isValidContentId(contentId: string): boolean {
  if (!contentId) {
    return false;
  }
  
  if (contentId.length > MAX_CONTENT_ID_LENGTH) {
    return false;
  }
  
  // Accept both UUIDs and temporary IDs
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Attempts to convert a string to a UUID format
 */
export function tryConvertToUUID(id: string): string {
  if (isUUID(id)) {
    return id;
  }
  
  // Remove spaces and special characters
  const cleaned = id.replace(/[^a-f0-9]/gi, '');
  
  // If we have at least 32 hex characters, try to convert to UUID
  if (cleaned.length >= 32) {
    const uuidPattern = `${cleaned.substr(0, 8)}-${cleaned.substr(8, 4)}-${cleaned.substr(12, 4)}-${cleaned.substr(16, 4)}-${cleaned.substr(20, 12)}`;
    if (isUUID(uuidPattern)) {
      return uuidPattern;
    }
  }
  
  return id;
}

/**
 * Checks if a content ID is storable (either a UUID or a valid temporary ID)
 */
export function isStorableContentId(contentId: string): boolean {
  return isUUID(contentId) || (isTempId(contentId) && contentId.length <= MAX_CONTENT_ID_LENGTH);
}

/**
 * Gets a detailed content ID validation result
 */
export function getContentIdValidationResult(contentId: string): ContentIdValidationResult {
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
      errorMessage: `Content ID exceeds maximum length of ${MAX_CONTENT_ID_LENGTH} characters`,
      isTemporary: false,
      isUuid: false
    };
  }
  
  if (isUUID(contentId)) {
    return {
      isValid: true,
      contentExists: false, // This will be updated after checking the database
      resultType: ContentIdValidationResultType.UUID,
      errorMessage: null,
      isTemporary: false,
      isUuid: true
    };
  }
  
  if (isTempId(contentId)) {
    return {
      isValid: true,
      contentExists: false,
      resultType: ContentIdValidationResultType.TEMPORARY,
      errorMessage: null,
      isTemporary: true,
      isUuid: false
    };
  }
  
  return {
    isValid: false,
    contentExists: false,
    resultType: ContentIdValidationResultType.INVALID_FORMAT,
    errorMessage: 'Content ID format is invalid. It must be a UUID or start with "temp_"',
    isTemporary: false,
    isUuid: false
  };
}

/**
 * Validates a content ID and returns a validation result
 */
export function validateContentId(contentId: string): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
