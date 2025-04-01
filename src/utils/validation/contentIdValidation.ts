
/**
 * Utilities for validating content IDs
 */
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

// Regex patterns for content ID validation
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TEMP_ID_PATTERN = /^temp-\d+$/;
const MAX_ID_LENGTH = 100; // Maximum length for content IDs

/**
 * Check if content ID is a valid UUID
 */
export function isUUID(contentId: string): boolean {
  return UUID_PATTERN.test(contentId);
}

/**
 * Check if content ID is a temporary ID
 */
export function isTempId(contentId: string): boolean {
  return TEMP_ID_PATTERN.test(contentId);
}

/**
 * Validate a content ID
 */
export function isValidContentId(contentId: string): boolean {
  // Empty IDs are invalid
  if (!contentId || contentId.trim() === '') {
    return false;
  }
  
  // IDs that are too long are invalid
  if (contentId.length > MAX_ID_LENGTH) {
    return false;
  }
  
  // Accept UUIDs and temporary IDs
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Comprehensive validation of content ID
 */
export function validateContentId(contentId?: string): ContentIdValidationResult {
  // Handle empty ID
  if (!contentId || contentId.trim() === '') {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.EMPTY,
      errorMessage: 'Content ID is required',
      message: null
    };
  }
  
  // Handle IDs that are too long
  if (contentId.length > MAX_ID_LENGTH) {
    return {
      isValid: false,
      contentExists: false,
      resultType: ContentIdValidationResultType.TOO_LONG,
      errorMessage: `Content ID exceeds maximum length of ${MAX_ID_LENGTH} characters`,
      message: null
    };
  }
  
  // Check for temporary IDs
  if (isTempId(contentId)) {
    return {
      isValid: true,
      contentExists: false, // Temporary content doesn't exist in DB yet
      resultType: ContentIdValidationResultType.TEMPORARY,
      errorMessage: null,
      message: 'Temporary content ID is valid',
      isTemporary: true
    };
  }
  
  // Check for UUID format
  if (isUUID(contentId)) {
    return {
      isValid: true,
      contentExists: true, // Assume UUID exists - in real app, you would check DB
      resultType: ContentIdValidationResultType.UUID,
      errorMessage: null,
      message: 'Content ID is a valid UUID',
      isUuid: true
    };
  }
  
  // If none of the above match, it's an invalid format
  return {
    isValid: false,
    contentExists: false,
    resultType: ContentIdValidationResultType.INVALID_FORMAT,
    errorMessage: 'Invalid content ID format',
    message: null
  };
}
