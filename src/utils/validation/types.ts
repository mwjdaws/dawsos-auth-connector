
/**
 * Types for validation utilities
 */

// Generic validation result
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

// Create a valid result helper
export function createValidResult(): ValidationResult {
  return {
    isValid: true,
    errorMessage: null
  };
}

// Create an invalid result helper
export function createInvalidResult(message: string): ValidationResult {
  return {
    isValid: false,
    errorMessage: message
  };
}

// Content ID validation types
export interface ContentIdValidationResult {
  isValid: boolean;
  isTemp: boolean;
  isUuid: boolean;
  errorMessage: string | null;
}

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
}

// Document validation options
export interface DocumentValidationOptions {
  requireTitle?: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  requireContent?: boolean;
  minContentLength?: number;
}

// Document validation result
export interface DocumentValidationResult extends ValidationResult {
  // Additional fields can be added for specific document validation
}

// Tag validation options
export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowSpecialChars?: boolean;
  allowDuplicates?: boolean;
}

// Tag validation result
export interface TagValidationResult extends ValidationResult {
  // Additional fields can be added for specific tag validation
}

// Error types for validation
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// API error
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Content ID validation result types
export enum ContentIdValidationResultType {
  VALID_UUID = 'VALID_UUID',
  VALID_TEMP = 'VALID_TEMP',
  INVALID_FORMAT = 'INVALID_FORMAT',
  EMPTY = 'EMPTY'
}
