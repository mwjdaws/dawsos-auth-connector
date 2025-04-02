/**
 * Error deduplication utilities
 */
import { ErrorHandlingOptions } from './types';
import { generateErrorFingerprint } from './generateId';

// Store seen error fingerprints with a TTL (5 minutes)
const seenErrors = new Map<string, number>();
const ERROR_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Check if an error has been seen before
 * 
 * @param fingerprint The error fingerprint to check
 * @returns Whether the error has been seen before
 */
export function isErrorDuplicate(fingerprint: string): boolean {
  // Check if the fingerprint exists and hasn't expired
  if (seenErrors.has(fingerprint)) {
    const expiryTime = seenErrors.get(fingerprint);
    if (expiryTime && expiryTime > Date.now()) {
      return true;
    }
    // Expired entry, remove it
    seenErrors.delete(fingerprint);
  }
  return false;
}

/**
 * Store an error fingerprint to prevent duplicate reporting
 * 
 * @param fingerprint The error fingerprint to store
 */
export function storeErrorFingerprint(fingerprint: string): void {
  // Store with expiry time
  seenErrors.set(fingerprint, Date.now() + ERROR_TTL);
  
  // Cleanup old entries (optional, can be done less frequently in production)
  cleanupExpiredErrors();
}

/**
 * Generate a fingerprint for an error
 * 
 * @param error The error to fingerprint
 * @param context Additional context
 * @returns A unique fingerprint for the error
 */
export function generateFingerprint(
  error: Error | unknown,
  options?: Partial<ErrorHandlingOptions>
): string {
  // If a fingerprint is provided in options, use it
  if (options?.fingerprint) {
    return options.fingerprint;
  }
  
  // Otherwise generate a fingerprint based on the error
  if (error instanceof Error) {
    return generateErrorFingerprint(error, options?.context);
  }
  
  // For non-Error objects, create a simple hash
  const errorString = typeof error === 'string' ? error : JSON.stringify(error);
  return `err_${errorString.substring(0, 100).replace(/\s+/g, '_')}`;
}

/**
 * Clean up expired error entries
 */
function cleanupExpiredErrors(): void {
  const now = Date.now();
  seenErrors.forEach((expiryTime, fingerprint) => {
    if (expiryTime <= now) {
      seenErrors.delete(fingerprint);
    }
  });
}

/**
 * Clear all seen errors
 * This is useful for testing or when context changes
 */
export function clearSeenErrors(): void {
  seenErrors.clear();
}
