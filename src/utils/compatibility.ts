
/**
 * Compatibility utilities for dealing with type and API changes
 * 
 * These functions help ensure backward compatibility by converting between
 * different data formats and providing sensible defaults.
 */

/**
 * Ensures that a value is a string, providing a default if necessary.
 * 
 * @param value The value to ensure is a string
 * @param defaultValue Optional default value if the input is nullish
 * @returns A guaranteed string value
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return String(value);
}

/**
 * Ensures that a value is a number, providing a default if necessary.
 * 
 * @param value The value to ensure is a number
 * @param defaultValue Optional default value if the input is nullish or NaN
 * @returns A guaranteed number value
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures that a value is a boolean, providing a default if necessary.
 * 
 * @param value The value to ensure is a boolean
 * @param defaultValue Optional default value if the input is nullish
 * @returns A guaranteed boolean value
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return Boolean(value);
}

/**
 * Creates a compatible GraphRef object for backward compatibility
 * 
 * @param ref A modern graph renderer reference
 * @returns A compatibility wrapper with the legacy API
 */
export function createCompatibleGraphRef(ref: any): any {
  if (!ref) {
    return null;
  }
  
  return {
    centerOn: (nodeId: string) => {
      if (ref.centerOnNode) {
        ref.centerOnNode(nodeId);
      }
    },
    zoomToFit: (duration?: number) => {
      if (ref.zoomToFit) {
        ref.zoomToFit(duration);
      }
    },
    resetViewport: () => {
      if (ref.resetZoom) {
        ref.resetZoom();
      }
    },
    getGraphData: ref.getGraphData ? ref.getGraphData : () => ({ nodes: [], links: [] }),
    setZoom: ref.setZoom ? ref.setZoom : () => {}
  };
}

/**
 * Creates a compatibility wrapper for older API signatures
 * 
 * @param func A modern function that might have a different signature
 * @param defaultReturn A default return value if the function is undefined
 * @returns A function that works with the older API
 */
export function createCompatibleFunction<T>(
  func: ((...args: any[]) => T) | undefined,
  defaultReturn: T
): (...args: any[]) => T {
  return (...args: any[]) => {
    if (typeof func === 'function') {
      try {
        return func(...args);
      } catch (error) {
        console.error('Error in compatibility function:', error);
        return defaultReturn;
      }
    }
    return defaultReturn;
  };
}
