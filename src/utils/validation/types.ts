
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
  message?: string | null; // Added for backwards compatibility
}

export interface DocumentValidationResult extends ValidationResult {
  isPublishable: boolean;
}

export interface TagPosition {
  id: string;
  position: number;
}

export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowSpecialChars?: boolean;
}
