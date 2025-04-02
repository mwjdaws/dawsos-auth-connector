
import { ErrorLevel } from './types';

// Store for ignored error fingerprints
const ignoredFingerprints = new Set<string>();

// Minimum error level to process
let minimumErrorLevel = ErrorLevel.Debug;

/**
 * Check if an error should be ignored
 * 
 * @param fingerprint Error fingerprint
 * @returns True if the error should be ignored
 */
export function isErrorIgnored(fingerprint: string): boolean {
  return fingerprint ? ignoredFingerprints.has(fingerprint) : false;
}

/**
 * Ignore specific error by fingerprint
 * 
 * @param fingerprint Error fingerprint
 */
export function ignoreError(fingerprint: string): void {
  if (fingerprint) {
    ignoredFingerprints.add(fingerprint);
  }
}

/**
 * Stop ignoring a specific error
 * 
 * @param fingerprint Error fingerprint
 */
export function unignoreError(fingerprint: string): void {
  if (fingerprint) {
    ignoredFingerprints.delete(fingerprint);
  }
}

/**
 * Clear all ignored errors
 */
export function clearIgnoredErrors(): void {
  ignoredFingerprints.clear();
}

/**
 * Set minimum error level to process
 * Errors below this level will be ignored
 * 
 * @param level Minimum error level
 */
export function setMinimumErrorLevel(level: ErrorLevel): void {
  minimumErrorLevel = level;
}

/**
 * Get current minimum error level
 */
export function getMinimumErrorLevel(): ErrorLevel {
  return minimumErrorLevel;
}

/**
 * Check if error level meets minimum threshold
 * 
 * @param level Error level to check
 * @returns True if level meets or exceeds minimum
 */
export function isErrorLevelMet(level: ErrorLevel): boolean {
  const levels = {
    [ErrorLevel.Debug]: 0,
    [ErrorLevel.Info]: 1,
    [ErrorLevel.Warning]: 2,
    [ErrorLevel.Error]: 3,
    [ErrorLevel.Critical]: 4
  };
  
  return (levels[level] || 0) >= (levels[minimumErrorLevel] || 0);
}
