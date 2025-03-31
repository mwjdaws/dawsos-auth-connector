
/**
 * Error deduplication utilities
 */

// In-memory store for deduplication
const recentErrors = new Map<string, { timestamp: number; count: number }>();

// Default timeout for error deduplication (10 seconds)
const DEDUPLICATION_TIMEOUT = 10 * 1000;

/**
 * Check if an error with the given fingerprint has been seen recently
 * If it has, increment the count but return true (it's a duplicate)
 * If not, store it and return false (it's not a duplicate)
 * 
 * @param errorFingerprint A unique identifier for the error
 * @returns True if this is a duplicate error, false otherwise
 */
export function deduplicateError(errorFingerprint: string): boolean {
  const now = Date.now();
  const existingError = recentErrors.get(errorFingerprint);

  if (existingError) {
    // Check if the error is still within the deduplication window
    if (now - existingError.timestamp < DEDUPLICATION_TIMEOUT) {
      // Increment error count but don't show notification
      recentErrors.set(errorFingerprint, {
        timestamp: now,
        count: existingError.count + 1
      });
      return true; // This is a duplicate
    }
  }

  // Store the new error for deduplication
  recentErrors.set(errorFingerprint, {
    timestamp: now,
    count: 1
  });

  // Clean up old errors (older than deduplication timeout)
  for (const [hash, entry] of recentErrors.entries()) {
    if (now - entry.timestamp > DEDUPLICATION_TIMEOUT) {
      recentErrors.delete(hash);
    }
  }

  return false; // This is not a duplicate
}

/**
 * Get the count of a specific error fingerprint
 * 
 * @param errorFingerprint The error fingerprint
 * @returns The number of times this error has been seen, or 0 if it hasn't
 */
export function getErrorCount(errorFingerprint: string): number {
  const error = recentErrors.get(errorFingerprint);
  return error ? error.count : 0;
}

/**
 * Clear all stored errors from the deduplication cache
 * Useful when navigating between pages or routes
 */
export function clearErrorCache(): void {
  recentErrors.clear();
}

/**
 * Generate a fingerprint for an error based on its message and optional context
 * 
 * @param error The error to fingerprint
 * @param context Additional context to include in the fingerprint
 * @returns A string fingerprint for deduplication
 */
export function generateErrorFingerprint(error: unknown, context?: Record<string, any>): string {
  const message = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  const contextString = context ? JSON.stringify(context) : '';
  
  return `${errorName}:${message}:${contextString}`;
}
