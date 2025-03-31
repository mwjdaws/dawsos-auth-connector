
/**
 * Content ID validation utilities
 * 
 * Provides functions to validate content IDs in various formats.
 */

/**
 * Validates if a string is a valid content ID
 * Accepts both UUID format and temporary IDs (starting with 'temp-')
 * 
 * @param contentId Content ID to validate
 * @returns True if the content ID is valid, false otherwise
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Allow temporary IDs (used during content creation)
  if (contentId.startsWith('temp-')) {
    return contentId.length > 5; // Make sure there's something after 'temp-'
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId);
}

/**
 * Checks if a content ID is a temporary ID
 * 
 * @param contentId Content ID to check
 * @returns True if the content ID is temporary, false otherwise
 */
export function isTemporaryContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return contentId.startsWith('temp-');
}

/**
 * Validates if a string is specifically a UUID format content ID
 * 
 * @param contentId Content ID to validate
 * @returns True if the content ID is a valid UUID, false otherwise
 */
export function isUuidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId);
}
