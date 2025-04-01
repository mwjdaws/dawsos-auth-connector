
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  disallowSpecialChars?: boolean;
}

export interface TagValidationResult {
  isValid: boolean;
  message: string | null;
}

/**
 * A hook for validating tag names
 */
export function useTagValidator() {
  const [validationResult, setValidationResult] = useState<TagValidationResult | null>(null);

  /**
   * Validates a tag name
   */
  const validateTag = useCallback((
    tagName: string,
    options: TagValidationOptions = {}
  ): TagValidationResult => {
    const {
      minLength = 1,
      maxLength = 50,
      disallowSpecialChars = true
    } = options;

    // Check if tag is empty
    if (!tagName || tagName.trim() === '') {
      const result = { 
        isValid: false, 
        message: 'Tag name cannot be empty' 
      };
      setValidationResult(result);
      return result;
    }

    // Check length constraints
    if (tagName.length < minLength) {
      const result = {
        isValid: false,
        message: `Tag must be at least ${minLength} characters long`
      };
      setValidationResult(result);
      return result;
    }

    if (tagName.length > maxLength) {
      const result = {
        isValid: false,
        message: `Tag cannot exceed ${maxLength} characters`
      };
      setValidationResult(result);
      return result;
    }

    // Check for special characters if disallowed
    if (disallowSpecialChars && /[^\w\s-]/.test(tagName)) {
      const result = {
        isValid: false,
        message: 'Tag contains invalid characters. Use only letters, numbers, spaces, and hyphens.'
      };
      setValidationResult(result);
      return result;
    }

    const result = { isValid: true, message: null };
    setValidationResult(result);
    return result;
  }, []);

  /**
   * Reset validation result
   */
  const resetValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  /**
   * Show validation error as toast
   */
  const showValidationError = useCallback(() => {
    if (validationResult && !validationResult.isValid && validationResult.message) {
      toast({
        title: "Tag Validation Error",
        description: validationResult.message,
        variant: "destructive"
      });
    }
  }, [validationResult]);

  return {
    validateTag,
    validationResult,
    resetValidation,
    showValidationError
  };
}
