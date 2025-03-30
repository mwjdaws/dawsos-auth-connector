
/**
 * Common validation types
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message?: string | null; // For backward compatibility
}

// Export tag position interface
export interface TagPosition {
  id: string;
  position: number;
}

// Content ID validation types
export type ContentIdValidationResultType = 'valid' | 'empty' | 'invalid' | 'not-found';

export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  type: ContentIdValidationResultType;
}

// Tag validation options
export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowSpecialChars?: boolean;
  required?: boolean;
  uniqueInList?: string[];
  allowEmpty?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  pattern?: RegExp;
}
