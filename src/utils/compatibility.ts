
/**
 * Global compatibility utilities
 * 
 * This file provides compatibility functions to handle 
 * strict type checking issues and prevent runtime errors
 */

// Safely handle optional callbacks
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | undefined | null,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

// Safely get a property when it might be null or undefined
export function safeProperty<T, K extends keyof T>(
  obj: T | null | undefined,
  prop: K,
  defaultValue?: T[K]
): T[K] | undefined {
  if (obj == null) return defaultValue;
  return obj[prop] ?? defaultValue;
}

// Convert potentially undefined to null
export function toNull<T>(val: T | undefined): T | null {
  return val === undefined ? null : val;
}

// Convert potentially null to undefined
export function toUndefined<T>(val: T | null): T | undefined {
  return val === null ? undefined : val;
}

// Create a compatible graph reference
export function createCompatibleGraphRef(ref: any): any {
  return ref;
}

// Safely filter array items to remove undefined entries
export function safeFilter<T>(array: (T | undefined | null)[]): T[] {
  return array.filter((item): item is T => item !== undefined && item !== null);
}

// Handle strict compatibility for error levels
export function compatibleErrorLevel(level: string | undefined): 'info' | 'warning' | 'error' | undefined {
  if (!level) return undefined;
  
  switch (level) {
    case 'debug':
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
    case 'critical':
      return 'error';
    default:
      return undefined;
  }
}

// Handle backwards compatibility for technical error option
export function compatibleErrorOptions(options: any = {}): any {
  const result = { ...options };
  
  // Map technical flag to appropriate level if needed
  if (options?.technical === true && !options?.level) {
    result.level = 'error';
  }
  
  // Remove technical property as it's not in the current type
  if ('technical' in result) {
    delete result.technical;
  }
  
  return result;
}
