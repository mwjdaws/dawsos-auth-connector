
/**
 * Error handling system
 *
 * This module provides a comprehensive error handling system for the application.
 * It includes:
 *
 * - Centralized error handling through the handleError function
 * - Error level categorization (Debug, Info, Warning, Error, Critical)
 * - Error source tracking (Component, API, Database, etc.)
 * - Error deduplication to prevent flooding users with identical errors
 * - Consistent error reporting through toast notifications
 * - Error analytics and tracking
 */

// Core error handling function - export both as default and named
import handleErrorDefault, { 
  handleError, 
  createComponentErrorHandler, 
  createHookErrorHandler, 
  createServiceErrorHandler,
  createErrorHandler
} from './handle';

// Export default handler
export default handleErrorDefault;

// Named exports
export { 
  handleError,
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler,
  createErrorHandler
};

// Error handling utilities
export { generateFingerprint, cleanupFingerprintCache } from './deduplication';
export { formatErrorForLogging, formatErrorForUser } from './formatter';
export { isErrorIgnored, isErrorLevelMet, ignoreError, unignoreError, setMinimumErrorLevel } from './filtering';
export { trackError, getDuplicateCount, hasSeenError, resetErrorTracking } from './tracking';

// Error handling compatibility layer
export {
  legacyHandleError,
  handleErrorWithMessage,
  createContextualError,
  convertErrorOptions
} from './compatibility';

// Type definitions
export * from './types';
