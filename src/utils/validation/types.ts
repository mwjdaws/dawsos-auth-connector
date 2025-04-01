
/**
 * Validation result interfaces
 */

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
}

// Content ID specific validation result 
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean | null;
  resultType: string;
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  tagExists?: boolean | null;
}

// Document validation result
export interface DocumentValidationResult extends ValidationResult {
  field?: string;
}

/**
 * Creates a valid validation result
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message: message || null
  };
}

/**
 * Creates an invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null
  };
}

/**
 * Creates a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  contentExists: boolean | null = null
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    message: null,
    contentExists,
    resultType: 'content-id'
  };
}

/**
 * Creates a tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  tagExists: boolean | null = null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    message: null,
    tagExists
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
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const isValid = results.every(r => r.isValid);
  
  if (isValid) {
    return createValidResult();
  }
  
  const firstError = results.find(r => !r.isValid);
  return createInvalidResult(firstError?.errorMessage || 'Validation failed');
}
