
/**
 * Content ID validation utilities
 * 
 * Functions for validating content IDs, supporting both UUID and temporary ID formats.
 */

import { ContentIdValidationResult, ContentIdResultType } from './types';
import { createValidResult, createInvalidResult } from './utils';

// Regular expression for validating UUIDs
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Regular expression for validating temporary IDs
const TEMP_ID_REGEX = /^temp-\d+$/;

/**
 * Check if a string is a valid UUID
 * 
 * @param id String to validate
 * @returns Whether the string is a valid UUID
 */
export function isUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Check if a string is a valid temporary ID
 * 
 * @param id String to validate
 * @returns Whether the string is a valid temporary ID
 */
export function isTempId(id: string): boolean {
  return TEMP_ID_REGEX.test(id);
}

/**
 * Check if a string is a valid content ID (either UUID or temporary ID)
 * 
 * @param id String to validate
 * @returns Whether the string is a valid content ID
 */
export function isValidContentId(id?: string | null): boolean {
  if (!id) return false;
  return isUUID(id) || isTempId(id);
}

/**
 * Check if a content ID is storable (UUID only, not temporary)
 * 
 * @param id String to validate
 * @returns Whether the ID is storable (UUID)
 */
export function isStorableContentId(id?: string | null): boolean {
  if (!id) return false;
  return isUUID(id);
}

/**
 * Try to convert a string to a UUID if it's a valid UUID
 * 
 * @param id String to convert
 * @returns UUID if valid, null otherwise
 */
export function tryConvertToUUID(id?: string | null): string | null {
  if (!id) return null;
  return isUUID(id) ? id : null;
}

/**
 * Get detailed validation result for a content ID
 * 
 * @param id Content ID to validate
 * @returns Validation result with type and messages
 */
export function getContentIdValidationResult(id?: string | null): ContentIdValidationResult {
  if (!id) {
    return {
      isValid: false,
      resultType: 'invalid',
      message: null,
      errorMessage: 'Content ID is required'
    };
  }

  if (isUUID(id)) {
    return {
      isValid: true,
      resultType: 'uuid',
      message: 'Valid UUID',
      errorMessage: null
    };
  }

  if (isTempId(id)) {
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
    errorMessage: `Invalid content ID format: ${id}`
  };
}
