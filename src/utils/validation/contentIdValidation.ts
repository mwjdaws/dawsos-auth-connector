
/**
 * Content ID validation utilities
 */

/**
 * Validates if a contentId is valid
 * @param contentId The content ID to validate
 * @returns Whether the content ID is valid
 */
export function isValidContentId(contentId?: string | null): boolean {
  if (!contentId) return false;
  
  // Valid content ID should be a UUID or a temporary ID starting with 'temp-'
  if (contentId.startsWith('temp-')) return true;
  
  // UUID validation using a regular expression
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId);
}

/**
 * Result of content ID validation
 */
export type ContentValidationResult = 'valid' | 'invalid' | 'temporary';

/**
 * Gets a detailed result of content ID validation
 * @param contentId The content ID to validate
 * @returns The validation result
 */
export function getContentIdValidationResult(contentId?: string | null): ContentValidationResult {
  if (!contentId) return 'invalid';
  
  // Check if it's a temporary ID
  if (contentId.startsWith('temp-')) return 'temporary';
  
  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId) ? 'valid' : 'invalid';
}
