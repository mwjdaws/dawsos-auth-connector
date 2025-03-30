
/**
 * Document validation utilities
 */
import { ValidationResult } from './types';

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 120;

/**
 * Validates a document title
 * @param title The title to validate
 * @returns A validation result
 */
export function validateDocumentTitle(title: string): ValidationResult {
  // Check if title is empty
  if (!title.trim()) {
    return {
      isValid: false,
      errorMessage: 'Title is required',
      message: 'Title is required' // For backward compatibility
    };
  }

  // Check if title is too short
  if (title.trim().length < MIN_TITLE_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Title must be at least ${MIN_TITLE_LENGTH} characters`,
      message: `Title must be at least ${MIN_TITLE_LENGTH} characters` // For backward compatibility
    };
  }

  // Check if title is too long
  if (title.trim().length > MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Title must be no more than ${MAX_TITLE_LENGTH} characters`,
      message: `Title must be no more than ${MAX_TITLE_LENGTH} characters` // For backward compatibility
    };
  }

  // Title is valid
  return {
    isValid: true,
    errorMessage: null,
    message: null // For backward compatibility
  };
}
