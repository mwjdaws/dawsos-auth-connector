
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
import { validateTag, validateTags, type TagValidationOptions } from './tagValidation';
import type { ValidationResult } from './tagValidation';

// Re-export all validation utilities
export {
  // Document validation
  validateDocumentTitle,
  
  // Content ID validation
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
};

// Use export type for TypeScript interfaces and types
export type { 
  // Content ID validation types
  ContentIdValidationResult,
  
  // Tag validation types
  ValidationResult,
  TagValidationOptions
};

// Re-export function implementations
export { validateTag, validateTags };
