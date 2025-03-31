
/**
 * Hook for tag validation with content ID awareness
 * 
 * Provides utilities for validating tags while being aware of the content ID format,
 * supporting both UUID and temporary ID formats.
 */
import { useMemo } from 'react';
import { useContentIdValidation } from './useContentIdValidation';
import { createValidResult, createInvalidResult } from '@/utils/validation/utils';

export interface TagValidationOptions {
  allowEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  disallowSpecialChars?: boolean;
}

export function useTagValidation(contentId?: string | null) {
  // Use the content ID validation hook to get information about the content ID
  const { isValid: isValidContent, isTemporary } = useContentIdValidation(contentId);
  
  /**
   * Validate a tag name with configurable options
   */
  const validateTag = (tagName: string, options: TagValidationOptions = {}) => {
    const {
      allowEmpty = false,
      minLength = 1,
      maxLength = 50,
      disallowSpecialChars = true
    } = options;
    
    // Check for empty tag if not allowed
    if (!allowEmpty && (!tagName || tagName.trim() === '')) {
      return createInvalidResult('Tag name cannot be empty');
    }
    
    // Check for length constraints
    if (tagName.length < minLength) {
      return createInvalidResult(`Tag must be at least ${minLength} characters long`);
    }
    
    if (tagName.length > maxLength) {
      return createInvalidResult(`Tag cannot exceed ${maxLength} characters`);
    }
    
    // Check for special characters if disallowed
    if (disallowSpecialChars && /[^\w\s-]/.test(tagName)) {
      return createInvalidResult('Tag contains invalid characters. Use only letters, numbers, spaces, and hyphens.');
    }
    
    return createValidResult();
  };
  
  return {
    validateTag,
    isValidContent,
    isTemporaryContent: isTemporary
  };
}

export default useTagValidation;
