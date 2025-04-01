
/**
 * Validation result types
 */

/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  resultType: string;
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean | null;
  resultType: 'contentId';
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * Create a basic validation result
 */
export function createValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  resultType: string
): ValidationResult {
  return {
    isValid,
    errorMessage,
    resultType
  };
}

/**
 * Create a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  contentExists: boolean | null
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    contentExists,
    resultType: 'contentId'
  };
}

/**
 * Create a tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'tag'
  };
}

// Legacy functions for backward compatibility
export function createValidResult(message?: string | null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    resultType: 'generic'
  };
}

export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    resultType: 'generic'
  };
}

export function createContentValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  contentExists?: boolean | null
): ContentIdValidationResult {
  return createContentIdValidationResult(isValid, errorMessage, contentExists ?? null);
}

/**
 * Check if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid;
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalid = results.find(result => !result.isValid);
  if (invalid) {
    return invalid;
  }
  
  return createValidationResult(true, null, 'combined');
}
