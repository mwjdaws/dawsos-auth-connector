
// Re-export all validation related utilities and types
import { validateDocumentTitle, validateDocumentForSave, validateDocumentForPublish } from './documentValidation';
import { validateTags, validateTag, validateTagPositions } from './tagValidation';
import { isValidContentId, getContentIdValidationResult, normalizeContentId } from './contentIdValidation';

// Export the validation functions
export { 
  validateDocumentTitle, 
  validateDocumentForSave, 
  validateDocumentForPublish,
  validateTags, 
  validateTag,
  validateTagPositions,
  isValidContentId, 
  getContentIdValidationResult, 
  normalizeContentId 
};

// Export all validation type definitions
export * from './types';

// Export all other validation utilities from their respective files
export * from './contentIdValidation';
export * from './documentValidation';
export * from './tagValidation';
