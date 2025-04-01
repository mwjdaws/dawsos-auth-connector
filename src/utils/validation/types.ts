
/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
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
 * Create a valid result
 */
export function createValidResult(message: string | null = null, resultType: string = 'general'): ValidationResult {
  return {
    isValid: true,
    message,
    errorMessage: null,
    resultType
  };
}

/**
 * Create an invalid result
 */
export function createInvalidResult(errorMessage: string, message: string | null = null, resultType: string = 'general'): ValidationResult {
  return {
    isValid: false,
    message,
    errorMessage,
    resultType
  };
}

/**
 * Create ContentIdValidationResult
 */
export function createContentIdValidationResult(isValid: boolean, message: string | null, errorMessage: string | null, contentExists: boolean): ContentIdValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'contentId',
    contentExists
  };
}

/**
 * Create TagValidationResult
 */
export function createTagValidationResult(isValid: boolean, message: string | null, errorMessage: string | null): TagValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'tag'
  };
}

/**
 * Create OntologyTermValidationResult
 */
export function createOntologyTermValidationResult(isValid: boolean, message: string | null, errorMessage: string | null): OntologyTermValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    resultType: 'ontologyTerm'
  };
}

/**
 * Check if a result is valid
 */
export const isValidResult = (result: ValidationResult): boolean => result.isValid;

/**
 * Combine multiple validation results
 */
export const combineValidationResults = (results: ValidationResult[]): ValidationResult => {
  if (results.length === 0) {
    return createValidResult();
  }
  
  const invalidResults = results.filter(result => !result.isValid);
  if (invalidResults.length === 0) {
    return createValidResult();
  }
  
  // Return the first invalid result
  return invalidResults[0];
};
