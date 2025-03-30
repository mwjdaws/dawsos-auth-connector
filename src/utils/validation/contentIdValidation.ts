
/**
 * Validation result for content ID validation
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  contentExists?: boolean;
  message: string | null;
}

/**
 * Check if a content ID is valid
 * 
 * @param contentId The content ID to validate
 * @returns boolean indicating if the content ID is valid
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // UUID format validation (simple regex check)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(contentId);
}

/**
 * Normalize a content ID to a standardized format
 * 
 * @param contentId The content ID to normalize
 * @returns The normalized content ID or null if invalid
 */
export function normalizeContentId(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  
  // Trim the contentId and convert to lowercase
  const normalizedId = contentId.trim().toLowerCase();
  
  // If it doesn't match the UUID pattern, return null
  if (!isValidContentId(normalizedId)) {
    return null;
  }
  
  return normalizedId;
}

/**
 * Get detailed validation result for a content ID
 * 
 * @param contentId The content ID to validate
 * @returns ValidationResult with details about the validation
 */
export function getContentIdValidationResult(contentId: string | null | undefined): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      message: "Content ID is required"
    };
  }
  
  // Normalize the ID first
  const normalizedId = normalizeContentId(contentId);
  
  if (!normalizedId) {
    return {
      isValid: false,
      message: "Invalid content ID format"
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}
