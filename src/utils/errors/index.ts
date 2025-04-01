
/**
 * Central error handling module
 * 
 * This module exports all error handling functionality from a single entry point.
 * It provides a consistent interface for error handling across the application.
 */

// Export core error handling functionality
export { handleError, handleErrorSafe, createErrorHandler, createComponentErrorHandler } from './handle';
export { ErrorLevel, ErrorSource, type ErrorHandlingOptions, type EnhancedError } from './types';

// Export helper utilities
export { generateErrorId } from './generateId';
export { categorizeError } from './categorize';
export { formatErrorForDisplay } from './format';
export { deduplicateError } from './deduplication';

// Export wrapper functions
export { 
  createComponentErrorHandler as createComponentHandler,
  createHookErrorHandler, 
  createServiceErrorHandler,
  withErrorHandling,
  tryAction
} from './wrappers';

// Export error types
export { ValidationError, ApiError } from './types';

// Legacy helper functions for backward compatibility
export { 
  isNetworkError, 
  isUnauthorizedError, 
  isSuceededError,
  stringToErrorLevel,
  convertLegacyOptions
} from './helper';
