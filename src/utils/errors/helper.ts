
import { ErrorHandlingCompatOptions, ErrorLevel } from './types';

/**
 * Process error handling options with fallbacks
 */
export function processErrorOptions(options?: ErrorHandlingCompatOptions) {
  const defaults = {
    errorMessage: 'An error occurred',
    level: 'error' as const,
    context: {},
    silent: false,
    technical: false,
    actionLabel: undefined,
    onRetry: undefined,
    preventDuplicate: false,
    deduplicate: false,
    duration: 5000
  };

  if (!options) {
    return defaults;
  }

  return {
    ...defaults,
    ...options
  };
}

/**
 * Map custom error levels to standard ones
 */
export function mapErrorLevel(level?: string): ErrorLevel {
  switch(level) {
    case 'debug': return 'debug';
    case 'info': return 'info';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'error';
  }
}

/**
 * Format an error message with context
 */
export function formatErrorMessage(
  error: unknown, 
  defaultMessage: string = 'An error occurred'
): string {
  if (!error) {
    return defaultMessage;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === 'object') {
    const errorObj = error as any;
    
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    
    try {
      return JSON.stringify(error);
    } catch {
      // Fall through to default
    }
  }

  return defaultMessage;
}
