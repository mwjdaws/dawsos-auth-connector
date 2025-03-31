
import { ValidationResult } from './types';

/**
 * Common validation result constants
 */
export const VALIDATION_RESULTS = {
  VALID: { isValid: true, errorMessage: null, message: null } as ValidationResult,
  INVALID: { isValid: false, errorMessage: "Invalid input", message: "Invalid input" } as ValidationResult,
  REQUIRED: { isValid: false, errorMessage: "This field is required", message: "This field is required" } as ValidationResult,
};

/**
 * Creates a properly formatted validation result
 */
export function createValidationResult(isValid: boolean, errorMessage?: string | null): ValidationResult {
  return {
    isValid,
    errorMessage: isValid ? null : errorMessage || null,
    message: isValid ? null : errorMessage || null, // For backward compatibility
  };
}

/**
 * Transforms null to undefined for TypeScript compatibility
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Transforms undefined to null for TypeScript compatibility
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensures a value is a string or empty string if null/undefined
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}
