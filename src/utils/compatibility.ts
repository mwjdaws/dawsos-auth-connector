
/**
 * Compatibility utilities
 * 
 * These functions help maintain backward compatibility with older code patterns
 * in the codebase while we transition to newer patterns.
 */

/**
 * Safely execute a callback with proper error handling
 * 
 * @param callback The callback to execute
 * @param errorHandler Optional error handler
 * @returns The result of the callback or undefined if an error occurred
 */
export function safeCallback<T>(
  callback: (...args: any[]) => T,
  errorHandler?: (error: Error) => void
): (...args: any[]) => T | undefined {
  return (...args: any[]): T | undefined => {
    try {
      return callback(...args);
    } catch (error) {
      if (errorHandler && error instanceof Error) {
        errorHandler(error);
      } else {
        console.error('Error in callback:', error);
      }
      return undefined;
    }
  };
}

/**
 * Convert undefined values to null
 * 
 * Helpful for database operations where undefined isn't valid
 * but null is explicitly recognized.
 * 
 * @param value The value to check
 * @returns The original value or null if it's undefined
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Convert null values to undefined
 * 
 * Helpful for UI components that use undefined for "not specified"
 * 
 * @param value The value to check
 * @returns The original value or undefined if it's null
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Ensure a value is a string
 * 
 * @param value The value to check
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a string or the default value
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return String(value);
}

/**
 * Ensure a value is a number
 * 
 * @param value The value to check
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a number or the default value
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensure a value is a boolean
 * 
 * @param value The value to check
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a boolean or the default value
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}

/**
 * Ensure a value is an array
 * 
 * @param value The value to check
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as an array or the default value
 */
export function ensureArray<T>(value: any, defaultValue: T[] = []): T[] {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return Array.isArray(value) ? value : [value] as T[];
}

/**
 * Ensure a zoom value is within valid bounds
 * 
 * @param zoom The zoom value to check
 * @param minZoom Minimum zoom level
 * @param maxZoom Maximum zoom level
 * @returns The zoom value clamped to the min/max bounds
 */
export function ensureValidZoom(zoom: number, minZoom: number = 0.1, maxZoom: number = 4): number {
  return Math.max(minZoom, Math.min(maxZoom, zoom));
}

/**
 * Create safe props for graph components
 * 
 * @param props The original props
 * @returns A sanitized version of the props
 */
export function createSafeGraphProps(props: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(props)) {
    // Skip functions, as they're usually event handlers
    if (typeof value === 'function') {
      result[key] = value;
      continue;
    }
    
    // Ensure non-null values
    if (value === null || value === undefined) {
      continue;
    }
    
    result[key] = value;
  }
  
  return result;
}

/**
 * Ensure graph data is valid for rendering
 * 
 * @param data The graph data to validate
 * @returns Valid graph data with default values for missing properties
 */
export function ensureValidGraphData(data: any): any {
  if (!data) {
    return { nodes: [], links: [] };
  }
  
  return {
    nodes: ensureArray(data.nodes),
    links: ensureArray(data.links)
  };
}
