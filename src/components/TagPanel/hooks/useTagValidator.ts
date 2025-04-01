
import { useState, useCallback } from 'react';
import { handleError } from '@/utils/errors';
import { ErrorLevel } from '@/utils/errors/types';

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowedChars?: RegExp;
  preventDuplicates?: boolean;
  existingTags?: string[];
  allowEmpty?: boolean; // Added this option
}

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * Hook for validating tag inputs
 */
export function useTagValidator() {
  const [lastValidated, setLastValidated] = useState<string>('');
  
  const defaultOptions: TagValidationOptions = {
    minLength: 2,
    maxLength: 50,
    allowedChars: /^[\w\s\-\.]+$/,
    preventDuplicates: true,
    allowEmpty: false
  };
  
  /**
   * Validates a tag string based on common rules
   */
  const validateTag = useCallback((tag: string, options?: TagValidationOptions): ValidationResult => {
    const opts = { ...defaultOptions, ...options };
    setLastValidated(tag);
    
    // Empty check
    if (!tag || tag.trim() === '') {
      if (opts.allowEmpty) {
        return { isValid: true, message: null };
      }
      return { isValid: false, message: 'Tag cannot be empty' };
    }
    
    // Minimum length check
    if (tag.trim().length < (opts.minLength || 2)) {
      return { isValid: false, message: `Tag must be at least ${opts.minLength} characters long` };
    }
    
    // Maximum length check
    if (tag.trim().length > (opts.maxLength || 50)) {
      return { isValid: false, message: `Tag must be less than ${opts.maxLength} characters long` };
    }
    
    // Characters validation
    const invalidChars = opts.allowedChars ? !opts.allowedChars.test(tag) : false;
    if (invalidChars) {
      return { isValid: false, message: 'Tag contains invalid characters' };
    }
    
    // Duplicate check
    if (opts.preventDuplicates && opts.existingTags && opts.existingTags.includes(tag.trim())) {
      return { isValid: false, message: 'Tag already exists' };
    }
    
    return { isValid: true, message: null };
  }, []);
  
  /**
   * Validates the tag and reports errors
   */
  const validateTagWithErrorHandling = useCallback((tag: string, options?: TagValidationOptions): boolean => {
    const result = validateTag(tag, options);
    
    if (!result.isValid && result.message) {
      handleError(
        new Error(result.message),
        result.message,
        { level: ErrorLevel.Warning }
      );
      return false;
    }
    
    return true;
  }, [validateTag]);
  
  return {
    validateTag,
    validateTagWithErrorHandling,
    lastValidated
  };
}

export default useTagValidator;
