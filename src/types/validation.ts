
/**
 * Validation-related type definitions
 */

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  message?: string;
}

export interface ContentIdValidationResult {
  isValid: boolean;
  contentExists: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: ContentIdValidationResultType;
}

export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID = 'invalid',
  TEMP = 'temp',
  UUID = 'uuid',
  UNKNOWN = 'unknown'
}

export interface TagValidationResult {
  isValid: boolean;
  error?: string;
  message?: string;
}
