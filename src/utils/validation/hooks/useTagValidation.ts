
import { useMemo } from 'react';
import { validateTag } from '../tagValidation';
import { TagValidationResult } from '../types';

/**
 * Custom hook for tag validation
 * 
 * @param tagName The tag name to validate
 * @returns TagValidationResult indicating validity
 */
export function useTagValidation(tagName: string): TagValidationResult {
  const validationResult = useMemo(() => 
    validateTag(tagName),
    [tagName]
  );
  
  return validationResult;
}
