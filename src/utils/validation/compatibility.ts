
/**
 * Type compatibility layer for validation
 * This file provides bridge functions and types to ensure compatibility
 * between different versions of the validation system
 */

import { 
  ValidationResult, 
  ContentIdValidationResult, 
  ContentIdValidationResultType 
} from './types';

/**
 * Ensure a string is not null - useful for handling null/undefined conflicts
 */
export function ensureString(value: string | null | undefined): string {
  return value || '';
}

/**
 * Ensure null values are converted to undefined and vice versa
 * This helps bridge the gap between APIs expecting null vs undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Handle optional callback compatibility
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  defaultValue?: ReturnType<T>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (callback) {
      return callback(...args);
    }
    return defaultValue as ReturnType<T>;
  }) as T;
}

/**
 * Create a version of ContentIdValidationResult compatible with older code
 */
export function createCompatibleValidationResult(
  isValid: boolean,
  resultType: ContentIdValidationResultType,
  message: string | null
): ContentIdValidationResult {
  return {
    isValid,
    result: resultType,
    resultType: resultType, // For backward compatibility
    message
  };
}

/**
 * ContentIdValidationResult constants for backward compatibility
 */
export const VALIDATION_RESULTS = {
  VALID: ContentIdValidationResultType.Valid,
  INVALID: ContentIdValidationResultType.Invalid,
  MISSING: ContentIdValidationResultType.Missing,
  EMPTY: ContentIdValidationResultType.Empty,
  TEMPORARY: ContentIdValidationResultType.Temporary
};
