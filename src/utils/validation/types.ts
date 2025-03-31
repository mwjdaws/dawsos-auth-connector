
/**
 * Common validation types
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  message?: string | null; // For backward compatibility
  type?: string;
}

// Export tag position interface
export interface TagPosition {
  id: string;
  position: number;
}

// Content ID validation types
export type ContentIdValidationResultType = 'valid' | 'empty' | 'invalid' | 'not-found';

export interface ContentIdValidationResult extends ValidationResult {
  type: ContentIdValidationResultType;
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

// Tag operation parameter interfaces
export interface TagOperationParams {
  tagId: string;
  contentId: string;
}

export interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string | null;
}

export interface DeleteTagParams {
  tagId: string;
  contentId: string;
}

// Document validation interfaces
export interface DocumentValidationResult extends ValidationResult {
  type?: 'title' | 'content' | 'general';
}

/**
 * Validates a document title
 * @param title The title to validate
 * @returns A validation result
 */
export function validateDocumentTitle(title: string): DocumentValidationResult {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      type: 'title'
    };
  }

  if (title.length > 255) {
    return {
      isValid: false,
      errorMessage: 'Title must be less than 255 characters',
      type: 'title'
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    type: 'title'
  };
}
