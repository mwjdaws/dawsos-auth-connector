
/**
 * Compatibility utilities for validation operations
 * 
 * This file provides compatibility layers for validation operations
 * to handle differences in expected return types.
 */

import { ValidationResult, ContentIdValidationResult, ContentIdValidationResultType } from './types';

/**
 * Ensure a value is a string
 */
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

/**
 * Convert null to undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Convert undefined to null
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Execute a callback safely, handling potential undefined values
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  return callback ? callback(...args) : undefined;
}

// Standard validation result options
export const VALIDATION_RESULTS = {
  VALID: { isValid: true, errorMessage: null },
  INVALID: { isValid: false, errorMessage: 'Invalid input' },
  MISSING: { isValid: false, errorMessage: 'Required field is missing' },
  TOO_LONG: { isValid: false, errorMessage: 'Input exceeds maximum length' }
};

/**
 * Create a compatible validation result
 */
export function createCompatibleValidationResult(
  isValid: boolean, 
  errorMessage?: string | null
): { isValid: boolean; errorMessage: string | null } {
  return { 
    isValid, 
    errorMessage: errorMessage || null
  };
}
