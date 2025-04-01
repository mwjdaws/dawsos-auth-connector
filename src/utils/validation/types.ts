
/**
 * Basic validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message: string | null;
}

/**
 * Content ID validation result types
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  VALID_FORMAT = 'valid_format',
  TEMP = 'temp',
  MISSING = 'missing',
  INVALID_FORMAT = 'invalid_format',
  NOT_FOUND = 'not_found'
}

/**
 * Extended validation result for content IDs
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: ContentIdValidationResultType;
  contentExists: boolean;
}

/**
 * Validation result for ontology terms
 */
export interface OntologyTermValidationResult extends ValidationResult {
  isDuplicate: boolean;
}

/**
 * Tag validation result
 */
export interface TagValidationResult extends ValidationResult {
  // Tag-specific validation properties could be added here
}

/**
 * Document title validation result
 */
export interface DocumentTitleValidationResult extends ValidationResult {
  // Title-specific validation properties could be added here
}
