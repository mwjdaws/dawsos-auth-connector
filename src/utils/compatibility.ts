
/**
 * General compatibility utilities
 */

/**
 * Ensure a value is always a string
 */
export function ensureString(value?: string | null): string {
  return value || '';
}

/**
 * Ensure a value is always a number
 */
export function ensureNumber(value?: number | null, defaultValue = 0): number {
  if (typeof value === 'number') {
    return value;
  }
  return defaultValue;
}

/**
 * Ensure a value is always a boolean
 */
export function ensureBoolean(value?: boolean | null): boolean {
  return !!value;
}
