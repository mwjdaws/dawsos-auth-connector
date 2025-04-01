
/**
 * Base validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage: string | null;
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
