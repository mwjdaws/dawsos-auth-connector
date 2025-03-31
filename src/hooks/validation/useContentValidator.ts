
/**
 * Hook for enhanced content validation
 * 
 * Combines content ID validation with content existence check
 */
import { useState, useEffect } from 'react';
import { useValidateContentId } from './useValidateContentId';
import { useContentExists } from '@/hooks/metadata/useContentExists';

/**
 * Enhanced content validation hook
 * 
 * @param contentId Content ID to validate
 * @returns Object with validation and existence information
 */
export function useContentValidator(contentId?: string | null) {
  const [isValidating, setIsValidating] = useState(false);
  
  // Basic content ID validation
  const {
    isValid,
    isTemporary,
    isUuid,
    validationResult,
    errorMessage
  } = useValidateContentId(contentId);
  
  // Check if content exists in the database (only for UUID content IDs)
  const {
    exists: contentExists,
    isLoading: isCheckingExistence,
    error: existenceError
  } = useContentExists(contentId, {
    enabled: isValid && isUuid, // Only check existence for valid UUIDs
    retry: 1, // Limit retries to avoid excessive database queries
  });
  
  // Set validating state when checking existence
  useEffect(() => {
    setIsValidating(isCheckingExistence);
  }, [isCheckingExistence]);
  
  // For temporary IDs, we don't check existence
  const exists = isTemporary ? true : contentExists;
  
  return {
    // Base validation properties
    isValid,
    isTemporary,
    isUuid,
    validationResult,
    errorMessage,
    
    // Existence check properties
    contentExists: exists,
    isValidating,
    existenceError
  };
}

// Default export
export default useContentValidator;
