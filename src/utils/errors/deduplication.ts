
/**
 * Error deduplication utilities
 * 
 * Prevents flooding users with duplicate error messages in short succession.
 */

// Store for recently shown errors (message -> timestamp)
const recentErrors = new Map<string, number>();

// Deduplication window in milliseconds (default: 5 seconds)
const DEDUPLICATION_WINDOW_MS = 5000;

/**
 * Check if an error is a duplicate of a recent error
 * 
 * @param errorMessage The error message to check
 * @param windowMs Optional custom deduplication window in milliseconds
 * @returns Whether the error is a duplicate that should be suppressed
 */
export function deduplicateError(errorMessage: string, windowMs = DEDUPLICATION_WINDOW_MS): boolean {
  const now = Date.now();
  const lastShown = recentErrors.get(errorMessage);
  
  // If this error was shown recently, consider it a duplicate
  if (lastShown && now - lastShown < windowMs) {
    return true;
  }
  
  // Update the last shown time for this error
  recentErrors.set(errorMessage, now);
  
  // Clean up old entries every so often to prevent memory leaks
  if (recentErrors.size > 50) {
    cleanupOldErrors(now, windowMs);
  }
  
  return false;
}

/**
 * Remove errors that are older than the deduplication window
 * 
 * @param now Current timestamp
 * @param windowMs Deduplication window in milliseconds
 */
function cleanupOldErrors(now: number, windowMs: number): void {
  for (const [message, timestamp] of recentErrors.entries()) {
    if (now - timestamp > windowMs) {
      recentErrors.delete(message);
    }
  }
}

/**
 * Clear all tracked errors
 * Useful when changing routes to prevent errors from persisting
 */
export function clearErrorCache(): void {
  recentErrors.clear();
}
