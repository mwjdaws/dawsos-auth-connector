
/**
 * Compatibility utilities for validation
 */

import { ValidationResult } from './types';

/**
 * Helper to convert null to undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Helper to convert undefined to null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensure a string value is always a string
 */
export function ensureString(value: string | null | undefined, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Create a standard validation result object
 */
export function createValidationResult(isValid: boolean, errorMessage: string | null = null): ValidationResult {
  return {
    isValid,
    errorMessage,
    message: errorMessage // For backward compatibility
  };
}

/**
 * Standard validation results for reuse
 */
export const VALIDATION_RESULTS = {
  VALID: createValidationResult(true, null),
  EMPTY: createValidationResult(false, "Value cannot be empty"),
  INVALID: createValidationResult(false, "Value is invalid"),
  TOO_LONG: createValidationResult(false, "Value exceeds maximum length"),
  TOO_SHORT: createValidationResult(false, "Value is too short")
};
