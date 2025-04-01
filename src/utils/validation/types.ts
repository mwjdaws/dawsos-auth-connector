
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
 * @param resultType Result type
 * @param message Optional success message
 * @returns Validation result
 */
export function createValidResult(
  resultType: string, 
  message: string | null = null
): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message,
    resultType
  };
}

/**
 * Create an invalid validation result
 * @param resultType Result type
 * @param errorMessage Error message
 * @param message Optional context message
 * @returns Validation result
 */
export function createInvalidResult(
  resultType: string, 
  errorMessage: string, 
  message: string | null = null
): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message,
    resultType
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
 * Create a document validation result 
 * @param isValid Is valid flag
 * @param errorMessage Error message
 * @param message Optional success message
 * @returns Document validation result
 */
export function createDocumentValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  message: string | null = null
): DocumentValidationResult {
  return {
    isValid,
    errorMessage,
    message,
    resultType: 'document'
  };
}

/**
 * Create a tag validation result
 * @param isValid Is valid flag
 * @param errorMessage Error message
 * @param message Optional success message
 * @returns Tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  errorMessage: string | null = null,
  message: string | null = null
): TagValidationResult {
  return {
    isValid,
    errorMessage,
    message,
    resultType: 'tag'
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
