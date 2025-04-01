
/**
 * Validation-related type definitions
 */

// Basic validation result interface
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message?: string | null;
  contentExists?: boolean;
}

// Content validation result
export interface ContentValidationResult extends ValidationResult {
  contentId: string;
  contentExists: boolean;
  contentType?: string | undefined;
}

// Document validation options
export interface DocumentValidationOptions {
  minLength?: number;
  maxLength?: number;
  contentRequired?: boolean;
  allowEmpty?: boolean;
  requireTitle?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  requireContent?: boolean;
  minContentLength?: number;
}

// Tag validation options
export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  allowDuplicates?: boolean;
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  tagExists?: boolean;
  isDuplicate?: boolean;
  isReserved?: boolean;
}

// Tag position type for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Define ContentId validation result type enum
export enum ContentIdValidationResultType {
  VALID = 'VALID',
  INVALID_FORMAT = 'INVALID_FORMAT',
  EMPTY = 'EMPTY',
  TOO_LONG = 'TOO_LONG',
  TEMPORARY = 'TEMPORARY',
  UUID = 'UUID'
}

// Define ContentId validation result interface
export interface ContentIdValidationResult {
  isValid: boolean;
  contentExists: boolean;
  resultType: ContentIdValidationResultType;
  errorMessage: string | null;
  message?: string | null;
  isTemporary?: boolean;
  isUuid?: boolean;
}
