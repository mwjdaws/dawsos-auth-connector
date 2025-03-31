
/**
 * Hook for tag validation
 * 
 * Provides validation utilities for tags with appropriate error messages
 * and checking for duplicate tags.
 */
import { useMemo } from 'react';
import { validateTag, validateTagName, validateTagUniqueness } from '@/utils/validation/tagValidation';
import { ValidationResult } from '@/utils/validation/types';
import { Tag } from '@/types/tag';

interface UseTagValidationOptions {
  contentId?: string | null;
  existingTags?: Tag[];
}

export function useTagValidation(contentId?: string | null, options: UseTagValidationOptions = {}) {
  const { existingTags = [] } = options;
  
  // Validate a tag with all rules
  const validateTagWithContext = useMemo(() => {
    return (tagName: string, opts: { checkDuplicates?: boolean } = {}) => {
      const { checkDuplicates = true } = opts;
      
      // First validate the tag name format
      const nameValidation = validateTagName(tagName);
      if (!nameValidation.isValid) {
        return nameValidation;
      }
      
      // Then check for duplicates if requested
      if (checkDuplicates) {
        const uniquenessValidation = validateTagUniqueness(tagName, existingTags);
        if (!uniquenessValidation.isValid) {
          return uniquenessValidation;
        }
      }
      
      return {
        isValid: true,
        message: 'Valid tag',
        errorMessage: null
      } as ValidationResult;
    };
  }, [existingTags]);
  
  // Check if a tag is a duplicate
  const isDuplicateTag = useMemo(() => {
    return (tagName: string): boolean => {
      const normalizedName = tagName.trim().toLowerCase();
      return existingTags.some(tag => tag.name.trim().toLowerCase() === normalizedName);
    };
  }, [existingTags]);
  
  return {
    validateTag: validateTagWithContext,
    isDuplicateTag,
    hasExistingTags: existingTags.length > 0
  };
}

export default useTagValidation;
