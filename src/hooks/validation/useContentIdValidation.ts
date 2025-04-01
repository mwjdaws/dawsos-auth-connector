
import { useMemo } from 'react';
import { 
  validateContentId, 
  isValidContentId, 
  isUuid,
  isTempId,
  tryConvertToUUID
} from '@/utils/validation/contentIdValidation';
import { ContentIdValidationResult } from '@/utils/validation/types';

/**
 * Custom hook for content ID validation
 * 
 * @param contentId The content ID to validate
 * @param contentExists Optional flag indicating if the content exists in the database
 * @returns Object with validation result and utility functions
 */
export function useContentIdValidation(contentId: string, contentExists?: boolean) {
  // Validate the content ID
  const validationResult = useMemo<ContentIdValidationResult>(
    () => validateContentId(contentId, contentExists),
    [contentId, contentExists]
  );
  
  // Utility functions
  const validateId = (id: string, exists?: boolean) => validateContentId(id, exists);
  const checkValid = (id: string) => isValidContentId(id);
  const checkUuid = (id: string) => isUuid(id);
  const checkTempId = (id: string) => isTempId(id);
  const getUuid = (id: string) => tryConvertToUUID(id);
  
  return {
    validationResult,
    validateContentId: validateId,
    isValidContentId: checkValid,
    isUUID: checkUuid,
    isTempId: checkTempId,
    convertToUuid: getUuid
  };
}
