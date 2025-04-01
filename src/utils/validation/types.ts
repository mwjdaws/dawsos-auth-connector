
/**
 * Validation result types
 */

// Base validation result interface
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
  resultType: 'generic' | 'content' | 'contentId' | 'tag' | 'ontologyTerm';
  contentExists?: boolean;
}

// Content ID specific validation result
export interface ContentIdValidationResult extends ValidationResult {
  contentExists: boolean;
  resultType: 'contentId';
}

// Tag specific validation result
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

// Helper functions to create validation results
export function createValidResult(message?: string | null, resultType: ValidationResult['resultType'] = 'generic'): ValidationResult {
  return {
    isValid: true,
    message: message || null,
    errorMessage: null,
    resultType
  };
}

export function createInvalidResult(errorMessage: string, message?: string | null, resultType: ValidationResult['resultType'] = 'generic'): ValidationResult {
  return {
    isValid: false,
    message: message || null,
    errorMessage,
    resultType
  };
}

export function createContentIdValidationResult(
  isValid: boolean, 
  errorMessage: string | null, 
  contentExists: boolean = false, 
  message: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    message,
    contentExists,
    resultType: 'contentId'
  };
}

export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  message: string | null = null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    message,
    resultType: 'tag'
  };
}

// Function to check if a ValidationResult is valid
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid;
}

// Function to combine multiple validation results
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(r => !r.isValid);
  
  if (invalidResult) {
    return invalidResult;
  }
  
  return createValidResult();
}
