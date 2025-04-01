
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './errors/types';

/**
 * Utility functions for backward compatibility
 */

/**
 * Convert error options from old format to new format
 */
export function convertErrorOptions(
  options?: Partial<ErrorHandlingOptions> | string | ErrorLevel
): Partial<ErrorHandlingOptions> {
  // If it's already in the correct format, return it
  if (options && typeof options === 'object') {
    const result: Partial<ErrorHandlingOptions> = { ...options };
    
    // Handle retryCount if present (move to context)
    if ('retryCount' in options) {
      result.context = {
        ...result.context,
        retryCount: options.retryCount
      };
      delete result.retryCount;
    }
    
    return result;
  }

  // Convert string to error message
  if (typeof options === 'string') {
    return {
      message: options,
      toastTitle: options
    };
  }

  // Convert ErrorLevel to level
  if (typeof options === 'number') {
    return {
      level: options as ErrorLevel
    };
  }

  // Return empty object for undefined
  return {};
}

/**
 * Ensure a value is a string, converting null/undefined to empty string
 */
export function ensureString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  return String(value);
}

// Add other compatibility utilities as needed
