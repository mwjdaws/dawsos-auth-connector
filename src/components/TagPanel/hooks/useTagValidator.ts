
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/hooks/metadata/useTagsQuery';

export interface TagValidationOptions {
  allowEmpty?: boolean;
  allowDuplicates?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
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
      return {
        isValid: false,
        message: 'Tag cannot be empty'
      };
    }
    
    if (tag.length < opts.minLength) {
      return {
        isValid: false,
        message: `Tag must be at least ${opts.minLength} characters`
      };
    }
    
    if (tag.length > opts.maxLength) {
      return {
        isValid: false,
        message: `Tag cannot be longer than ${opts.maxLength} characters`
      };
    }

    return {
      isValid: true,
      message: null
    };
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
        return {
          isValid: false,
          message: 'This tag already exists'
        };
      }
    }
    
    return {
      isValid: true,
      message: null
    };
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
        description: formatResult.message,
        variant: "destructive"
      });
      return false;
    }
    
    // Then validate uniqueness
    const uniquenessResult = validateTagUniqueness(tag, existingTags, options);
    if (!uniquenessResult.isValid) {
      toast({
        title: "Duplicate Tag",
        description: uniquenessResult.message,
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
