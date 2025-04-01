
/**
 * Validation-related type definitions
 */

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  message?: string;
}

export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID = 'invalid',
  TEMP = 'temp',
  UUID = 'uuid',
  UNKNOWN = 'unknown'
}

export interface ContentIdValidationResult {
  isValid: boolean;
  contentExists: boolean;
  errorMessage: string | null;
  message: string | null;
  resultType: ContentIdValidationResultType;
}

export interface TagValidationResult {
  isValid: boolean;
  error?: string;
  message?: string;
  isDuplicate?: boolean;
}

export interface TagPosition {
  id: string;
  position: number;
}
