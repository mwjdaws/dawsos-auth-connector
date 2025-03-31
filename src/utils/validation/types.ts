
/**
 * Types for validation-related functions
 */

// Content ID validation
export interface ContentIdValidationResult {
  isValid: boolean;
  resultType: keyof typeof ContentIdValidationResultType;
  message: string | null;
  errorMessage?: string | null;
}

export enum ContentIdValidationResultType {
  VALID = 'valid',
  INVALID = 'invalid',
  UUID = 'uuid',
  TEMP = 'temp'
}

// Document validation
export interface DocumentValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  field?: string;
  contentExists?: boolean;
  resultType?: string;
}

export interface DocumentValidationOptions {
  titleRequired?: boolean;
  contentRequired?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  minContentLength?: number;
  maxContentLength?: number;
}

// Tag validation
export interface TagValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  allowDuplicates?: boolean;
}

// Generic validation
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message?: string | null;
}

// Errors
export interface ValidationError extends Error {
  code: string;
  field?: string;
  details?: Record<string, any>;
}

// Export type aliases for compatibility
export type ValidationOptions = DocumentValidationOptions | TagValidationOptions;
