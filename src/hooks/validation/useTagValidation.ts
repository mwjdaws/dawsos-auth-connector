
/**
 * Hook for tag validation with content ID awareness
 * 
 * Provides utilities for validating tags while being aware of the content ID format,
 * supporting both UUID and temporary ID formats.
 */
import { useMemo } from 'react';
import { useContentIdValidation } from './useContentIdValidation';
import { createValidResult, createInvalidResult } from '@/utils/validation/utils';
import { validateTagName, validateTagUniqueness } from '@/utils/validation/tagValidation';
import { Tag } from '@/types/tag';

export interface TagValidationOptions {
  allowEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  disallowSpecialChars?: boolean;
  existingTags?: Tag[];
}

/**
 * Hook for validating tags with content ID awareness
 * 
 * @param contentId The ID of the content to validate tags for
 * @returns An object with tag validation utilities
 */
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
      disallowSpecialChars = true,
      existingTags
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
    
    // Check for uniqueness if existing tags are provided
    if (existingTags) {
      const uniquenessResult = validateTagUniqueness(tagName, existingTags);
      if (!uniquenessResult.isValid) {
        return uniquenessResult;
      }
    }
    
    return createValidResult();
  };

  /**
   * Check if a tag name is a duplicate in the existing tags
   */
  const isDuplicateTag = (tagName: string, existingTags: Tag[] = []): boolean => {
    const normalizedName = tagName.trim().toLowerCase();
    return existingTags.some(tag => tag.name.trim().toLowerCase() === normalizedName);
  };
  
  return {
    validateTag,
    isDuplicateTag,
    isValidContent,
    isTemporaryContent: isTemporary
  };
}

export default useTagValidation;
