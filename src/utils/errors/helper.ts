
/**
 * Helper utilities for error handling
 */
import { ErrorLevel, ErrorHandlingOptions } from './types';

/**
 * Check if an error is a network error
 * 
 * @param error The error to check
 * @returns Whether the error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.toLowerCase().includes('network') ||
    error.message.toLowerCase().includes('fetch') ||
    error.message.toLowerCase().includes('connection')
  );
}

/**
 * Check if an error is an unauthorized error
 * 
 * @param error The error to check
 * @returns Whether the error is an unauthorized error
 */
export function isUnauthorizedError(error: Error & { status?: number }): boolean {
  return (
    error.status === 401 ||
    error.message.toLowerCase().includes('unauthorized') ||
    error.message.toLowerCase().includes('unauthenticated')
  );
}

/**
 * Check if an error has succeeded flag
 */
export function isSuceededError(error: Error & { succeeded?: boolean }): boolean {
  return error.succeeded === true;
}

/**
 * Convert a string to an ErrorLevel enum value
 * 
 * @param level The string level
 * @returns The corresponding ErrorLevel enum value
 */
export function stringToErrorLevel(level?: string): ErrorLevel {
  if (!level) return ErrorLevel.Error;
  
  switch (level.toLowerCase()) {
    case 'debug':
      return ErrorLevel.Debug;
    case 'info':
      return ErrorLevel.Info;
    case 'warning':
      return ErrorLevel.Warning;
    case 'error':
      return ErrorLevel.Error;
    default:
      return ErrorLevel.Error;
  }
}

/**
 * Convert legacy error options to the new format
 * 
 * @param options Legacy error options
 * @returns Converted error options
 */
export function convertLegacyOptions(options?: Record<string, any>): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // Start with a copy of the options
  const result: Partial<ErrorHandlingOptions> = { ...options };
  
  // Convert level from string to enum if needed
  if (typeof options.level === 'string') {
    result.level = stringToErrorLevel(options.level);
  }
  
  // Convert technical to context if needed
  if (options.technical !== undefined) {
    result.context = {
      ...(result.context || {}),
      technical: options.technical
    };
    delete result.technical;
  }
  
  return result;
}
