
import { 
  ValidationResult, 
  ContentIdValidationResult, 
  ContentIdValidationResultType,
  createValidResult,
  createInvalidResult,
  createContentValidationResult,
  isValidResult,
  combineValidationResults
} from './types';

/**
 * Validates if a string is not empty
 */
export function validateNonEmpty(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return createInvalidResult(`${fieldName} cannot be empty`);
  }
  return createValidResult();
}

/**
 * Validates if a string is at least a certain length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  if (value && value.length < minLength) {
    return createInvalidResult(`${fieldName} must be at least ${minLength} characters`);
  }
  return createValidResult();
}

/**
 * Validates if a string is not longer than a certain length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  if (value && value.length > maxLength) {
    return createInvalidResult(`${fieldName} cannot exceed ${maxLength} characters`);
  }
  return createValidResult();
}

/**
 * Combines validation results and returns the first invalid result, or valid if all are valid
 */
export function validateAll(...results: ValidationResult[]): ValidationResult {
  return combineValidationResults(results);
}

// Re-export from types.ts for backward compatibility
export {
  createValidResult,
  createInvalidResult,
  createContentValidationResult,
  isValidResult,
  combineValidationResults
};
