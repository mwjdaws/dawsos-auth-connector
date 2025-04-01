
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
  createErrorHandler,
  createComponentErrorHandler,
  createHookErrorHandler,
  createServiceErrorHandler
} from '@/utils/error-handling';

// Export compatibility utils
export { convertErrorOptions } from '@/utils/compatibility';

// For backward compatibility 
export * from './categorize';
export * from './handle';
export * from './wrappers';
