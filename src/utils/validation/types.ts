
/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Create a valid validation result
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    message: message || null
  };
}

/**
 * Create an invalid validation result
 */
export function createInvalidResult(message: string): ValidationResult {
  return {
    isValid: false,
    message
  };
}
