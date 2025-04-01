
import { v4 as uuidv4, validate as isValidUuid } from 'uuid';
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

/**
 * Check if a string is a valid UUID
 */
export function isUUID(value: string | null | undefined): boolean {
  if (!value) return false;
  return isValidUuid(value);
}

/**
 * Check if a string is a temporary ID (starts with 'temp-')
 */
export function isTempId(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith('temp-');
}

/**
 * Check if a string is a valid content ID (either UUID or temp ID)
 */
export function isValidContentId(value: string | null | undefined): boolean {
  if (!value) return false;
  return isUUID(value) || isTempId(value);
}

/**
 * Validate a content ID and return detailed validation result
 */
export function validateContentId(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(false, 'Content ID is required', null);
  }
  
  if (isTempId(contentId)) {
    return createContentIdValidationResult(true, null, false);
  }
  
  if (isUUID(contentId)) {
    return createContentIdValidationResult(true, null, null);
  }
  
  return createContentIdValidationResult(
    false,
    'Invalid content ID format. Expected UUID or temporary ID.',
    false
  );
}

/**
 * Get a validation result for a content ID
 * 
 * This is a convenience wrapper around validateContentId that provides
 * a more detailed error message.
 */
export function getContentIdValidationResult(
  contentId: string | null | undefined
): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(
      false,
      'Content ID is required',
      null
    );
  }
  
  if (contentId.trim() === '') {
    return createContentIdValidationResult(
      false,
      'Content ID cannot be empty',
      false
    );
  }
  
  if (isTempId(contentId)) {
    return createContentIdValidationResult(
      true,
      null,
      false
    );
  }
  
  if (isUUID(contentId)) {
    return createContentIdValidationResult(
      true,
      null,
      null
    );
  }
  
  return createContentIdValidationResult(
    false,
    `Invalid content ID format: ${contentId}. Expected UUID or temporary ID.`,
    false
  );
}

/**
 * Generate a new temporary content ID
 */
export function generateTempContentId(): string {
  return `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Generate a new UUID
 */
export function generateUUID(): string {
  return uuidv4();
}
