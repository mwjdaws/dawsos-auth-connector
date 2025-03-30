
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
  
  // Tag validation
  validateTag,
  validateTags,
};

// Explicitly re-export types for TypeScript modules
export type { ContentIdValidationResult, ValidationResult };
