
import { useState, useCallback } from 'react';

export interface TagValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowSpecialChars?: boolean;
  allowEmpty?: boolean;
}

export interface TagValidationResult {
  isValid: boolean;
  message: string | null;
}

export const useTagValidator = (options: TagValidationOptions = {}) => {
  const {
    minLength = 2,
    maxLength = 50,
    allowSpecialChars = true,
    allowEmpty = false
  } = options;

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTag = useCallback(
    (tag: string): TagValidationResult => {
      // Trim the tag
      const trimmedTag = tag.trim();

      // Check if empty
      if (!trimmedTag && !allowEmpty) {
        const message = "Tag cannot be empty";
        setValidationError(message);
        return { isValid: false, message };
      }

      // Skip further validation if empty is allowed and the tag is empty
      if (!trimmedTag && allowEmpty) {
        setValidationError(null);
        return { isValid: true, message: null };
      }

      // Check length
      if (trimmedTag.length < minLength) {
        const message = `Tag must be at least ${minLength} characters`;
        setValidationError(message);
        return { isValid: false, message };
      }

      if (trimmedTag.length > maxLength) {
        const message = `Tag must be no more than ${maxLength} characters`;
        setValidationError(message);
        return { isValid: false, message };
      }

      // Check for special characters if not allowed
      if (!allowSpecialChars) {
        const specialCharsRegex = /[^a-zA-Z0-9 -]/;
        if (specialCharsRegex.test(trimmedTag)) {
          const message = "Tag contains special characters that are not allowed";
          setValidationError(message);
          return { isValid: false, message };
        }
      }

      // If we reach here, the tag is valid
      setValidationError(null);
      return { isValid: true, message: null };
    },
    [minLength, maxLength, allowSpecialChars, allowEmpty]
  );

  return {
    validateTag,
    validationError
  };
};

export default useTagValidator;
