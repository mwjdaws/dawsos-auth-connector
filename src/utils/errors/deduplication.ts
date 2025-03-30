
import type { StandardizedError } from './types';

// Store recent errors to prevent duplicates
const recentErrors: Record<string, number> = {};

/**
 * Check if an error is a duplicate of a recent error
 * @param error The error to check
 * @returns Boolean indicating if this is a duplicate
 */
export function isDuplicateError(error: StandardizedError): boolean {
  const errorKey = `${error.code}-${error.message}`;
  const now = Date.now();
  
  // Check if we've seen this error recently (within 5 seconds)
  if (recentErrors[errorKey] && now - recentErrors[errorKey] < 5000) {
    return true;
  }
  
  // Record this error
  recentErrors[errorKey] = now;
  
  // Clean up old errors
  Object.keys(recentErrors).forEach(key => {
    if (now - recentErrors[key] > 60000) { // Remove after 1 minute
      delete recentErrors[key];
    }
  });
  
  return false;
}
