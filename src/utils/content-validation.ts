
/**
 * Content validation utilities
 * Re-exports from the validation module for backward compatibility
 */

import { isValidContentId, getContentIdValidationResult, ContentIdValidationResult, ContentIdValidationResultType } from './validation/contentIdValidation';

// Re-export the validation functions
export { 
  isValidContentId, 
  getContentIdValidationResult, 
  ContentIdValidationResult, 
  ContentIdValidationResultType
};

// Legacy function name for backward compatibility
export const validateContentId = isValidContentId;
