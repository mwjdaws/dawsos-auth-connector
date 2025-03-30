
/**
 * Central validation utilities for the application
 */
import { validateDocumentTitle } from './documentValidation';
import { 
  isValidContentId, 
  normalizeContentId, 
  getContentIdValidationResult, 
  type ContentIdValidationResult 
} from './contentIdValidation';
import { 
  validateTag, 
  validateTags, 
  type ValidationResult,
  type TagValidationOptions 
} from './tagValidation';

// Re-export all validation utilities
export {
  // Document validation
  validateDocumentTitle,
  
  // Content ID validation
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  
  // Tag validation functions
  validateTag,
  validateTags
};

// Use export type for TypeScript interfaces and types
export type { 
  // Content ID validation types
  ContentIdValidationResult,
  
  // Tag validation types
  ValidationResult,
  TagValidationOptions
};
