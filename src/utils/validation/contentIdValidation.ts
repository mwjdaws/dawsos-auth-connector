
/**
 * Content ID validation utilities
 * Provides functions for validating knowledge content IDs
 */

import { ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Checks if a content ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Valid content IDs should be UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Exception: temporary IDs starting with 'temp-' are also valid
  const isTempId = contentId.startsWith('temp-');
  
  return uuidRegex.test(contentId) || isTempId;
}

/**
 * Gets detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Missing,
      message: 'Content ID is missing'
    };
  }

  if (contentId.trim() === '') {
    return {
      isValid: false,
      result: ContentIdValidationResultType.Empty,
      message: 'Content ID is empty'
    };
  }

  if (contentId.startsWith('temp-')) {
    return {
      isValid: true,
      result: ContentIdValidationResultType.Temporary,
      message: 'Content ID is temporary'
    };
  }

  // Check if it's a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = uuidRegex.test(contentId);

  if (isValidUuid) {
    return {
      isValid: true,
      result: ContentIdValidationResultType.Valid,
      message: null
    };
  }

  return {
    isValid: false,
    result: ContentIdValidationResultType.Invalid,
    message: 'Content ID is not a valid UUID'
  };
}

// Re-export the types for backward compatibility
export type { ContentIdValidationResult, ContentIdValidationResultType } from './types';
