
/**
 * Content ID validation utilities
 */
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

// Regular expression to validate UUIDs (version 4)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Regular expression to validate temporary IDs (starts with 'temp-')
const TEMP_ID_REGEX = /^temp-/i;

/**
 * Validates if a string is a valid UUID (v4)
 */
export function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Validates if a string is a temporary ID (starts with 'temp-')
 */
export function isTempId(value: string): boolean {
  return TEMP_ID_REGEX.test(value);
}

/**
 * Validates if a value is a valid content ID (either UUID or temp ID)
 */
export function isValidContentId(value: string | null | undefined): boolean {
  if (!value) return false;
  return isUUID(value) || isTempId(value);
}

/**
 * Validates if a content ID is storable (only UUIDs are storable)
 */
export function isStorableContentId(value: string | null | undefined): boolean {
  if (!value) return false;
  return isUUID(value);
}

/**
 * Attempts to convert a string to a UUID if it's in a compatible format
 */
export function tryConvertToUUID(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isUUID(value)) return value;
  return null;
}

/**
 * Get detailed validation result for a content ID
 */
export function getContentIdValidationResult(
  contentId: string | null | undefined
): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(
      false,
      'missing',
      null,
      'Content ID is required',
      false
    );
  }

  if (isUUID(contentId)) {
    return createContentIdValidationResult(
      true,
      'uuid',
      'Valid UUID format',
      null,
      true // Assume exists for now
    );
  }

  if (isTempId(contentId)) {
    return createContentIdValidationResult(
      true,
      'temporary',
      'Valid temporary ID format',
      null,
      false // Temp IDs don't exist in storage
    );
  }

  return createContentIdValidationResult(
    false,
    'invalid',
    null,
    'Invalid content ID format',
    false
  );
}

/**
 * Validate content ID with proper error message
 */
export function validateContentId(contentId: string | null | undefined): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
