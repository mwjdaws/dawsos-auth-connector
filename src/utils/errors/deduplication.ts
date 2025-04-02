
/**
 * Error deduplication utilities
 * 
 * These utilities help prevent duplicate error messages from being shown to users
 * by tracking error fingerprints and only showing each unique error once within
 * a certain time period.
 */
import { ErrorHandlingOptions } from './types';

// In-memory store for recent error fingerprints with TTL
const recentErrorFingerprints: Map<string, number> = new Map();

// Default expiration time for fingerprints (5 seconds)
const DEFAULT_FINGERPRINT_TTL = 5000;

/**
 * Check if an error with the same fingerprint was recently reported
 */
export function isErrorDuplicate(fingerprint: string): boolean {
  if (!fingerprint) return false;
  
  const expiration = recentErrorFingerprints.get(fingerprint);
  if (!expiration) return false;
  
  // Check if the fingerprint has expired
  if (expiration < Date.now()) {
    recentErrorFingerprints.delete(fingerprint);
    return false;
  }
  
  return true;
}

/**
 * Store an error fingerprint to prevent duplicates
 * 
 * @param fingerprint The error fingerprint
 * @param ttl Time to live in milliseconds (default 5 seconds)
 */
export function storeErrorFingerprint(fingerprint: string, ttl: number = DEFAULT_FINGERPRINT_TTL): void {
  if (!fingerprint) return;
  
  // Set expiration time
  const expirationTime = Date.now() + ttl;
  recentErrorFingerprints.set(fingerprint, expirationTime);
  
  // Schedule cleanup to prevent memory leaks
  setTimeout(() => {
    recentErrorFingerprints.delete(fingerprint);
  }, ttl);
}

/**
 * Clear all stored error fingerprints
 */
export function clearSeenErrors(): void {
  recentErrorFingerprints.clear();
}

/**
 * Generate a fingerprint for error deduplication
 * 
 * @param error The error to generate a fingerprint for
 * @param options Additional options that may influence the fingerprint
 * @returns A string fingerprint
 */
export function generateFingerprint(error: unknown, options?: Partial<ErrorHandlingOptions>): string {
  // If a fingerprint is explicitly provided, use it
  if (options?.fingerprint) {
    return options.fingerprint;
  }
  
  // For Error objects, use name, message and first stack line
  if (error instanceof Error) {
    const stackLine = error.stack?.split('\n')[1]?.trim() || '';
    return `${error.name}:${error.message}:${stackLine}`;
  }
  
  // For strings, use the string itself
  if (typeof error === 'string') {
    return error;
  }
  
  // For user-provided messages, use that
  if (options?.message) {
    return options.message;
  }
  
  // Fallback: combine error and context into a string
  try {
    const errorStr = String(error);
    const contextStr = options?.context ? JSON.stringify(options.context) : '';
    return `${errorStr}:${contextStr}`;
  } catch (e) {
    return `unknown-error-${Date.now()}`;
  }
}
