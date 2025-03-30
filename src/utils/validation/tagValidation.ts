
import { ValidationResult, TagValidationOptions } from './types';

/**
 * Tag validation utility
 */
class TagValidator {
  /**
   * Validates a single tag
   */
  validateTag(tag: string, options: TagValidationOptions = {}): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      message: null
    };
    
    // Minimum length check
    const minLength = options.minLength || 2;
    if (tag.length < minLength) {
      result.isValid = false;
      result.message = `Tag must be at least ${minLength} characters`;
      result.errorMessage = result.message; // For backward compatibility
      return result;
    }
    
    // Maximum length check
    const maxLength = options.maxLength || 50;
    if (tag.length > maxLength) {
      result.isValid = false;
      result.message = `Tag cannot exceed ${maxLength} characters`;
      result.errorMessage = result.message; // For backward compatibility
      return result;
    }
    
    // Success
    return result;
  }
  
  /**
   * Validates a list of tags
   */
  validateTagList(tags: string[], options: TagValidationOptions = {}): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      message: null
    };
    
    // Empty check
    if (!tags.length && !options.allowEmpty) {
      result.isValid = false;
      result.message = 'At least one tag is required';
      result.errorMessage = result.message; // For backward compatibility
      return result;
    }
    
    // Max tags check
    const maxTags = options.maxTags || 30;
    if (tags.length > maxTags) {
      result.isValid = false;
      result.message = `Maximum ${maxTags} tags allowed`;
      result.errorMessage = result.message; // For backward compatibility
      return result;
    }
    
    // Individual tag validation
    for (const tag of tags) {
      const tagResult = this.validateTag(tag, options);
      if (!tagResult.isValid) {
        return tagResult;
      }
    }
    
    // Success
    return result;
  }
  
  // Bridge for backward compatibility
  validate(tags: string[], options?: TagValidationOptions): boolean {
    const result = this.validateTagList(tags, options);
    return result.isValid;
  }
  
  // Property for backward compatibility
  get validationResult(): ValidationResult {
    return {
      isValid: true,
      message: null,
      errorMessage: null
    };
  }
}

export const useTagValidator = () => new TagValidator();
