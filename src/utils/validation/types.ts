
/**
 * Validation result types
 */

/**
 * Standard validation result
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
}

/**
 * Content ID validation result type
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: string;
  contentExists: boolean;
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  tag?: string;
}

/**
 * Helper function to create a valid result
 */
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    message,
    errorMessage: null
  };
}

/**
 * Helper function to create an invalid result
 */
export function createInvalidResult(errorMessage: string | null = null): ValidationResult {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}

/**
 * Helper function to create a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  resultType: string,
  message: string | null = null,
  errorMessage: string | null = null,
  contentExists: boolean = false
): ContentIdValidationResult {
  return {
    isValid,
    resultType,
    message,
    errorMessage,
    contentExists
  };
}

/**
 * Check if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}

/**
 * Combine multiple validation results
 * Returns first invalid result or valid result if all are valid
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(result => !result.isValid);
  if (invalidResult) {
    return invalidResult;
  }
  return createValidResult();
}
