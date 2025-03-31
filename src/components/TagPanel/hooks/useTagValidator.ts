
import { useState, useCallback } from 'react';
import { validateTag } from '@/utils/validation/tagValidation';
import { TagValidationOptions } from '@/utils/validation/types';

export function useTagValidator() {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Validate a single tag text
  const validateTagText = useCallback((tagText: string, options?: TagValidationOptions) => {
    const result = validateTag(tagText, options);
    setValidationMessage(result.errorMessage);
    return result.isValid;
  }, []);

  // Validate a list of tags
  const validateTagList = useCallback((tags: string[], options?: TagValidationOptions) => {
    // No tags is valid by default, but can be configured with options
    if (!tags || tags.length === 0) {
      if (options?.allowEmpty === false) {
        setValidationMessage("At least one tag is required");
        return { isValid: false, message: "At least one tag is required" };
      }
      return { isValid: true, message: null };
    }

    // Check each tag
    for (const tag of tags) {
      const result = validateTag(tag, options);
      if (!result.isValid) {
        setValidationMessage(result.errorMessage);
        return { isValid: false, message: result.errorMessage };
      }
    }

    return { isValid: true, message: null };
  }, []);

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
