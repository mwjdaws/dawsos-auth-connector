
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

/**
 * Helper functions for creating validation results
 */
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message
  };
}

export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null
  };
}

export function createContentValidationResult(
  isValid: boolean,
  resultType: ContentIdValidationResultType,
  contentExists: boolean,
  message: string | null = null,
  errorMessage: string | null = null
): ContentIdValidationResult {
  return {
    isValid,
    resultType,
    contentExists,
    message,
    errorMessage
  };
}

export function isValidResult(result: ValidationResult): boolean {
  return result.isValid === true;
}

export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(r => !r.isValid);
  if (invalidResult) {
    return invalidResult;
  }
  return createValidResult();
}
