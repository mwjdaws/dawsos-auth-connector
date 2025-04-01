
import { 
  ValidationResult, 
  ContentIdValidationResult, 
  ContentIdValidationResultType,
  OntologyTermValidationResult,
  TagValidationResult
} from './types';

/**
 * Create a general validation result
 */
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    errorMessage: null,
    message: message || 'Valid input'
  };
}

/**
 * Create an invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    errorMessage,
    message: null
  };
}

/**
 * Create a content ID validation result with extended properties
 */
export function createContentValidationResult(
  isValid: boolean,
  message: string,
  resultType: ContentIdValidationResultType,
  contentExists: boolean
): ContentIdValidationResult {
  return {
    isValid,
    errorMessage: isValid ? null : message,
    message: isValid ? message : null,
    resultType,
    contentExists
  };
}

/**
 * Create an ontology term validation result
 */
export function createOntologyTermValidationResult(
  isValid: boolean,
  message: string | null,
  errorMessage: string | null,
  isDuplicate: boolean = false
): OntologyTermValidationResult {
  return {
    isValid,
    message,
    errorMessage,
    isDuplicate
  };
}

/**
 * Create a tag validation result
 */
export function createTagValidationResult(
  isValid: boolean,
  message: string | null,
  errorMessage: string | null
): TagValidationResult {
  return {
    isValid,
    message,
    errorMessage
  };
}

/**
 * Check if a validation result is valid
 */
export function isValidResult(result: ValidationResult): boolean {
  return result.isValid;
}

/**
 * Combine multiple validation results into one
 * Returns an invalid result if any of the results are invalid
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(result => !result.isValid);
  
  if (invalidResult) {
    return createInvalidResult(invalidResult.errorMessage || 'Validation failed');
  }
  
  return createValidResult();
}

/**
 * Get a user-friendly content validation message based on the validation result type
 */
export function getContentValidationMessage(resultType: ContentIdValidationResultType): string {
  switch (resultType) {
    case ContentIdValidationResultType.VALID:
      return 'Valid content ID';
    case ContentIdValidationResultType.VALID_FORMAT:
      return 'Content ID has valid format but existence not confirmed';
    case ContentIdValidationResultType.TEMP:
      return 'Temporary content ID';
    case ContentIdValidationResultType.MISSING:
      return 'Content ID is missing';
    case ContentIdValidationResultType.INVALID_FORMAT:
      return 'Content ID has invalid format';
    case ContentIdValidationResultType.NOT_FOUND:
      return 'Content ID not found in database';
    default:
      return 'Unknown validation result';
  }
}
