
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
  validateTags
};

// Also re-export types explicitly for TypeScript modules
export type { ValidationResult };
