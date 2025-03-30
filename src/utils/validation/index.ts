
// Re-export all validation related utilities and types
import { validateDocumentTitle } from './documentValidation';
import { validateTags } from './tagValidation';
import { isValidContentId } from './contentIdValidation';

// Export the validation functions
export { validateDocumentTitle, validateTags, isValidContentId };

// Export the validation result types
export type ValidationResult = {
  isValid: boolean;
  message: string | null;
};

// Define tag validation options
export interface TagValidationOptions {
  allowEmpty?: boolean;
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
}

// Define content ID validation result
export interface ContentIdValidationResult {
  isValid: boolean;
  message: string | null;
}

// Export all other validation utilities from their respective files
export * from './contentIdValidation';
export * from './documentValidation';
export * from './tagValidation';
export * from './types';
