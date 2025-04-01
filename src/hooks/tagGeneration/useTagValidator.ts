
import { useCallback } from 'react';
import { ValidationResult, TagValidationResult } from '@/utils/validation/types';

/**
 * Hook for validating tags
 */
export function useTagValidator() {
  
  /**
   * Validates a single tag
   */
  const validateTag = useCallback((tag: string, options?: any): ValidationResult => {
    const opts = {
      minLength: 1,
      maxLength: 50,
      allowEmpty: false,
      ...options
    };
    
    if (!opts.allowEmpty && (!tag || tag.trim().length === 0)) {
      return {
        isValid: false,
        errorMessage: 'Tag cannot be empty',
        message: null,
        resultType: 'tag'
      };
    }
    
    if (tag.length < opts.minLength) {
      return {
        isValid: false,
        errorMessage: `Tag must be at least ${opts.minLength} characters`,
        message: null,
        resultType: 'tag'
      };
    }
    
    if (tag.length > opts.maxLength) {
      return {
        isValid: false,
        errorMessage: `Tag cannot be longer than ${opts.maxLength} characters`,
        message: null,
        resultType: 'tag'
      };
    }

    return {
      isValid: true,
      errorMessage: null,
      message: null,
      resultType: 'tag'
    };
  }, []);
  
  /**
   * Validates a tag against a list of existing tags
   */
  const validateTagUniqueness = useCallback((tag: string, existingTags: any[], options?: any): ValidationResult => {
    const opts = {
      allowDuplicates: false,
      ...options
    };
    
    if (!opts.allowDuplicates) {
      const normalizedNewTag = tag.toLowerCase().trim();
      const isDuplicate = existingTags.some(existing => 
        existing.name.toLowerCase().trim() === normalizedNewTag
      );
      
      if (isDuplicate) {
        return {
          isValid: false,
          errorMessage: 'This tag already exists',
          message: null,
          resultType: 'tag'
        };
      }
    }
    
    return {
      isValid: true,
      errorMessage: null,
      message: null,
      resultType: 'tag'
    };
  }, []);
  
  /**
   * Performs all tag validations and shows a toast on failure
   */
  const validateTagWithToast = useCallback((tag: string, existingTags: any[], options?: any): boolean => {
    // First validate the tag format
    const formatResult = validateTag(tag, options);
    if (!formatResult.isValid) {
      return false;
    }
    
    // Then check for duplicates
    const uniqueResult = validateTagUniqueness(tag, existingTags, options);
    if (!uniqueResult.isValid) {
      return false;
    }
    
    return true;
  }, [validateTag, validateTagUniqueness]);
  
  return {
    validateTag,
    validateTagUniqueness,
    validateTagWithToast
  };
}
