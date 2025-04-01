
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';

/**
 * Convert error options from old format to new format
 * This makes the error handling system backward compatible
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
 * Update the ErrorSource enum values to handle legacy code
 */
export const ErrorSourceCompatibility = {
  ...ErrorSource,
  AUTHENTICATION: ErrorSource.Auth,
  VALIDATION: ErrorSource.Validation,
  UI: ErrorSource.UI,
  API: ErrorSource.API
};

/**
 * Update the ErrorLevel enum values to handle legacy code
 */
export const ErrorLevelCompatibility = {
  ...ErrorLevel,
  CRITICAL: ErrorLevel.Critical
};

/**
 * Function to handle compatibility with older error handling code
 */
export function compatibleErrorOptions(
  message: string,
  level: ErrorLevel = ErrorLevel.Error,
  source: ErrorSource = ErrorSource.Unknown
): ErrorHandlingOptions {
  return {
    message,
    level,
    source,
    toastTitle: message
  };
}
