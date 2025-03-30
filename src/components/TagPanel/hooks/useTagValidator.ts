
import { useState, useCallback } from "react";
import { handleError } from "@/utils/error-handling";
import { ValidationError } from "@/utils/errors/types";

/**
 * Hook that provides tag validation functionality
 * 
 * Features:
 * - Validates tags format and content
 * - Tracks validation errors
 * - Provides user-friendly error messages
 * - Uses centralized error handling
 * 
 * @returns Object with validation functions and error state
 */
export function useTagValidator() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Validates an array of tags against common format requirements
   * 
   * @param tags - Array of tag strings to validate
   * @returns boolean indicating if tags are valid
   */
  const validateTags = useCallback((tags: string[]): boolean => {
    // Check for empty tags array
    if (!tags?.length) {
      handleError(
        new ValidationError("No tags provided"),
        "No tags to save"
      );
      setValidationErrors(["No tags provided"]);
      return false;
    }
    
    // Validate individual tags more efficiently with a Set to track invalid tags
    const invalidTags = new Set<string>();
    for (const tag of tags) {
      if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        invalidTags.add(tag || 'empty');
      }
    }
    
    // Report validation errors if any invalid tags were found
    if (invalidTags.size > 0) {
      const errorMessage = `Found ${invalidTags.size} invalid tags`;
      handleError(
        new ValidationError(errorMessage),
        "Some tags are invalid and cannot be saved"
      );
      setValidationErrors([errorMessage]);
      return false;
    }
    
    // All tags are valid
    setValidationErrors([]);
    return true;
  }, []);

  return { 
    validateTags, 
    validationErrors,
    clearValidationErrors: () => setValidationErrors([])
  };
}
