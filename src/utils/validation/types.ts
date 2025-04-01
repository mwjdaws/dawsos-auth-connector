
/**
 * Validation Types
 */

// Generic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
}

// Content ID validation result
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean;
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  isDuplicate?: boolean;
}

// Create a content ID validation result
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  contentExists: boolean = false
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    contentExists,
    message: errorMessage,
    resultType: 'contentId'
  };
}

// Create a tag validation result
export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  isDuplicate: boolean = false
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    message: errorMessage,
    resultType: 'tag',
    isDuplicate
  };
}
