
/**
 * Content validation utilities
 */
import { isValidContentId as isValidContentIdInternal, getContentIdValidationResult, tryConvertToUUID } from './validation/contentIdValidation';

/**
 * Validates if a string is a valid content ID
 * 
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  return isValidContentIdInternal(contentId);
}

/**
 * Gets detailed validation information for a content ID
 * 
 * @param contentId The content ID to validate
 * @returns Validation result object with detailed information
 */
export function validateContentId(contentId?: string | null) {
  return getContentIdValidationResult(contentId);
}

/**
 * Attempts to convert a string to a UUID format
 * 
 * @param contentId The content ID to convert
 * @returns UUID string if conversion is successful, null otherwise
 */
export function tryParseContentIdAsUUID(contentId?: string | null): string | null {
  return tryConvertToUUID(contentId);
}

/**
 * Checks if a content ID represents a temporary ID
 * 
 * @param contentId The content ID to check
 * @returns True if the content ID is a temporary ID
 */
export function isTemporaryContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  return contentId.startsWith('temp-');
}
