
/**
 * Validation utility functions
 * 
 * Common utilities for creating and manipulating validation results.
 */
import { ValidationResult } from './types';

/**
 * Creates a valid validation result
 * 
 * @param message Optional success message
 * @returns A valid validation result
 */
export function createValidResult(message?: string | null): ValidationResult {
  return {
    isValid: true,
    message: message || 'Valid',
    errorMessage: null
  };
}

/**
 * Creates an invalid validation result
 * 
 * @param errorMessage Error message explaining the validation failure
 * @returns An invalid validation result
 */
export function createInvalidResult(errorMessage: string): ValidationResult {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}

/**
 * Combines multiple validation results into a single result
 * 
 * @param results Array of validation results to combine
 * @returns A combined validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const invalidResult = results.find(result => !result.isValid);
  
  if (invalidResult) {
    return invalidResult;
  }
  
  return createValidResult();
}

/**
 * Validates that a value is not empty
 * 
 * @param value The value to check
 * @param errorMessage Optional custom error message
 * @returns A validation result
 */
export function validateNotEmpty(value: string | null | undefined, errorMessage = 'Value cannot be empty'): ValidationResult {
  if (!value || value.trim() === '') {
    return createInvalidResult(errorMessage);
  }
  
  return createValidResult();
}

/**
 * Validates a value against minimum and maximum length constraints
 * 
 * @param value The value to check
 * @param options Length validation options
 * @returns A validation result
 */
export function validateLength(
  value: string,
  { min = 0, max = Infinity, minMessage, maxMessage }: { min?: number; max?: number; minMessage?: string; maxMessage?: string }
): ValidationResult {
  if (value.length < min) {
    return createInvalidResult(minMessage || `Must be at least ${min} characters`);
  }
  
  if (value.length > max) {
    return createInvalidResult(maxMessage || `Cannot exceed ${max} characters`);
  }
  
  return createValidResult();
}

/**
 * Validates a value against a regular expression pattern
 * 
 * @param value The value to check
 * @param pattern The regex pattern to match against
 * @param errorMessage Error message for failed validation
 * @returns A validation result
 */
export function validatePattern(value: string, pattern: RegExp, errorMessage: string): ValidationResult {
  if (!pattern.test(value)) {
    return createInvalidResult(errorMessage);
  }
  
  return createValidResult();
}
