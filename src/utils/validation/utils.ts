
/**
 * Validation utility functions
 */
import { ContentIdValidationResult, ValidationResult } from './types';
import { 
  createValidResult,
  createInvalidResult,
  createContentIdValidationResult
} from './types';

/**
 * Creates a content validation result for compatibility purposes
 */
export function createContentValidationResult(
  isValid: boolean,
  message: string | null = null,
  errorMessage: string | null = null,
  contentExists: boolean = false
): ContentIdValidationResult {
  return createContentIdValidationResult(
    isValid,
    isValid ? (contentExists ? 'VALID' : 'TEMP') : 'INVALID',
    message,
    errorMessage,
    contentExists
  );
}

/**
 * Gets a validation result for a content ID with additional checks
 */
export function getContentIdValidationResult(
  id: string | null | undefined,
  exists: boolean = false
): ContentIdValidationResult {
  if (!id) {
    return createContentIdValidationResult(
      false,
      'INVALID',
      null,
      'Content ID is required',
      false
    );
  }

  // For existing content
  if (exists) {
    return createContentIdValidationResult(
      true,
      'VALID',
      'Content exists',
      null,
      true
    );
  }

  // Default result for non-null ID that may not exist
  return createContentIdValidationResult(
    true,
    'VALID',
    'Valid content ID format',
    null,
    false
  );
}
