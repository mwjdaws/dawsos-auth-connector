
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/types/tag';
import { ValidationResult, createValidResult, createInvalidResult } from '@/utils/validation/types';

export interface TagValidationOptions {
  allowEmpty?: boolean;
  allowDuplicates?: boolean;
  minLength?: number;
  maxLength?: number;
}

/**
 * Hook for validating tags
 */
export function useTagValidator() {
  
  /**
   * Validates a single tag
   */
  const validateTag = (tag: string, options?: TagValidationOptions): ValidationResult => {
    const opts = {
      minLength: 1,
      maxLength: 50,
      allowEmpty: false,
      ...options
    };
    
    if (!opts.allowEmpty && (!tag || tag.trim().length === 0)) {
      return createInvalidResult('Tag cannot be empty');
    }
    
    if (tag.length < opts.minLength) {
      return createInvalidResult(`Tag must be at least ${opts.minLength} characters`);
    }
    
    if (tag.length > opts.maxLength) {
      return createInvalidResult(`Tag cannot be longer than ${opts.maxLength} characters`);
    }

    return createValidResult();
  };
  
  /**
   * Validates a tag against a list of existing tags
   */
  const validateTagUniqueness = (tag: string, existingTags: Tag[], options?: TagValidationOptions): ValidationResult => {
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
        return createInvalidResult('This tag already exists');
      }
    }
    
    return createValidResult();
  };
  
  /**
   * Performs all tag validations and shows a toast on failure
   */
  const validateTagWithToast = (tag: string, existingTags: Tag[], options?: TagValidationOptions): boolean => {
    // First validate the tag format
    const formatResult = validateTag(tag, options);
    if (!formatResult.isValid) {
      toast({
        title: "Invalid Tag",
        description: formatResult.errorMessage || "Tag is invalid",
        variant: "destructive"
      });
      return false;
    }
    
    // Then check for duplicates
    const uniqueResult = validateTagUniqueness(tag, existingTags, options);
    if (!uniqueResult.isValid) {
      toast({
        title: "Duplicate Tag",
        description: uniqueResult.errorMessage || "Tag already exists",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  return {
    validateTag,
    validateTagUniqueness,
    validateTagWithToast
  };
}
