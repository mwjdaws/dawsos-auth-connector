
// Re-export all validation utilities for easy access
export type { 
  ValidationResult, 
  DocumentValidationResult, 
  TagPosition, 
  TagValidationOptions,
  ContentIdValidationResult,
  ContentIdValidationResultType
} from './types';

// Export validation functions
export { validateContentId, isValidContentId, getContentIdValidationResult } from './contentIdValidation';
export { validateTag, validateTags } from './tagValidation';
export * from './documentValidation';

// Export compatibility helpers
export { 
  nullToUndefined, 
  undefinedToNull, 
  createValidationResult,
  VALIDATION_RESULTS
} from './compatibility';

// Add document title validation placeholder
export const validateDocumentTitle = (title: string): ValidationResult => {
  if (!title.trim()) {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      message: 'Title is required'
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: 'Title must be 255 characters or less',
      message: 'Title must be 255 characters or less'
    };
  }
  
  return {
    isValid: true,
    errorMessage: null,
    message: null
  };
};
