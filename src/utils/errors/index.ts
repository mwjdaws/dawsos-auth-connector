
// Re-export core error handling functionality
export { handleError, handleErrorSafe, createErrorHandler, createComponentErrorHandler } from './handle';
export { ErrorLevel, ErrorSource, type ErrorHandlingOptions, type EnhancedError } from './types';

// Re-export helper functions
export { generateErrorId } from './generateId';
export { categorizeError } from './categorize';
export { formatErrorForDisplay, formatStackTrace } from './format';
export { deduplicateError, hasErrorBeenReported } from './deduplication';

// For backward compatibility
export { isNetworkError, isSuceededError, isUnauthorizedError } from './helper';
