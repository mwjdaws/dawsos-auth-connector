
/**
 * Validation types and helper functions
 */

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
}

// Content ID validation result
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean;
  resultType: 'VALID' | 'INVALID' | 'TEMP' | 'NOT_FOUND';
}

// Create a valid result
export function createValidResult(message: string = "Validation passed"): ValidationResult {
  return {
    isValid: true,
    message,
    errorMessage: null
  };
}

// Create an invalid result
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}

// Create a content ID validation result
export function createContentIdValidationResult(
  isValid: boolean,
  resultType: ContentIdValidationResult['resultType'],
  message: string | null = null,
  errorMessage: string | null = null,
  contentExists: boolean = false
): ContentIdValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType,
    contentExists
  };
}

// Check if a result is valid
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}

// Combine multiple validation results
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  // Find the first invalid result, if any
  const invalidResult = results.find(result => !result.isValid);
  if (invalidResult) {
    return invalidResult;
  }
  
  // All results are valid
  return createValidResult();
}
