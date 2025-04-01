/**
 * Error handling compatibility utilities
 * 
 * These utilities help bridge the gap between different error handling approaches
 * in the codebase.
 */
import { ErrorLevel } from './types';
import { handleError as handleErrorInternal } from './handle';

// Map from new ErrorLevel to old error severity types
const errorLevelMap: Record<string, string> = {
  'DEBUG': 'debug',
  'INFO': 'info',
  'WARNING': 'warning',
  'ERROR': 'error'
};

/**
 * Compatibility function for handling errors
 * Supports both new and old error handling formats
 */
export function handleError(
  error: unknown,
  userMessage?: string,
  options?: any
): void {
  // Normalize options
  const normalizedOptions: any = { ...options };
  
  // Handle technical details for legacy support
  if (normalizedOptions && normalizedOptions.technical) {
    // If 'technical' property exists, add it to context for logging
    normalizedOptions.context = {
      ...normalizedOptions.context,
      technicalDetails: normalizedOptions.technical
    };
    delete normalizedOptions.technical;
  }
  
  // Map ErrorLevel enum values to string values expected by handleErrorInternal
  if (normalizedOptions && normalizedOptions.level && typeof normalizedOptions.level === 'string') {
    if (normalizedOptions.level in ErrorLevel) {
      normalizedOptions.level = errorLevelMap[normalizedOptions.level] || 'error';
    }
  }
  
  // Support showToast option
  if (normalizedOptions && 'showToast' in normalizedOptions) {
    // Keep for compatibility
  }
  
  // Call internal handler
  handleErrorInternal(error, userMessage, normalizedOptions);
}

/**
 * Create a compatibility layer for older error handler calls
 */
export function createErrorHandlerCompat(
  componentName: string,
  defaultOptions?: any
) {
  return (error: unknown, userMessage?: string, options?: any): void => {
    handleError(error, userMessage, {
      ...defaultOptions,
      ...options,
      context: {
        ...(defaultOptions?.context || {}),
        ...(options?.context || {}),
        componentName
      }
    });
  };
}

// Export error level enum for compatibility
export enum ErrorLevelCompat {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}
