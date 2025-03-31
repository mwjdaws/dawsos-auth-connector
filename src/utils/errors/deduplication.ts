
/**
 * Error deduplication utilities
 * 
 * Prevents flooding users with the same errors in a short period of time.
 */

// Map to track recent errors by fingerprint and their count
const recentErrors = new Map<string, { count: number, timestamp: number }>();

// Cleanup interval for expired errors (10 minutes)
const CLEANUP_INTERVAL = 10 * 60 * 1000;

// Time window for considering errors as duplicates (30 seconds)
const DEDUPLICATION_WINDOW = 30 * 1000;

// Maximum number of identical errors to show in a time window
const MAX_DUPLICATE_ERRORS = 3;

// Setup cleanup interval
setInterval(() => {
  const now = Date.now();
  recentErrors.forEach((value, key) => {
    if (now - value.timestamp > DEDUPLICATION_WINDOW) {
      recentErrors.delete(key);
    }
  });
}, CLEANUP_INTERVAL);

/**
 * Check if an error should be deduplicated
 * 
 * @param fingerprint Unique identifier for the error
 * @returns true if the error is a duplicate and should be suppressed, false otherwise
 */
export function deduplicateError(fingerprint: string): boolean {
  const now = Date.now();
  const errorRecord = recentErrors.get(fingerprint);
  
  if (!errorRecord) {
    // First occurrence of this error
    recentErrors.set(fingerprint, { count: 1, timestamp: now });
    return false;
  }
  
  // Check if within deduplication window
  if (now - errorRecord.timestamp <= DEDUPLICATION_WINDOW) {
    // Increment count
    errorRecord.count += 1;
    errorRecord.timestamp = now;
    
    // Deduplicate if we've shown this error too many times
    if (errorRecord.count > MAX_DUPLICATE_ERRORS) {
      return true;
    }
  } else {
    // Error is outside the window, reset counter
    errorRecord.count = 1;
    errorRecord.timestamp = now;
  }
  
  // Don't deduplicate
  return false;
}

/**
 * Get the count of a specific error in the deduplication window
 * 
 * @param fingerprint The error fingerprint to check
 * @returns Number of occurrences within the window
 */
export function getErrorCount(fingerprint: string): number {
  const errorRecord = recentErrors.get(fingerprint);
  return errorRecord?.count || 0;
}

/**
 * Reset the deduplication counter for a specific error
 * 
 * @param fingerprint The error fingerprint to reset
 */
export function resetErrorCount(fingerprint: string): void {
  recentErrors.delete(fingerprint);
}

/**
 * Clear all error deduplication counters
 */
export function clearAllErrorCounts(): void {
  recentErrors.clear();
}
