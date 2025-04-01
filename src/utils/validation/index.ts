
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

// Export document validation
export * from './documentValidation';

// Export with explicit names for backward compatibility
export {
  createValidResult,
  createInvalidResult,
  createContentValidationResult,
  isValidResult,
  combineValidationResults
} from './types';

// Export validation functions for different entity types
export { validateContentId, isValidContentId, isUUID, isTempId } from './contentIdValidation';
export { validateDocumentTitle, validateDocumentContent, validateUrl } from './documentValidation';
