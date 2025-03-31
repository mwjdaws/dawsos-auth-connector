
// Import and re-export validation functions for easier imports
export { validateTag, validateTags, isValidTag, areValidTags } from './tagValidation';
export { isValidContentId, getContentIdValidationResult } from './contentIdValidation';
export { 
  createValidationResult, 
  VALIDATION_RESULTS 
} from './types';

// Re-export compatibility helpers
export {
  createBooleanValidationResult,
  ensureNumber,
  ensureString,
  nullToUndefined,
  undefinedToNull,
  ensureBoolean,
  createSafeCallback,
  ensureObject
} from './compatibility';

// Export type definitions
export type { 
  ValidationResult, 
  ContentIdValidationResult,
  DocumentValidationResult,
  TagValidationOptions, 
  DocumentValidationOptions,
  TagPosition
} from './types';
export { ContentIdValidationResultType } from './types';

// Legacy validation compatibility
export const validateContent = (content: string): ValidationResult => {
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: "Content cannot be empty"
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
};

// Document title validation
export const validateDocumentTitle = (title: string): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: "Title cannot be empty"
    };
  }
  
  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: "Title cannot exceed 255 characters"
    };
  }
  
  return {
    isValid: true,
    errorMessage: null
  };
};
