
/**
 * Validation utility types
 */

// Content ID validation result type
export enum ContentIdValidationResultType {
  Valid = 'valid',
  Invalid = 'invalid',
  Missing = 'missing',
  Empty = 'empty',
  Temporary = 'temporary'
}

// Content ID validation result interface
export interface ContentIdValidationResult {
  isValid: boolean;
  result: ContentIdValidationResultType;
  message: string | null;
}

// Basic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string | null;
}
