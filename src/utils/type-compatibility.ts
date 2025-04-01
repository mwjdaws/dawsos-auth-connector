
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

/**
 * Converts undefined to null but preserves null values
 */
export function undefinedToNull<T>(value: T | undefined | null): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined but preserves undefined values
 */
export function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensures a value is not null or undefined, providing a default
 */
export function ensureValue<T>(value: T | null | undefined, defaultValue: T): T {
  return (value === null || value === undefined) ? defaultValue : value;
}

/**
 * Ensures a string is non-empty or returns null
 */
export function ensureNonEmptyString(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value.trim() === '') {
    return null;
  }
  return value;
}
