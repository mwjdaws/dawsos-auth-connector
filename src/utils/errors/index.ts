
/**
 * Error handling utilities
 * 
 * Central export point for all error-related functionality.
 */

// Export types
export * from './types';

// Export main utilities
export { 
  handleError,
  handleErrorSafe,
  createErrorHandler,
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler
} from './handle';

// Export compatibility utils
export { convertErrorOptions, compatibleErrorOptions } from './compatibility';
export type { LegacyErrorHandlingOptions } from './compatibility';

// Export format utilities
export { 
  formatErrorMessage,
  formatTechnicalError,
  getUserFriendlyMessage
} from './format';

// Export deduplication utilities 
export {
  isErrorDuplicate,
  storeErrorFingerprint,
  generateFingerprint,
  clearSeenErrors
} from './deduplication';

// Export ID generation utilities
export {
  generateErrorId,
  generateErrorFingerprint,
  generateShortId
} from './generateId';

// Export categorization utilities
export { categorizeError } from './categorize';
