
import { validateTags } from '@/utils/validation/tagValidation';
import type { ValidationResult, TagValidationOptions } from '@/utils/validation/types';

/**
 * Hook for tag validation functions
 */
export const useTagValidator = () => {
  /**
   * Validate an array of tags
   * @param tags Array of tag strings to validate
   * @param options Optional validation options
   * @returns Validation result with status and message
   */
  const validateTagList = (tags: string[], options?: TagValidationOptions): ValidationResult => {
    return validateTags(tags, options);
  };

  /**
   * Validate a single tag
   * @param tag Tag string to validate
   * @param options Optional validation options
   * @returns Validation result with status and message
   */
  const validateTag = (tag: string, options?: TagValidationOptions): ValidationResult => {
    return validateTags([tag], {
      ...options, 
      allowEmpty: false,
      maxTags: 1
    });
  };

  return {
    validateTagList,
    validateTag
  };
};

export default useTagValidator;
