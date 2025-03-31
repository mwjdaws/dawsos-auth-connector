
/**
 * Content ID validation utilities
 * 
 * Provides functions for validating content IDs with support for both UUID and temporary IDs.
 */

import { ContentIdValidationResult } from '@/utils/validation/types';

// UUID pattern for validation
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Temporary ID pattern (e.g., "temp-123456")
const TEMP_ID_PATTERN = /^temp-[\w-]+$/;

/**
 * Checks if a content ID is valid (either UUID or temporary ID)
 * 
 * @param contentId The ID to validate
 * @returns True if the ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUuidContentId(contentId) || isTemporaryContentId(contentId);
}

/**
 * Checks if a content ID is a valid UUID
 * 
 * @param contentId The ID to validate
 * @returns True if the ID is a valid UUID
 */
export function isUuidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return UUID_PATTERN.test(contentId);
}

/**
 * Checks if a content ID is a valid temporary ID
 * 
 * @param contentId The ID to validate
 * @returns True if the ID is a valid temporary ID
 */
export function isTemporaryContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return TEMP_ID_PATTERN.test(contentId);
}

/**
 * Checks if a content ID is suitable for storage
 * 
 * @param contentId The ID to validate
 * @returns True if the ID is a valid UUID that can be stored
 */
export function isStorableContentId(contentId?: string | null): boolean {
  return isUuidContentId(contentId);
}

/**
 * Attempts to parse a content ID as a UUID
 * 
 * @param contentId The ID to parse
 * @returns The UUID if valid, or null
 */
export function tryParseContentIdAsUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  if (isUuidContentId(contentId)) return contentId;
  return null;
}

/**
 * Performs comprehensive validation of a content ID
 * 
 * @param contentId The ID to validate
 * @returns A validation result with details
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      resultType: 'invalid',
      message: null,
      errorMessage: 'Content ID is missing'
    };
  }

  if (isUuidContentId(contentId)) {
    return {
      isValid: true,
      resultType: 'uuid',
      message: 'Valid UUID',
      errorMessage: null
    };
  }

  if (isTemporaryContentId(contentId)) {
    return {
      isValid: true,
      resultType: 'temp',
      message: 'Valid temporary ID',
      errorMessage: null
    };
  }

  return {
    isValid: false,
    resultType: 'invalid',
    message: null,
    errorMessage: 'Invalid content ID format'
  };
}
