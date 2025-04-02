
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
  message?: string | null; // For compatibility with legacy code
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
 * Document validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

/**
 * Ontology term validation result
 */
export interface OntologyTermValidationResult extends ValidationResult {
  resultType: 'ontology-term';
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
    resultType,
    message: isValid ? null : errorMessage
  };
}

/**
 * Create a content ID validation result
 */
export function createContentIdValidationResult(
  isValid: boolean,
  errorMessage: string | null,
  contentExists?: boolean | null
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage,
    contentExists: contentExists ?? null,
    resultType: 'contentId',
    message: isValid ? null : errorMessage
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
    resultType: 'tag',
    message: isValid ? null : errorMessage
  };
}

/**
 * Create an ontology term validation result
 */
export function createOntologyTermValidationResult(
  isValid: boolean,
  errorMessage: string | null
): OntologyTermValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'ontology-term',
    message: isValid ? null : errorMessage
  };
}

/**
 * Create a document validation result
 */
export function createDocumentValidationResult(
  isValid: boolean,
  errorMessage: string | null
): DocumentValidationResult {
  return {
    isValid,
    errorMessage,
    resultType: 'document',
    message: isValid ? null : errorMessage
  };
}

// Legacy functions for backward compatibility
export function createValidResult(message?: string | null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    resultType: 'generic',
    message: message || null
  };
}

export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    resultType: 'generic',
    message: errorMessage
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
