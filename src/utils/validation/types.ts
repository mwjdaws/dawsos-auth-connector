
/**
 * Common validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: string;
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
 * Document validation result
 */
export interface DocumentValidationResult extends ValidationResult {
  resultType: 'document';
}

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
