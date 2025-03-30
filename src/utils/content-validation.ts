
/**
 * Utility functions for content ID validation
 */

/**
 * Enum for content ID validation result types
 */
export enum ContentIdValidationResult {
  VALID = 'valid',
  TEMPORARY = 'temporary',
  MISSING = 'missing',
  INVALID = 'invalid'
}

/**
 * Checks if a content ID is valid and not a temporary ID
 * @param contentId The content ID to validate
 * @returns True if the content ID is valid, false otherwise
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Check if it's a temporary ID (starts with 'temp-')
  if (contentId.startsWith('temp-')) return false;
  
  // Basic validation: should be a UUID or a valid string ID
  return contentId.length > 5;
}

/**
 * Gets detailed validation result for a content ID
 * @param contentId The content ID to validate
 * @returns A ContentIdValidationResult enum value indicating the validation status
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) return ContentIdValidationResult.MISSING;
  if (contentId.startsWith('temp-')) return ContentIdValidationResult.TEMPORARY;
  if (contentId.length <= 5) return ContentIdValidationResult.INVALID;
  return ContentIdValidationResult.VALID;
}

/**
 * Validates the content ID and returns a normalized version
 * @param contentId The content ID to validate and normalize
 * @returns The normalized content ID or null if invalid
 */
export function normalizeContentId(contentId: string | null | undefined): string | null {
  if (!isValidContentId(contentId)) return null;
  return contentId;
}
