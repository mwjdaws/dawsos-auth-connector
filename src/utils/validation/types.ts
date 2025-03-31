
/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorMessage?: string | null;
}

/**
 * Content ID validation result interface
 * Extends the base ValidationResult with additional properties
 */
export interface ContentIdValidationResult extends ValidationResult {
  resultType: 'valid' | 'invalid' | 'uuid' | 'temp';
  errorMessage: string | null;
}

/**
 * Document validation options
 */
export interface DocumentValidationOptions {
  minLength?: number;
  maxLength?: number;
  contentRequired?: boolean;
}

/**
 * Tag validation options
 */
export interface TagValidationOptions extends ValidationOptions {
  allowDuplicates?: boolean;
}

/**
 * Document validation result
 */
export interface DocumentValidationResult {
  isValid: boolean;
  titleError: string | null;
  contentError: string | null;
}

/**
 * Tag validation result
 */
export interface TagValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Tag position interface for reordering operations
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Create a valid validation result
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    message: message || null,
    errorMessage: null
  };
}

/**
 * Create an invalid validation result
 */
export function createInvalidResult(message: string): ValidationResult {
  return {
    isValid: false,
    message,
    errorMessage: message
  };
}

/**
 * Base validation options
 */
export interface ValidationOptions {
  allowEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
}
