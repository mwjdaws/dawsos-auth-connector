
// Track occurrence counts for each error fingerprint
const errorOccurrences = new Map<string, number>();

// Store timestamps for first occurrence of errors
const firstOccurrences = new Map<string, number>();

// Store recently seen errors for deduplication
const recentlySeenErrors = new Set<string>();

// Maximum tracking history
const MAX_TRACKED_ERRORS = 1000;

// TTL for "recently seen" status (ms)
const RECENTLY_SEEN_TTL = 2 * 60 * 1000; // 2 minutes

/**
 * Track occurrence of an error
 * 
 * @param fingerprint Error fingerprint
 * @returns New occurrence count
 */
export function trackError(fingerprint: string): number {
  if (!fingerprint) return 0;
  
  // Limit size of tracking maps
  if (errorOccurrences.size >= MAX_TRACKED_ERRORS) {
    // Delete 20% of oldest entries
    pruneTrackingData(Math.floor(MAX_TRACKED_ERRORS * 0.2));
  }
  
  // Track first occurrence if not seen before
  if (!firstOccurrences.has(fingerprint)) {
    firstOccurrences.set(fingerprint, Date.now());
  }
  
  // Increment occurrence count
  const count = (errorOccurrences.get(fingerprint) || 0) + 1;
  errorOccurrences.set(fingerprint, count);
  
  // Mark as recently seen with timestamp
  recentlySeenErrors.add(fingerprint);
  
  return count;
}

/**
 * Get number of times an error has occurred
 * 
 * @param fingerprint Error fingerprint
 * @returns Occurrence count
 */
export function getDuplicateCount(fingerprint: string): number {
  return fingerprint ? (errorOccurrences.get(fingerprint) || 0) : 0;
}

/**
 * Check if error has been seen recently
 * 
 * @param fingerprint Error fingerprint
 * @returns True if seen recently
 */
export function hasSeenError(fingerprint: string): boolean {
  if (!fingerprint) return false;
  return recentlySeenErrors.has(fingerprint);
}

/**
 * Clean up oldest tracking data
 * 
 * @param count Number of entries to prune
 */
function pruneTrackingData(count: number): void {
  // Get oldest fingerprints based on first occurrence
  const oldest = Array.from(firstOccurrences.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([fingerprint]) => fingerprint);
    
  // Delete from all tracking data structures
  oldest.forEach(fingerprint => {
    errorOccurrences.delete(fingerprint);
    firstOccurrences.delete(fingerprint);
    recentlySeenErrors.delete(fingerprint);
  });
}

/**
 * Clean up tracking for errors that haven't been seen recently
 */
export function cleanupStaleTracking(): void {
  const now = Date.now();
  const cutoff = now - RECENTLY_SEEN_TTL;
  
  // Find fingerprints with first occurrence older than cutoff
  const stale = Array.from(firstOccurrences.entries())
    .filter(([fingerprint, timestamp]) => 
      timestamp < cutoff && !recentlySeenErrors.has(fingerprint)
    )
    .map(([fingerprint]) => fingerprint);
    
  // Clean up stale entries
  stale.forEach(fingerprint => {
    errorOccurrences.delete(fingerprint);
    firstOccurrences.delete(fingerprint);
  });
}

/**
 * Reset all error tracking
 */
export function resetErrorTracking(): void {
  errorOccurrences.clear();
  firstOccurrences.clear();
  recentlySeenErrors.clear();
}
