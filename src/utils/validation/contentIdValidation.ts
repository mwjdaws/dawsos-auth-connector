
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

/**
 * Checks if a string is a valid UUID
 */
export function isUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Checks if a string is a temporary ID (starts with 'temp-')
 */
export function isTempId(id: string): boolean {
  return id.startsWith('temp-');
}

/**
 * Checks if a content ID is valid (either UUID or temp ID)
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Try to convert a string to a UUID if possible
 */
export function tryConvertToUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  if (isUUID(contentId)) return contentId;
  return null;
}

/**
 * Check if a content ID is storable (must be a UUID)
 */
export function isStorableContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Get content ID validation result with detailed information
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(false, 'Content ID is required');
  }
  
  const validFormat = isValidContentId(contentId);
  
  if (!validFormat) {
    return createContentIdValidationResult(false, 'Invalid content ID format');
  }
  
  return createContentIdValidationResult(true, null, true);
}

/**
 * Legacy function for backward compatibility
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
