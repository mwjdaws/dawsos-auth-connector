
/**
 * Type compatibility layer for backward compatibility
 */
import { ErrorHandlingOptions } from './errors/types';

// Backward compatibility for old error handling API
export interface ErrorHandlingCompatOptions extends ErrorHandlingOptions {
  // Add any legacy options here
  level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  preventDuplicate?: boolean;
  action?: () => void; // Added for compatibility with old error handlers
}

// Validate content ID options
export interface ContentIdValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  type: ContentIdValidationResultType;
}

export type ContentIdValidationResultType = 'valid' | 'empty' | 'invalid' | 'not-found';

// Tag position for reordering
export interface TagPosition {
  id: string;
  position: number;
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

// Ensure string values
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

// Ensure numeric values
export function ensureNumber(value: number | null | undefined): number {
  return typeof value === 'number' ? value : 0;
}

// Ensure boolean values
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return !!value;
}

// Convert null to undefined
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

// Convert undefined to null
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}
