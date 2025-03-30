
/**
 * Central validation utilities for the application
 */
import { validateDocumentTitle } from './documentValidation';
import { 
  isValidContentId, 
  normalizeContentId, 
  getContentIdValidationResult, 
  ContentIdValidationResult 
} from './contentIdValidation';
import { 
  validateTag, 
  validateTags,
  ValidationResult,
  TagValidationOptions 
} from './tagValidation';

// Re-export all validation utilities
export {
  // Document validation
  validateDocumentTitle,
  
  // Content ID validation
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  ContentIdValidationResult,
  
  // Tag validation functions
  validateTag,
  validateTags
};

// Use export type for TypeScript interfaces and types
export type { 
  // Tag validation types
  ValidationResult,
  TagValidationOptions
};
