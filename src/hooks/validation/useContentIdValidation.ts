
/**
 * Hook for content ID validation
 *
 * Provides utilities for validating and converting content IDs
 * while supporting both UUID and temporary ID formats.
 */
import { useMemo } from 'react';
import { 
  isValidContentId, 
  isTempId as isTemporaryContentId, 
  isUUID as isUuidContentId,
  tryConvertToUUID,
  isStorableContentId,
  getContentIdValidationResult
} from '@/utils/validation/contentIdValidation';

export function useContentIdValidation(contentId?: string | null) {
  const validation = useMemo(() => {
    return getContentIdValidationResult(contentId);
  }, [contentId]);

  const isValid = useMemo(() => {
    return isValidContentId(contentId);
  }, [contentId]);

  const isUuid = useMemo(() => {
    return isUuidContentId(contentId || '');
  }, [contentId]);

  const isTemporary = useMemo(() => {
    return isTemporaryContentId(contentId || '');
  }, [contentId]);

  const isStorable = useMemo(() => {
    return isStorableContentId(contentId);
  }, [contentId]);

  const convertToUuid = useMemo(() => {
    return tryConvertToUUID(contentId);
  }, [contentId]);

  return {
    isValid,
    isUuid,
    isTemporary,
    isStorable,
    convertToUuid,
    validation,
    error: validation.errorMessage
  };
}

// Default export for compatibility
export default useContentIdValidation;
