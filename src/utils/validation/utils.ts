
/**
 * Utility functions for validation
 */

/**
 * Creates a validation result with a valid status
 * 
 * @param message Optional message to include with the result
 * @returns A validation result object with isValid=true
 */
export function createValidResult(message?: string) {
  return {
    isValid: true,
    message: message || null,
    errorMessage: null
  };
}

/**
 * Creates a validation result with an invalid status
 * 
 * @param errorMessage The error message explaining why validation failed
 * @returns A validation result object with isValid=false
 */
export function createInvalidResult(errorMessage: string) {
  return {
    isValid: false,
    message: null,
    errorMessage
  };
}

/**
 * Safely checks if a value is defined (not null or undefined)
 * 
 * @param value The value to check
 * @returns True if the value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely checks if a string is empty
 * 
 * @param value The string to check
 * @returns True if the string is undefined, null, or empty
 */
export function isEmpty(value?: string | null): boolean {
  return value === undefined || value === null || value.trim() === '';
}

/**
 * Safe JSON parsing with error handling
 * 
 * @param str String to parse as JSON
 * @param fallback Optional fallback value if parsing fails
 * @returns Parsed JSON object or the fallback value
 */
export function safeParseJson<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (e) {
    return fallback;
  }
}
