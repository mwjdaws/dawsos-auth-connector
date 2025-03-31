
import { useState, useCallback } from 'react';
import { validateTag, validateTags } from '@/utils/validation/tagValidation';
import { TagValidationOptions } from '@/utils/validation/types';

/**
 * Hook for validating tags with proper error handling and state management
 * 
 * @returns Object containing validation functions and state
 */
export function useTagValidator() {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  /**
   * Validate a single tag text
   * 
   * @param tagText - The tag text to validate
   * @param options - Optional validation options
   * @returns Whether the tag is valid
   */
  const validateTagText = useCallback((tagText: string, options?: TagValidationOptions): boolean => {
    const result = validateTag(tagText, options);
    setValidationMessage(result.errorMessage);
    return result.isValid;
  }, []);

  /**
   * Validate a list of tags
   * 
   * @param tags - Array of tag strings to validate
   * @param options - Optional validation options
   * @returns Object with validation result and message
   */
  const validateTagList = useCallback((tags: string[], options?: TagValidationOptions): { isValid: boolean; message: string | null } => {
    // No tags is valid by default, but can be configured with options
    if (!tags || tags.length === 0) {
      if (options?.allowEmpty === false) {
        setValidationMessage("At least one tag is required");
        return { isValid: false, message: "At least one tag is required" };
      }
      return { isValid: true, message: null };
    }

    // Check each tag
    const result = validateTags(tags, options);
    setValidationMessage(result.errorMessage);
    return { isValid: result.isValid, message: result.errorMessage };
  }, []);

  /**
   * Clear any validation messages
   */
  const clearValidationMessage = useCallback(() => {
    setValidationMessage(null);
  }, []);

  return {
    validateTagText,
    validateTagList,
    validationMessage,
    clearValidationMessage
  };
}
