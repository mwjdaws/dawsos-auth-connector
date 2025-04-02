import { ErrorLevel, ErrorSource } from './types';

// Store recent fingerprints for deduplication
// Using a Map with value = timestamp for auto-cleanup
const recentFingerprints = new Map<string, number>();

// Maximum number of fingerprints to cache (to prevent memory leaks)
const MAX_FINGERPRINTS = 1000;

// How long to keep fingerprints for deduplication (in ms)
const FINGERPRINT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Generate a unique fingerprint for an error to identify duplicates
 * 
 * @param error The error object
 * @param message Optional custom message
 * @param source Optional error source
 * @returns A string fingerprint
 */
export function generateFingerprint(
  error: Error, 
  message?: string,
  source?: ErrorSource
): string {
  // Components of the fingerprint
  const components = [
    // Error type and message
    error.name,
    error.message,
    
    // Custom message if provided
    message,
    
    // Source category
    source,
    
    // First line of stack trace (most specific part)
    error.stack?.split('\n')[1]?.trim()
  ];
  
  // Join non-empty components into fingerprint
  return components
    .filter(Boolean)
    .join('|')
    .slice(0, 200); // Limit length
}

/**
 * Check if an error with this fingerprint has been seen recently
 * 
 * @param fingerprint The error fingerprint
 * @returns True if a duplicate, false if new
 */
export function isDuplicateError(fingerprint: string): boolean {
  // Auto-cleanup expired fingerprints before checking
  cleanupExpiredFingerprints();
  
  // Check if fingerprint exists
  return recentFingerprints.has(fingerprint);
}

/**
 * Store an error fingerprint for deduplication
 * 
 * @param fingerprint The error fingerprint
 */
export function storeFingerprint(fingerprint: string): void {
  // Skip invalid fingerprints
  if (!fingerprint || typeof fingerprint !== 'string') {
    return;
  }
  
  // Clean up if cache is full
  if (recentFingerprints.size >= MAX_FINGERPRINTS) {
    cleanupOldestFingerprints(MAX_FINGERPRINTS / 2);
  }
  
  // Store fingerprint with current timestamp
  recentFingerprints.set(fingerprint, Date.now());
}

/**
 * Clean up expired fingerprints
 */
function cleanupExpiredFingerprints(): void {
  const now = Date.now();
  
  // Remove expired fingerprints
  for (const [fingerprint, timestamp] of recentFingerprints.entries()) {
    if (now - timestamp > FINGERPRINT_TTL) {
      recentFingerprints.delete(fingerprint);
    }
  }
}

/**
 * Clean up oldest fingerprints when cache gets too large
 * 
 * @param count Number of fingerprints to remove
 */
function cleanupOldestFingerprints(count: number): void {
  // Convert to array of [fingerprint, timestamp] pairs
  const entries = Array.from(recentFingerprints.entries());
  
  // Sort by timestamp (oldest first)
  entries.sort((a, b) => a[1] - b[1]);
  
  // Delete oldest entries
  entries.slice(0, count).forEach(([fingerprint]) => {
    recentFingerprints.delete(fingerprint);
  });
}

/**
 * Clean up the fingerprint cache (for testing or memory management)
 */
export function cleanupFingerprintCache(): void {
  recentFingerprints.clear();
}

/**
 * Alias for backward compatibility
 */
export const isErrorDuplicate = isDuplicateError;
export const storeErrorFingerprint = storeFingerprint;
export const generateErrorFingerprint = generateFingerprint;
