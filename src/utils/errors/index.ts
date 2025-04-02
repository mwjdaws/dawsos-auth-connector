
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

// Core error handling function
export { handleError } from './handle';
export { default as handleError } from './handle';

// Error handling utilities
export { generateFingerprint, cleanupFingerprintCache } from './deduplication';
export { formatErrorForLogging, formatErrorForUser } from './formatter';
export { isErrorIgnored, ignoreError, unignoreError, setMinimumErrorLevel } from './filtering';
export { trackError, getDuplicateCount, hasSeenError, resetErrorTracking } from './tracking';

// Type definitions
export * from './types';

// Error compatibility layer for legacy code
export * from './compatibility';
