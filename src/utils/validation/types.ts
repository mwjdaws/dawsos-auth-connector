
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
  errorMessage?: string | null; // For backward compatibility
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
  maxLength?: number | null;
  minLength?: number | null;
  allowSpecialChars?: boolean | null;
}

// Type guard to ensure consistency across validation results
export function isValidationResult(value: any): value is ValidationResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.isValid === 'boolean' &&
    (value.errorMessage === null || typeof value.errorMessage === 'string')
  );
}
