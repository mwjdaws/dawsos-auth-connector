
// Re-export core error handling functionality
export { handleError, handleErrorSafe, createErrorHandler, createComponentErrorHandler } from './handle';
export { ErrorLevel, ErrorSource, type ErrorHandlingOptions, type EnhancedError } from './types';

// Re-export helper functions
export { generateErrorId } from './generateId';
export { categorizeError } from './categorize';
export { formatErrorForDisplay } from './format';
export { deduplicateError } from './deduplication';

// Re-export the wrapper functions
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
