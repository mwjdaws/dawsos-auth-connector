
import { ErrorLevel, ErrorHandlingOptions } from "./types";

/**
 * Determine if an error is related to network connectivity
 */
export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('connection') ||
    message.includes('unreachable')
  );
}

/**
 * Determine if an error is an unauthorized error
 */
export function isUnauthorizedError(error: Error & { status?: number }): boolean {
  return error.status === 401 || 
    error.message.toLowerCase().includes('unauthorized') ||
    error.message.toLowerCase().includes('not authenticated');
}

/**
 * Determine if an operation succeeded with errors
 */
export function isSuceededError(error: Error & { succeeded?: boolean }): boolean {
  return error.succeeded === true;
}

/**
 * Convert a string level to the corresponding ErrorLevel enum
 */
export function stringToErrorLevel(level?: string): ErrorLevel {
  if (!level) return ErrorLevel.ERROR;
  
  switch (level.toLowerCase()) {
    case 'debug': return ErrorLevel.DEBUG;
    case 'info': return ErrorLevel.INFO;
    case 'warning': return ErrorLevel.WARNING;
    case 'error': return ErrorLevel.ERROR;
    default: return ErrorLevel.ERROR;
  }
}

/**
 * Convert legacy error handling options to the current format
 */
export function convertLegacyOptions(options?: Record<string, any>): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  const result: Partial<ErrorHandlingOptions> = { ...options };
  
  // Convert string level to enum
  if (typeof options.level === 'string') {
    result.level = stringToErrorLevel(options.level);
  }
  
  // Convert other properties as needed
  return result;
}
