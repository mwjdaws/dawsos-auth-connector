
import { useMemo } from 'react';
import { validateTag, TagValidationOptions } from '../tagValidation';
import { TagValidationResult } from '../types';

/**
 * Custom hook for tag validation
 * 
 * @param tagName The tag name to validate
 * @param options Optional validation options
 * @returns TagValidationResult indicating validity
 */
export function useTagValidation(
  tagName: string,
  options?: Partial<TagValidationOptions>
): TagValidationResult {
  const validationResult = useMemo(() => 
    validateTag(tagName, options),
    [tagName, options]
  );
  
  return validationResult;
}

export default useTagValidation;
