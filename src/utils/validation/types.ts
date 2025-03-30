
/**
 * Standard validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  errorCode?: string | null;
  errorMessage?: string | null; // Added for backward compatibility
}

/**
 * Extended validation result with additional details
 */
export interface ExtendedValidationResult extends ValidationResult {
  details?: Record<string, any> | null;
}

/**
 * Content ID validation result type enum
 */
export enum ContentIdValidationResultType {
  VALID = 'valid',
  TEMPORARY = 'temporary',
  MISSING = 'missing',
  INVALID = 'invalid'
}

/**
 * Content ID validation result
 */
export interface ContentIdValidationResult {
  isValid: boolean;
  message: string | null;
  resultType: ContentIdValidationResultType;
}

/**
 * Tag validation options
 */
export interface TagValidationOptions {
  allowEmpty?: boolean;
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Generic tag interface with nullable fields for database compatibility
 */
export interface TagBase {
  id: string;
  name: string;
  content_id: string | null;
  type_id: string | null;
  type_name?: string | null;
}

/**
 * Tag interface for UI components
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
}

/**
 * Legacy compatibility bridge for Tag types
 * @deprecated Use Tag or TagBase directly
 */
export type TagCompatible = Tag | TagBase;
