
/**
 * Central validation utilities for the application
 * 
 * This module exports various validation utilities used throughout the application.
 * It provides a centralized place for validation logic to ensure consistency.
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

// Document validation
export { validateDocumentTitle };
  
// Content ID validation
export { 
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  ContentIdValidationResult
};
  
// Tag validation functions
export { validateTag, validateTags };

// Use export type for TypeScript interfaces and types
export type { ValidationResult, TagValidationOptions };

