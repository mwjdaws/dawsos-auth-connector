
/**
 * Utility for generating unique error IDs
 */

/**
 * Generate a unique ID for an error
 * This helps with deduplication and tracking
 * 
 * @returns A unique error ID
 */
export function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a deterministic ID for an error based on its content
 * Useful for deduplicating similar errors
 * 
 * @param error The error object
 * @param context Additional context to include in the fingerprint
 * @returns A deterministic error fingerprint
 */
export function generateErrorFingerprint(error: Error, context?: Record<string, any>): string {
  const components = [
    error.name,
    error.message,
    // Take first line of stack trace if available
    error.stack?.split('\n')[1]?.trim() || ''
  ];
  
  // Add context values if provided
  if (context) {
    Object.entries(context).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        components.push(`${key}:${value}`);
      }
    });
  }
  
  return components.join('|');
}
