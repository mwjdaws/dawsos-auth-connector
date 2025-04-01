
import { useState, useCallback } from 'react';

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
  blacklist?: string[];
}

export interface TagValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export function useTagValidator() {
  const [lastValidatedTag, setLastValidatedTag] = useState<string>('');

  const validateTag = useCallback((tag: string, options: TagValidationOptions = {}): TagValidationResult => {
    setLastValidatedTag(tag);
    
    const {
      minLength = 1,
      maxLength = 50,
      required = true,
      pattern,
      blacklist = []
    } = options;
    
    // Check if tag is required but empty
    if (required && (!tag || tag.trim() === '')) {
      return { isValid: false, errorMessage: 'Tag name is required' };
    }
    
    // Check min length
    if (tag && tag.trim().length < minLength) {
      return { isValid: false, errorMessage: `Tag must be at least ${minLength} characters long` };
    }
    
    // Check max length
    if (tag && tag.trim().length > maxLength) {
      return { isValid: false, errorMessage: `Tag must be no more than ${maxLength} characters long` };
    }
    
    // Check against pattern
    if (pattern && tag && !pattern.test(tag)) {
      return { isValid: false, errorMessage: 'Tag contains invalid characters' };
    }
    
    // Check against blacklist
    if (tag && blacklist.includes(tag.toLowerCase())) {
      return { isValid: false, errorMessage: 'This tag is not allowed' };
    }
    
    return { isValid: true, errorMessage: null };
  }, []);

  return {
    validateTag,
    lastValidatedTag
  };
}

export default useTagValidator;
