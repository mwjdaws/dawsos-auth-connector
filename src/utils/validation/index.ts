
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
import { validateTag, validateTags, type ValidationResult } from './tagValidation';

// Re-export all validation utilities
export {
  // Document validation
  validateDocumentTitle,
  
  // Content ID validation
  isValidContentId,
  normalizeContentId,
  getContentIdValidationResult,
  
  // Tag validation
  validateTag,
  validateTags,
};

// Re-export types
export type { ContentIdValidationResult, ValidationResult };
