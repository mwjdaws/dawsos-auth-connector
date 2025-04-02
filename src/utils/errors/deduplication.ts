
/**
 * Error deduplication utilities
 * 
 * This file provides utilities to prevent duplicate error messages
 * from being shown to the user.
 */

// Set of error fingerprints that have been seen
let seenErrors = new Set<string>();

// Maximum number of errors to track for deduplication
const MAX_CACHED_ERRORS = 100;

// Time window for considering errors as duplicates (in ms)
const ERROR_DEDUPLICATION_WINDOW = 5000; // 5 seconds

// Timestamps for each error fingerprint
const errorTimestamps: Record<string, number> = {};

/**
 * Check if an error with the given fingerprint has been seen recently
 * 
 * @param fingerprint Unique identifier for the error
 * @returns Whether the error is a duplicate
 */
export function isErrorDuplicate(fingerprint: string): boolean {
  // Check if we've seen this error before
  if (!seenErrors.has(fingerprint)) {
    return false;
  }
  
  // Check if the error is within the deduplication window
  const lastSeen = errorTimestamps[fingerprint] || 0;
  const now = Date.now();
  
  // If the error was seen more than X ms ago, it's not considered a duplicate
  if (now - lastSeen > ERROR_DEDUPLICATION_WINDOW) {
    return false;
  }
  
  return true;
}

/**
 * Store an error fingerprint to prevent duplicate notifications
 * 
 * @param fingerprint Unique identifier for the error
 */
export function storeErrorFingerprint(fingerprint: string): void {
  // Record the timestamp of this error
  errorTimestamps[fingerprint] = Date.now();
  
  // Add to the set of seen errors
  seenErrors.add(fingerprint);
  
  // If we're tracking too many errors, remove the oldest ones
  if (seenErrors.size > MAX_CACHED_ERRORS) {
    pruneOldErrors();
  }
}

/**
 * Remove old error fingerprints to prevent memory leaks
 */
function pruneOldErrors(): void {
  const now = Date.now();
  const fingerprintsToRemove: string[] = [];
  
  // Find old fingerprints
  for (const [fingerprint, timestamp] of Object.entries(errorTimestamps)) {
    if (now - timestamp > ERROR_DEDUPLICATION_WINDOW) {
      fingerprintsToRemove.push(fingerprint);
    }
  }
  
  // Remove old fingerprints
  fingerprintsToRemove.forEach(fingerprint => {
    seenErrors.delete(fingerprint);
    delete errorTimestamps[fingerprint];
  });
}

/**
 * Clear all seen errors
 * Useful for testing or when navigating to a new page
 */
export function clearSeenErrors(): void {
  seenErrors.clear();
  Object.keys(errorTimestamps).forEach(key => {
    delete errorTimestamps[key];
  });
}

/**
 * Set the maximum number of errors to track
 * 
 * @param max Maximum number of errors to track
 */
export function setMaxCachedErrors(max: number): void {
  if (max < 1) {
    throw new Error('Maximum cached errors must be at least 1');
  }
  
  // If we're reducing the max, prune existing errors
  if (max < MAX_CACHED_ERRORS && seenErrors.size > max) {
    const errorsToKeep = Array.from(seenErrors).slice(-max);
    seenErrors = new Set(errorsToKeep);
    
    // Update timestamps
    const newTimestamps: Record<string, number> = {};
    errorsToKeep.forEach(fingerprint => {
      if (errorTimestamps[fingerprint]) {
        newTimestamps[fingerprint] = errorTimestamps[fingerprint];
      }
    });
    
    // Replace timestamps object
    Object.keys(errorTimestamps).forEach(key => {
      delete errorTimestamps[key];
    });
    
    Object.keys(newTimestamps).forEach(key => {
      errorTimestamps[key] = newTimestamps[key];
    });
  }
}

/**
 * Get the number of currently tracked errors
 * 
 * @returns Number of errors being tracked
 */
export function getTrackedErrorCount(): number {
  return seenErrors.size;
}
