
/**
 * Tag Validation Utilities
 * 
 * Provides validation functions for tags with configurable constraints.
 * Used to ensure data quality and consistent user experience.
 */

/**
 * Result of a tag validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Configuration options for tag validation
 */
export interface TagValidationOptions {
  minTagLength?: number;
  maxTagLength?: number;
  maxNumTags?: number;
}

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: TagValidationOptions = {
  minTagLength: 2,
  maxTagLength: 30,
  maxNumTags: 20,
};

/**
 * Validates a single tag against the provided constraints
 * 
 * @param tag - The tag string to validate
 * @param options - Configuration options for validation
 * @returns Validation result with status and message
 */
export const validateTag = (
  tag: string,
  options: TagValidationOptions = DEFAULT_OPTIONS
): ValidationResult => {
  const { minTagLength = 2, maxTagLength = 30 } = options;

  if (!tag || tag.trim().length === 0) {
    return {
      isValid: false,
      message: 'Tag cannot be empty',
    };
  }

  if (tag.trim().length < minTagLength) {
    return {
      isValid: false,
      message: `Tag must be at least ${minTagLength} characters`,
    };
  }

  if (tag.trim().length > maxTagLength) {
    return {
      isValid: false,
      message: `Tag cannot exceed ${maxTagLength} characters`,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Validates an array of tags against the provided constraints
 * 
 * @param tags - Array of tags to validate
 * @param options - Configuration options for validation
 * @returns Validation result with status and message
 */
export const validateTags = (
  tags: string[],
  options: TagValidationOptions = DEFAULT_OPTIONS
): ValidationResult => {
  const { maxNumTags = 20 } = options;

  if (tags.length > maxNumTags) {
    return {
      isValid: false,
      message: `Cannot add more than ${maxNumTags} tags`,
    };
  }

  for (const tag of tags) {
    const result = validateTag(tag, options);
    if (!result.isValid) {
      return result;
    }
  }

  return {
    isValid: true,
    message: '',
  };
};
