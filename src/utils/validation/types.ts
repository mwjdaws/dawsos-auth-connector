
/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
  contentExists?: boolean;
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'contentId';
  contentExists: boolean;
}

/**
 * Document content validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  resultType: 'tag';
}

/**
 * Ontology term validation result
 */
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: 'ontologyTerm';
}

/**
 * Create a valid validation result
 * @param type Result type
 * @param message Optional success message
 * @returns Validation result
 */
export function createValidResult(
  type: string, 
  message: string | null = null
): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message,
    resultType: type
  };
}

/**
 * Create an invalid validation result
 * @param type Result type
 * @param errorMessage Error message
 * @param message Optional context message
 * @returns Validation result
 */
export function createInvalidResult(
  type: string, 
  errorMessage: string, 
  message: string | null = null
): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message,
    resultType: type
  };
}

/**
 * Create a content ID validation result
 * @param isValid Is valid flag
 * @param contentExists Content exists flag
 * @param errorMessage Optional error message
 * @param message Optional success message
 * @returns Content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  contentExists: boolean,
  errorMessage: string | null = null,
  message: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    contentExists,
    errorMessage,
    message,
    resultType: 'contentId'
  };
}

/**
 * Check if a validation result is valid
 * @param result Validation result to check
 * @returns True if valid
 */
export function isValidResult(result: ValidationResult | undefined): boolean {
  return result?.isValid === true;
}

/**
 * Combine multiple validation results
 * @param results Results to combine
 * @returns Combined validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  // If any result is invalid, return the first invalid result
  const firstInvalid = results.find(r => !r.isValid);
  if (firstInvalid) {
    return firstInvalid;
  }
  
  // All results are valid, return a valid result
  return createValidResult('combined');
}
