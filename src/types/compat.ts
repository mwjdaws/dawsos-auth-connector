
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

/**
 * Ensures array is not null or undefined, providing empty array as default
 */
export function ensureArray<T>(array: T[] | null | undefined): T[] {
  return array || [];
}
