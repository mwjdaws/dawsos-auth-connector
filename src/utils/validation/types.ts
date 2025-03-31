
/**
 * Type definitions for validation utilities
 */

export enum ContentIdValidationResultType {
  UUID = 'uuid',
  TEMP = 'temp',
  STRING = 'string',
  INVALID = 'invalid'
}

export interface ContentIdValidationResult {
  type: ContentIdValidationResultType;
  isValid: boolean;
  message: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}
