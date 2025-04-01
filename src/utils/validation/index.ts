
/**
 * Validation utilities
 * 
 * Central export point for all validation-related utilities
 */

// Export type definitions
export * from './types';

// Export utility functions
export * from './utils';

// Export content ID validation
export * from './contentIdValidation';

// For backward compatibility
export {
  createValidResult,
  createInvalidResult,
  createContentValidationResult,
  isValidResult,
  combineValidationResults
} from './utils';

// Export validation functions for different entity types
export { validateContentId, isValidContentId, isUUID, isTempId } from './contentIdValidation';
