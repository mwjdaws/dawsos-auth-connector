
import { ValidationResult } from './types';

/**
 * Common validation result constants
 * Pre-defined validation results for common cases
 */
export const VALIDATION_RESULTS = {
  /** Valid result with no error message */
  VALID: { isValid: true, errorMessage: null, message: null } as ValidationResult,
  
  /** Generic invalid result */
  INVALID: { isValid: false, errorMessage: "Invalid input", message: "Invalid input" } as ValidationResult,
  
  /** Required field validation result */
  REQUIRED: { isValid: false, errorMessage: "This field is required", message: "This field is required" } as ValidationResult,

  /** Too long validation result */
  TOO_LONG: { isValid: false, errorMessage: "Input is too long", message: "Input is too long" } as ValidationResult,
  
  /** Too short validation result */
  TOO_SHORT: { isValid: false, errorMessage: "Input is too short", message: "Input is too short" } as ValidationResult,
  
  /** Invalid format validation result */
  INVALID_FORMAT: { isValid: false, errorMessage: "Invalid format", message: "Invalid format" } as ValidationResult,
};

/**
 * Creates a properly formatted validation result
 * 
 * @param isValid - Whether the validation passed
 * @param errorMessage - Optional error message if validation failed
 * @returns A properly formatted ValidationResult object
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
 * 
 * @param value - The value to transform
 * @returns The original value or undefined if null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Transforms undefined to null for TypeScript compatibility
 * 
 * @param value - The value to transform
 * @returns The original value or null if undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Ensures a value is a string or empty string if null/undefined
 * 
 * @param value - The value to ensure is a string
 * @returns A string, never null or undefined
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Ensures a value is a number or default value if null/undefined
 * 
 * @param value - The value to ensure is a number
 * @param defaultValue - The default value if null/undefined
 * @returns A number, never null or undefined
 */
export function ensureNumber(value: number | null | undefined, defaultValue = 0): number {
  return value ?? defaultValue;
}

/**
 * Safely invokes a callback function if it exists
 * 
 * @param callback - The callback function to invoke
 * @param defaultValue - The default value to return if callback is undefined
 * @returns A function that safely invokes the callback
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  defaultValue?: ReturnType<T>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (typeof callback === 'function') {
      return callback(...args);
    }
    return defaultValue as ReturnType<T>;
  }) as T;
}

/**
 * Checks if a value is defined (not null or undefined)
 * 
 * @param value - The value to check
 * @returns True if the value is defined, false otherwise
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
