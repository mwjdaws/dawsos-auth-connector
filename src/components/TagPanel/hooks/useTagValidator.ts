
import { useState } from 'react';
import { ValidationResult } from '@/utils/validation/tagValidation';

// Define tag validation options
export interface TagValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowDuplicates?: boolean;
  allowSpaces?: boolean;
  blockedChars?: string[];
}

/**
 * Hook for validating tags
 * Provides a convenient way to validate tags with customizable options
 */
export function useTagValidator() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: null
  });

  const validateTags = (tags: string[], options?: TagValidationOptions): boolean => {
    // Basic validation for tag array
    if (!Array.isArray(tags)) {
      setValidationResult({
        isValid: false,
        message: "Tags must be an array"
      });
      return false;
    }
    
    // Check for duplicates unless explicitly allowed
    if (options?.allowDuplicates !== true) {
      const uniqueTags = new Set(tags.map(tag => tag.toLowerCase().trim()));
      if (uniqueTags.size !== tags.length) {
        setValidationResult({
          isValid: false,
          message: "Duplicate tags are not allowed"
        });
        return false;
      }
    }
    
    // Validate each tag individually
    for (const tag of tags) {
      const result = validateTag(tag, options);
      if (!result.isValid) {
        setValidationResult(result);
        return false;
      }
    }
    
    setValidationResult({
      isValid: true,
      message: null
    });
    return true;
  };
  
  const validateTag = (tag: string, options?: TagValidationOptions): ValidationResult => {
    if (!tag || typeof tag !== 'string') {
      return {
        isValid: false,
        message: "Tag is required"
      };
    }
    
    const trimmedTag = tag.trim();
    const opts = {
      maxLength: options?.maxLength || 50,
      minLength: options?.minLength || 1,
      allowSpaces: options?.allowSpaces || false,
      blockedChars: options?.blockedChars || ['#', '%', '&', '{', '}', '\\', '<', '>', '*', '?', '/', '$', '!', "'", '"', ':', '@']
    };
    
    if (trimmedTag.length < opts.minLength) {
      return {
        isValid: false,
        message: `Tag must be at least ${opts.minLength} character${opts.minLength !== 1 ? 's' : ''} long`
      };
    }
    
    if (trimmedTag.length > opts.maxLength) {
      return {
        isValid: false,
        message: `Tag must be no more than ${opts.maxLength} characters long`
      };
    }
    
    if (!opts.allowSpaces && trimmedTag.includes(' ')) {
      return {
        isValid: false,
        message: "Tag cannot contain spaces"
      };
    }
    
    for (const char of opts.blockedChars) {
      if (trimmedTag.includes(char)) {
        return {
          isValid: false,
          message: `Tag cannot contain the character '${char}'`
        };
      }
    }
    
    return {
      isValid: true,
      message: null
    };
  };

  const resetValidation = () => {
    setValidationResult({
      isValid: true,
      message: null
    });
  };

  return {
    validate: validateTags,
    validateTag,
    resetValidation,
    validationResult,
    isValid: validationResult.isValid,
    errorMessage: validationResult.message
  };
}
