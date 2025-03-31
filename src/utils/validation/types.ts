
/**
 * Validation result interface
 * 
 * Standard structure for returning validation results throughout the application
 */
export interface ValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;
  
  /**
   * Optional success message (only present when isValid is true)
   */
  message: string | null;
  
  /**
   * Optional error message explaining why validation failed (only present when isValid is false)
   */
  errorMessage: string | null;
  
  /**
   * Optional validation warnings that don't affect validity
   */
  warnings?: string[];
  
  /**
   * Optional metadata for the validation result
   */
  metadata?: Record<string, any>;
}

/**
 * Validation levels for different severity of validation checks
 */
export enum ValidationLevel {
  /**
   * Required validation - must pass for operation to proceed
   */
  REQUIRED = 'required',
  
  /**
   * Warning validation - operation can proceed but with caution
   */
  WARNING = 'warning',
  
  /**
   * Suggestion validation - purely informational
   */
  SUGGESTION = 'suggestion'
}

/**
 * Create a successful validation result
 * 
 * @param message Optional success message
 * @returns A valid validation result
 */
export function createValidResult(message: string | null = null): ValidationResult {
  return {
    isValid: true,
    message,
    errorMessage: null
  };
}

/**
 * Create a failed validation result
 * 
 * @param errorMessage Error message explaining why validation failed
 * @returns An invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}
