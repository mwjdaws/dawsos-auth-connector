
/**
 * Global compatibility utilities for type safety
 * 
 * These utilities help ensure type safety when dealing with potentially
 * undefined, null, or mismatched types throughout the application.
 */

export interface ErrorHandlingCompatOptions {
  level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  context?: Record<string, any>;
  silent?: boolean;
  technical?: boolean;
  title?: string;
  actionLabel?: string;
  onRetry?: () => void;
  preventDuplicate?: boolean;
  duration?: number;
  deduplicate?: boolean;
}

/**
 * Ensures a value is a string, even if null or undefined
 */
export function ensureString(value: string | null | undefined): string {
  return value !== null && value !== undefined ? value : '';
}

/**
 * Ensures a value is a number, even if null or undefined
 */
export function ensureNumber(value: number | null | undefined): number {
  return value !== null && value !== undefined ? value : 0;
}

/**
 * Ensures a value is a boolean, even if null or undefined
 */
export function ensureBoolean(value: boolean | null | undefined): boolean {
  return value !== null && value !== undefined ? value : false;
}

/**
 * Converts undefined to null for API compatibility
 */
export function undefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}

/**
 * Converts null to undefined for component props compatibility
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Creates a compatible graph reference object
 */
export function createCompatibleGraphRef(ref: any): any {
  if (!ref) return {};
  
  return {
    centerOnNode: (nodeId: string) => ref.centerOnNode?.(nodeId),
    zoomToFit: (duration?: number) => ref.zoomToFit?.(duration),
    resetZoom: () => ref.resetZoom?.(),
    setZoom: (zoom: number) => ref.setZoom?.(zoom),
    getGraphData: () => ref.getGraphData?.()
  };
}

/**
 * Creates safe graph props with proper defaults
 */
export function createSafeGraphProps(props: any): any {
  return {
    startingNodeId: ensureString(props.startingNodeId),
    width: ensureNumber(props.width || 800),
    height: ensureNumber(props.height || 600),
    hasAttemptedRetry: ensureBoolean(props.hasAttemptedRetry)
  };
}
