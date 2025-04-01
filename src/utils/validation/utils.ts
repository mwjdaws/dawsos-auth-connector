
import { ValidationResult } from './types';

/**
 * Checks if a validation result indicates validity
 */
export const isValidResult = (result: ValidationResult): boolean => {
  return result.isValid;
};

/**
 * Combines multiple validation results into a single result
 * 
 * @param results Array of validation results to combine
 * @returns Combined validation result (valid only if all inputs are valid)
 */
export const combineValidationResults = (
  results: ValidationResult[]
): ValidationResult => {
  if (!results.length) {
    return {
      isValid: true,
      errorMessage: null,
      message: null,
      resultType: 'combined'
    };
  }
  
  const isValid = results.every(r => r.isValid);
  const firstInvalid = results.find(r => !r.isValid);
  
  return {
    isValid,
    errorMessage: isValid ? null : firstInvalid?.errorMessage || 'Validation failed',
    message: isValid ? 'All validations passed' : firstInvalid?.errorMessage || 'Validation failed',
    resultType: 'combined'
  };
};

/**
 * Creates a validation pipeline from multiple validation functions
 * 
 * @param validators Array of validation functions
 * @returns Function that runs all validators in sequence
 */
export const createValidationPipeline = (
  validators: ((value: any) => ValidationResult)[]
) => {
  return (value: any): ValidationResult => {
    const results: ValidationResult[] = [];
    
    for (const validator of validators) {
      const result = validator(value);
      results.push(result);
      
      // Short-circuit on first failure
      if (!result.isValid) {
        return result;
      }
    }
    
    return combineValidationResults(results);
  };
};
