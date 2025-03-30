
import { ValidationResult, TagValidationOptions, TagPosition } from './types';

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: TagValidationOptions = {
  allowEmpty: false,
  maxTags: 50,
  minLength: 1,
  maxLength: 100
};

/**
 * Validates a single tag
 * @param tag The tag to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateTag(tag: string, options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!tag || tag.trim() === '') {
    return {
      isValid: false,
      message: "Tag cannot be empty",
      errorCode: "TAG_EMPTY",
      errorMessage: "Tag cannot be empty"
    };
  }

  if (tag.length < (opts.minLength || 1)) {
    return {
      isValid: false,
      message: `Tag must be at least ${opts.minLength} characters`,
      errorCode: "TAG_TOO_SHORT",
      errorMessage: `Tag must be at least ${opts.minLength} characters`
    };
  }

  if (tag.length > (opts.maxLength || 100)) {
    return {
      isValid: false,
      message: `Tag cannot exceed ${opts.maxLength} characters`,
      errorCode: "TAG_TOO_LONG",
      errorMessage: `Tag cannot exceed ${opts.maxLength} characters`
    };
  }

  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}

/**
 * Validates a list of tags
 * @param tags The tags to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateTags(tags: string[], options?: TagValidationOptions): ValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!tags || !Array.isArray(tags)) {
    return {
      isValid: false,
      message: "Tags must be provided as an array",
      errorCode: "TAGS_INVALID_FORMAT",
      errorMessage: "Tags must be provided as an array"
    };
  }

  if (tags.length === 0 && !opts.allowEmpty) {
    return {
      isValid: false,
      message: "At least one tag must be provided",
      errorCode: "TAGS_EMPTY",
      errorMessage: "At least one tag must be provided"
    };
  }

  if (opts.maxTags && tags.length > opts.maxTags) {
    return {
      isValid: false,
      message: `Cannot have more than ${opts.maxTags} tags`,
      errorCode: "TAGS_EXCEED_MAX",
      errorMessage: `Cannot have more than ${opts.maxTags} tags`
    };
  }

  // Validate each tag
  for (const tag of tags) {
    const tagValidation = validateTag(tag, opts);
    if (!tagValidation.isValid) {
      return tagValidation;
    }
  }

  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}

/**
 * Validates tag positions for reordering
 * @param positions Tag positions array
 * @returns Validation result
 */
export function validateTagPositions(positions: TagPosition[]): ValidationResult {
  if (!positions || !Array.isArray(positions)) {
    return {
      isValid: false,
      message: "Tag positions must be provided as an array",
      errorCode: "TAG_POSITIONS_INVALID_FORMAT",
      errorMessage: "Tag positions must be provided as an array"
    };
  }

  const uniqueIds = new Set<string>();
  const uniquePositions = new Set<number>();

  for (const pos of positions) {
    if (!pos.id) {
      return {
        isValid: false,
        message: "Each tag position must have an ID",
        errorCode: "TAG_POSITION_MISSING_ID",
        errorMessage: "Each tag position must have an ID"
      };
    }

    if (typeof pos.position !== 'number' || pos.position < 0) {
      return {
        isValid: false,
        message: "Position must be a non-negative number",
        errorCode: "TAG_POSITION_INVALID",
        errorMessage: "Position must be a non-negative number"
      };
    }

    uniqueIds.add(pos.id);
    uniquePositions.add(pos.position);
  }

  if (uniqueIds.size !== positions.length) {
    return {
      isValid: false,
      message: "Tag IDs must be unique",
      errorCode: "TAG_POSITION_DUPLICATE_ID",
      errorMessage: "Tag IDs must be unique"
    };
  }

  return {
    isValid: true,
    message: null,
    errorCode: null,
    errorMessage: null
  };
}
