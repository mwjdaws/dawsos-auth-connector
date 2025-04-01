
/**
 * Ensures a value is a string, or returns an empty string
 */
export function ensureString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Ensures a value is a number, or returns the default value
 */
export function ensureNumber(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean, or returns the default value
 */
export function ensureBoolean(value: unknown, defaultValue = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Ensures a value is an array, or returns an empty array
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

/**
 * Normalizes null or undefined to null
 */
export function normalizeToNull<T>(value: T | null | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Normalizes null or undefined to undefined
 */
export function normalizeToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}
