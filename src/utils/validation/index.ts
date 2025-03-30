
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
import { validateTag, validateTags, ValidationResult } from './tagValidation';

// Re-export all validation utilities
export {
  // Document validation
  validateDocumentTitle,
  
  // Content ID validation
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  ContentIdValidationResult,
  
  // Tag validation
  validateTag,
  validateTags,
};

// Re-export types
export type { ValidationResult };
