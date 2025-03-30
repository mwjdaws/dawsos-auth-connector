
/**
 * Validates if a content ID is valid
 */
export function isValidContentId(contentId: string | null): boolean {
  if (!contentId) return false;
  
  // UUIDs should be 36 characters long (with hyphens)
  if (contentId.length !== 36) return false;
  
  // Simple regex check for UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(contentId);
}

/**
 * Gets detailed validation result for a content ID
 */
export function getContentIdValidationResult(contentId: string | null): ContentIdValidationResult {
  if (!contentId) {
    return {
      isValid: false,
      message: "Content ID is required"
    };
  }
  
  if (contentId.length !== 36) {
    return {
      isValid: false,
      message: "Content ID must be a valid UUID (36 characters)"
    };
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(contentId)) {
    return {
      isValid: false,
      message: "Content ID must be in a valid UUID format"
    };
  }
  
  return {
    isValid: true,
    message: null
  };
}

export interface ContentIdValidationResult {
  isValid: boolean;
  message: string | null;
}
