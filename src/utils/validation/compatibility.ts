
import { ValidationResult, VALIDATION_RESULTS } from './types';

/**
 * Create a validation result with the given validity and message
 */
export const createValidationResult = (isValid: boolean, errorMessage: string | null): ValidationResult => ({
  isValid,
  errorMessage
});

/**
 * Create a simple boolean validation result with an error message
 */
export const createBooleanValidationResult = (isValid: boolean, errorMessage?: string): boolean => {
  return isValid;
};
