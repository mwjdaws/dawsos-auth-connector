
/**
 * Hook for validating content IDs in different contexts
 * 
 * This hook provides validation utilities specifically for content IDs,
 * with appropriate error handling and user feedback.
 */
import { useState, useEffect } from 'react';
import { useContentIdValidation } from './useContentIdValidation';
import { toast } from 'sonner';

interface ValidateContentIdOptions {
  showToasts?: boolean;
  validateExists?: boolean;
  allowTemporary?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function useValidateContentId(
  contentId: string | undefined | null,
  options: ValidateContentIdOptions = {}
) {
  const {
    showToasts = true,
    validateExists = false,
    allowTemporary = true,
    onValidationChange
  } = options;

  // Use the base content ID validation hook
  const {
    isValid,
    isUuid,
    isTemporary,
    isStorable,
    error,
    validation
  } = useContentIdValidation(contentId);

  const [hasDisplayedWarning, setHasDisplayedWarning] = useState(false);

  // Handle validation effects
  useEffect(() => {
    // Call the onValidationChange callback if provided
    if (onValidationChange) {
      onValidationChange(isValid);
    }

    // Show toast notifications if enabled and there's an error
    if (showToasts) {
      if (!isValid && contentId) {
        toast.error(`Invalid content ID: ${error}`, {
          id: `content-id-error-${contentId}`,
        });
      } else if (isTemporary && !allowTemporary && !hasDisplayedWarning) {
        toast.warning('Using a temporary content ID. Some features may be limited.', {
          id: `temp-content-id-warning-${contentId}`,
          duration: 4000,
        });
        setHasDisplayedWarning(true);
      }
    }
  }, [contentId, isValid, isTemporary, allowTemporary, showToasts, error, hasDisplayedWarning, onValidationChange]);

  return {
    isValid,
    isUuid,
    isTemporary,
    isStorable,
    error,
    validation,
    formattedMessage: isValid 
      ? isTemporary 
        ? 'Using temporary ID'
        : 'Valid content ID'
      : `Invalid content ID: ${error}`
  };
}

export default useValidateContentId;
