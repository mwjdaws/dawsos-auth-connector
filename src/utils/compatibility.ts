
/**
 * Compatibility utilities for handling various data types safely
 */

/**
 * Ensures a value is a string, with an optional default value
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Ensures a value is a number, with an optional default value
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return defaultValue;
  }
  return Number(value);
}

/**
 * Ensures a value is a boolean, with an optional default value
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Ensures a value is an array, with an optional default value
 */
export function ensureArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (!value || !Array.isArray(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * Converts null to undefined for APIs that expect undefined instead of null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Converts undefined to null for APIs that expect null instead of undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Creates a safe version of an API function that converts any errors to a standard format
 */
export function createSafeApiCall<T>(
  apiCall: (...args: any[]) => Promise<T>,
  errorTransformer: (error: any) => any = (e) => e
): (...args: any[]) => Promise<{ data: T | null; error: any }> {
  return async (...args: any[]) => {
    try {
      const data = await apiCall(...args);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: errorTransformer(error) };
    }
  };
}
