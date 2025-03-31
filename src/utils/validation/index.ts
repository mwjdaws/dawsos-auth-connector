
// Re-export all validation utilities for easy access
export { validateContentId, isValidContentId, getContentIdValidationResult } from './contentIdValidation';
export { validateTags } from './tagValidation';
export * from './documentValidation';

// Export all types
export type { 
  ValidationResult, 
  DocumentValidationResult, 
  TagPosition, 
  TagValidationOptions,
  ContentIdValidationResult,
  ContentIdValidationResultType
} from './types';

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
