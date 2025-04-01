
import { validate as validateUUID } from 'uuid';
import { ContentIdValidationResult, createContentIdValidationResult } from './types';

/**
 * Check if a string is a valid UUID
 */
export function isUUID(value: string): boolean {
  return validateUUID(value);
}

/**
 * Check if a string is a temporary ID
 * Temporary IDs start with 'temp-'
 */
export function isTempId(value: string): boolean {
  return value.startsWith('temp-');
}

/**
 * Check if a content ID is valid
 * Valid content IDs are either UUIDs or temporary IDs
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
}

/**
 * Check if a content ID can be stored in the database
 * Storable content IDs are UUIDs (no temporary IDs)
 */
export function isStorableContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Try to convert a content ID to a UUID
 * Returns the original value if it's already a UUID or cannot be converted
 */
export function tryConvertToUUID(contentId?: string | null): string | null {
  if (!contentId) return null;
  if (isUUID(contentId)) return contentId;
  // Add additional conversion logic here if needed
  return contentId;
}

/**
 * Get a validation result for a content ID
 */
export function getContentIdValidationResult(contentId?: string | null): ContentIdValidationResult {
  if (!contentId) {
    return createContentIdValidationResult(false, 'Content ID is required');
  }
  
  if (!isValidContentId(contentId)) {
    return createContentIdValidationResult(false, 'Invalid content ID format');
  }
  
  // For now, we set contentExists to true based on the valid format
  // In a real application, this would check against the database
  return createContentIdValidationResult(true, null, true);
}

/**
 * Validate a content ID with more context
 * @deprecated Use getContentIdValidationResult instead
 */
export function validateContentId(contentId?: string | null): ContentIdValidationResult {
  return getContentIdValidationResult(contentId);
}
