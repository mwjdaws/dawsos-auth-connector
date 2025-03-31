
/**
 * Validation and compatibility utility functions
 * These functions help ensure consistent type handling across the application
 */

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

/**
 * Ensures a value is a valid number, with a default fallback
 * @param value The value to check
 * @param defaultValue The default value to use if the input is invalid
 * @returns A valid number
 */
export function ensureNumber(value: number | undefined | null, defaultValue: number = 0): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * Ensures a value is a valid string, with a default fallback
 * @param value The value to check
 * @param defaultValue The default value to use if the input is invalid
 * @returns A valid string
 */
export function ensureString(value: string | undefined | null, defaultValue: string = ''): string {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  return value;
}

/**
 * Converts null to undefined for APIs that expect undefined
 * @param value The value to convert
 * @returns The value with null converted to undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null for APIs that expect null
 * @param value The value to convert
 * @returns The value with undefined converted to null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensures that an optional boolean property is handled consistently
 * @param value The boolean value to check
 * @param defaultValue The default value to use if undefined
 * @returns A boolean value
 */
export function ensureBoolean(value: boolean | undefined | null, defaultValue: boolean = false): boolean {
  if (typeof value !== 'boolean') {
    return defaultValue;
  }
  return value;
}

/**
 * Ensures a value is an object with a default fallback
 */
export function ensureObject<T extends object>(value: T | undefined | null, defaultValue: T): T {
  if (!value || typeof value !== 'object') {
    return defaultValue;
  }
  return value;
}

/**
 * Create a safe callback function
 */
export function createSafeCallback<T extends (...args: any[]) => any>(fn: T | undefined | null): T {
  return ((...args: any[]) => {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    return undefined;
  }) as T;
}
