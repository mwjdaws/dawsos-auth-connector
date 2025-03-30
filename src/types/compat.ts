
/**
 * Compatibility types for use during transition to stricter type checking
 */

// This type allows optional properties to be either their type OR undefined
// Helps with 'exactOptionalPropertyTypes: true'
export type WithOptional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P] | undefined;
};

// Function signature that accepts undefined for optional callbacks
export type OptionalCallback<T extends (...args: any[]) => any> = 
  T | undefined;

// Convert string | null values to string | null | undefined for parameters
export type AllowUndefined<T> = {
  [K in keyof T]: T[K] extends string | null ? T[K] | undefined : T[K];
};

// Convert string | undefined to string | null for compatibility with DB operations
export type NullifyUndefined<T> = {
  [K in keyof T]: T[K] extends string | undefined ? string | null : T[K];
};

/**
 * Helper function to convert undefined to null
 * Useful for API calls where null is expected but undefined is provided
 */
export function nullifyUndefined<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Helper function to default undefined to empty string
 * Useful for UI components where empty strings are more convenient than undefined
 */
export function defaultUndefined<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value;
}

/**
 * Helper function to ensure a value is not undefined for TypeScript strict checks
 */
export function ensureDefined<T>(value: T | undefined, defaultValue: T): T {
  return value === undefined ? defaultValue : value;
}
