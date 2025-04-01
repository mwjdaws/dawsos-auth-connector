
/**
 * Common validation result type
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
  isLoading?: boolean;
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
 * Document validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

// Standard result creation functions
export const createValidResult = (message: string | null = null): ValidationResult => ({
  isValid: true,
  errorMessage: null,
  message,
  resultType: 'generic'
});

export const createInvalidResult = (errorMessage: string | null = null): ValidationResult => ({
  isValid: false,
  errorMessage,
  message: errorMessage,
  resultType: 'generic'
});

// Utility functions to create validation results with default values
export const createContentIdValidationResult = (
  isValid: boolean,
  contentExists: boolean = false,
  message: string | null = null
): ContentIdValidationResult => ({
  isValid,
  contentExists,
  errorMessage: isValid ? null : message,
  message,
  resultType: 'contentId'
});

export const createTagValidationResult = (
  isValid: boolean,
  message: string | null = null
): TagValidationResult => ({
  isValid,
  errorMessage: isValid ? null : message,
  message,
  resultType: 'tag'
});

export const createOntologyTermValidationResult = (
  isValid: boolean,
  message: string | null = null
): OntologyTermValidationResult => ({
  isValid,
  errorMessage: isValid ? null : message,
  message,
  resultType: 'ontologyTerm'
});

export const createDocumentValidationResult = (
  isValid: boolean,
  message: string | null = null
): DocumentValidationResult => ({
  isValid,
  errorMessage: isValid ? null : message,
  message,
  resultType: 'document'
});

// Additional utility functions
export const isValidResult = (result: ValidationResult): boolean => {
  return result.isValid;
};

export const combineValidationResults = (
  results: ValidationResult[]
): ValidationResult => {
  if (!results.length) {
    return createValidResult();
  }
  
  const isValid = results.every(r => r.isValid);
  const firstInvalid = results.find(r => !r.isValid);
  
  return {
    isValid,
    errorMessage: isValid ? null : firstInvalid?.errorMessage || 'Validation failed',
    message: isValid ? 'All validations passed' : firstInvalid?.errorMessage || 'Validation failed',
    resultType: 'combined'
  };
};
