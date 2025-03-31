
/**
 * Validation utilities
 * 
 * Helper functions for creating validation results.
 */

import { ValidationResult } from './types';

/**
 * Creates a valid validation result
 * 
 * @param message Optional success message
 * @returns Valid result object
 */
export function createValidResult(message?: string): ValidationResult {
  return {
    isValid: true,
    message: message || null,
    errorMessage: null
  };
}

/**
 * Creates an invalid validation result
 * 
 * @param errorMessage Error message explaining why validation failed
 * @returns Invalid result object
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}
