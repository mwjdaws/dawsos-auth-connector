
import { ErrorLevel } from './types';
import { hasSeenError } from './tracking';

// Set of fingerprints for errors that should be ignored
const ignoredErrors = new Set<string>();

// The minimum level of errors that should be processed
let minimumErrorLevel: ErrorLevel = ErrorLevel.Debug;

/**
 * Check if an error should be ignored based on its fingerprint
 * 
 * @param error The error to check
 * @param fingerprint The error's fingerprint
 * @returns True if the error should be ignored
 */
export function isErrorIgnored(error: Error | unknown, fingerprint: string): boolean {
  // Ignore errors that are explicitly set to be ignored
  if (ignoredErrors.has(fingerprint)) {
    return true;
  }
  
  // Check error level if it's a ContextualError
  if (error && typeof error === 'object' && 'level' in error) {
    const errorLevel = (error as any).level;
    if (errorLevel && errorLevelValue(errorLevel) < errorLevelValue(minimumErrorLevel)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Add an error fingerprint to the ignore list
 * 
 * @param fingerprint The fingerprint to ignore
 */
export function ignoreError(fingerprint: string): void {
  ignoredErrors.add(fingerprint);
}

/**
 * Remove an error fingerprint from the ignore list
 * 
 * @param fingerprint The fingerprint to stop ignoring
 */
export function unignoreError(fingerprint: string): void {
  ignoredErrors.delete(fingerprint);
}

/**
 * Set the minimum error level that should be processed
 * 
 * @param level The minimum error level
 */
export function setMinimumErrorLevel(level: ErrorLevel): void {
  minimumErrorLevel = level;
}

/**
 * Get a numeric value for an error level for comparison
 * 
 * @param level The error level
 * @returns A numeric value for comparison
 */
function errorLevelValue(level: ErrorLevel): number {
  switch (level) {
    case ErrorLevel.Debug:
      return 0;
    case ErrorLevel.Info:
      return 1;
    case ErrorLevel.Warning:
      return 2;
    case ErrorLevel.Error:
      return 3;
    case ErrorLevel.Critical:
      return 4;
    default:
      return 2; // Default to Warning
  }
}

/**
 * Reset error filtering configuration
 * Useful for testing
 */
export function resetErrorFiltering(): void {
  ignoredErrors.clear();
  minimumErrorLevel = ErrorLevel.Debug;
}
