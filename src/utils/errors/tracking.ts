
// Store for tracking error occurrences
const errorOccurrences = new Map<string, { 
  count: number, 
  firstSeen: number, 
  lastSeen: number 
}>();

// Maximum time to track error occurrences (1 hour)
const ERROR_TRACKING_TTL = 60 * 60 * 1000;

/**
 * Track an error occurrence by its fingerprint
 * 
 * @param fingerprint The unique fingerprint of the error
 * @returns Number of times this error has been seen
 */
export function trackError(fingerprint: string): number {
  cleanupOldEntries();
  
  const now = Date.now();
  const existing = errorOccurrences.get(fingerprint);
  
  if (existing) {
    // Update existing entry
    existing.count += 1;
    existing.lastSeen = now;
    errorOccurrences.set(fingerprint, existing);
    return existing.count;
  } else {
    // Create new entry
    errorOccurrences.set(fingerprint, {
      count: 1,
      firstSeen: now,
      lastSeen: now
    });
    return 1;
  }
}

/**
 * Get the number of times an error has been seen
 * 
 * @param fingerprint The unique fingerprint of the error
 * @returns Number of times this error has been seen
 */
export function getDuplicateCount(fingerprint: string): number {
  const entry = errorOccurrences.get(fingerprint);
  return entry ? entry.count : 0;
}

/**
 * Check if an error has been seen before
 * 
 * @param fingerprint The unique fingerprint of the error
 * @returns True if the error has been seen before
 */
export function hasSeenError(fingerprint: string): boolean {
  return errorOccurrences.has(fingerprint);
}

/**
 * Clean up old entries from the tracking store
 */
function cleanupOldEntries(): void {
  const now = Date.now();
  const cutoff = now - ERROR_TRACKING_TTL;
  
  for (const [fingerprint, entry] of errorOccurrences.entries()) {
    if (entry.lastSeen < cutoff) {
      errorOccurrences.delete(fingerprint);
    }
  }
}

/**
 * Reset error tracking data
 * Useful for testing or when user logs out
 */
export function resetErrorTracking(): void {
  errorOccurrences.clear();
}
