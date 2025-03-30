
/**
 * Content ID Validation Utilities
 * 
 * Provides validation and normalization functions for content IDs.
 * Ensures consistent handling of content identifiers throughout the application.
 */

/**
 * Enum for content ID validation result types
 * Used to provide more granular information about the validation status
 */
export enum ContentIdValidationResult {
  VALID = 'valid',
  TEMPORARY = 'temporary',
  MISSING = 'missing',
  INVALID = 'invalid'
}

/**
 * Checks if a content ID is valid and not a temporary ID
 * 
 * @param contentId - The content ID to validate
 * @returns True if the content ID is valid, false otherwise
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Check if it's a temporary ID (starts with 'temp-')
  if (contentId.startsWith('temp-')) return false;
  
  // Basic validation: should be a UUID or a valid string ID
  // UUID format: 8-4-4-4-12 hexadecimal digits
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 * 
 * @param contentId - The content ID to validate
 * @returns A ContentIdValidationResult enum value indicating the validation status
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) return ContentIdValidationResult.MISSING;
  if (contentId.startsWith('temp-')) return ContentIdValidationResult.TEMPORARY;
  
  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(contentId)) return ContentIdValidationResult.INVALID;
  
  return ContentIdValidationResult.VALID;
}

/**
 * Validates the content ID and returns a normalized version
 * 
 * @param contentId - The content ID to validate and normalize
 * @returns The normalized content ID or null if invalid
 */
export function normalizeContentId(contentId: string | null | undefined): string | null {
  if (!isValidContentId(contentId)) return null;
  return contentId;
}
