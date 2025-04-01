
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

// Create a valid validation result
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message,
    resultType: 'generic'
  };
}

// Create an invalid validation result
export function createInvalidResult(errorMessage: string | null = null): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null,
    resultType: 'generic'
  };
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
    message: errorMessage,
    contentExists,
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

// Helper to combine multiple validation results
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const allValid = results.every(r => r.isValid);
  const firstError = results.find(r => !r.isValid);
  
  return {
    isValid: allValid,
    errorMessage: allValid ? null : (firstError?.errorMessage || 'Validation failed'),
    message: allValid ? 'All validations passed' : null,
    resultType: 'combined'
  };
}

// Check if a validation result is valid
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}
