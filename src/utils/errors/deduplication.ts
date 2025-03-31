
/**
 * Error deduplication utilities
 */

// Store for recently seen errors
const recentErrors = new Map<string, { count: number, timestamp: number }>();
const MAX_STORED_ERRORS = 50;
const DEDUPLICATION_WINDOW_MS = 5000; // 5 seconds

/**
 * Check if an error is a duplicate of a recent error 
 * 
 * @param errorMessage Error message to check for duplicates
 * @returns True if this is a duplicate error that should be suppressed
 */
export function deduplicateError(errorMessage: string): boolean {
  const now = Date.now();
  const errorKey = errorMessage.trim();
  
  // Clean up old errors
  cleanupOldErrors(now);
  
  // Check for existing error
  const existingError = recentErrors.get(errorKey);
  
  if (existingError && (now - existingError.timestamp) < DEDUPLICATION_WINDOW_MS) {
    // Update count and timestamp for existing error
    existingError.count += 1;
    existingError.timestamp = now;
    
    // Return true to indicate this is a duplicate
    return true;
  }
  
  // Add new error to tracking
  recentErrors.set(errorKey, { count: 1, timestamp: now });
  
  // Return false to indicate this is not a duplicate
  return false;
}

/**
 * Remove old errors from tracking
 */
function cleanupOldErrors(now: number): void {
  if (recentErrors.size <= MAX_STORED_ERRORS) {
    return;
  }
  
  // Remove oldest errors
  const errors = Array.from(recentErrors.entries());
  errors.sort((a, b) => a[1].timestamp - b[1].timestamp);
  
  // Remove oldest 20% of errors
  const removeCount = Math.ceil(errors.length * 0.2);
  for (let i = 0; i < removeCount; i++) {
    recentErrors.delete(errors[i][0]);
  }
}
