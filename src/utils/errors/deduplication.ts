
import { ErrorHandlingOptions } from './types';

// Error fingerprint cache
const ERROR_FINGERPRINT_CACHE = new Map<string, string>();

// Maximum age of a fingerprint cache entry in milliseconds
const FINGERPRINT_CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

// Maximum number of fingerprints to cache
const FINGERPRINT_CACHE_MAX_SIZE = 1000;

/**
 * Generate a unique fingerprint for an error to facilitate deduplication
 * 
 * @param error The error that occurred
 * @param options Error handling options
 * @returns A string fingerprint that identifies this type of error
 */
export function generateFingerprint(
  error: Error | unknown,
  options?: ErrorHandlingOptions
): string {
  // Create a cache key from the error and options
  const cacheKey = getCacheKey(error, options);
  
  // Check if we already computed a fingerprint for this error
  const cachedFingerprint = ERROR_FINGERPRINT_CACHE.get(cacheKey);
  if (cachedFingerprint) {
    return cachedFingerprint;
  }
  
  // If options include a fingerprint, use it
  if (options?.fingerprint) {
    cacheFingerprint(cacheKey, options.fingerprint);
    return options.fingerprint;
  }
  
  // Generate a fingerprint based on error properties
  const fingerprint = computeFingerprint(error, options);
  
  // Cache the fingerprint
  cacheFingerprint(cacheKey, fingerprint);
  
  return fingerprint;
}

/**
 * Compute a cache key for the error and options
 */
function getCacheKey(error: Error | unknown, options?: ErrorHandlingOptions): string {
  try {
    let errorStr = '';
    
    if (error instanceof Error) {
      errorStr = `${error.name}:${error.message}:${error.stack?.substring(0, 500)}`;
    } else if (typeof error === 'string') {
      errorStr = error;
    } else {
      errorStr = JSON.stringify(error);
    }
    
    const optionsStr = options ? JSON.stringify({
      message: options.message,
      source: options.source,
      level: options.level,
    }) : '';
    
    return `${errorStr}::${optionsStr}`;
  } catch (err) {
    // Fallback in case of serialization errors
    return `${Date.now()}-${Math.random()}`;
  }
}

/**
 * Compute a fingerprint from error and options
 */
function computeFingerprint(error: Error | unknown, options?: ErrorHandlingOptions): string {
  try {
    const components = [];
    
    // Add error-specific information
    if (error instanceof Error) {
      components.push(error.name || 'Error');
      components.push(error.message);
      
      // Extract the most important part of the stack trace (first frame)
      const stackLines = error.stack?.split('\n').slice(1, 2);
      if (stackLines && stackLines.length > 0) {
        components.push(stackLines[0].trim());
      }
      
      // Add error code if available
      if ('code' in error && error.code) {
        components.push(String(error.code));
      }
    } else if (typeof error === 'string') {
      components.push(error);
    } else {
      components.push(JSON.stringify(error).substring(0, 100));
    }
    
    // Add options-specific information
    if (options) {
      if (options.source) components.push(options.source);
      if (options.message) components.push(options.message);
    }
    
    // Join all components and hash them
    return hashString(components.filter(Boolean).join('::'));
  } catch (err) {
    // Fallback fingerprint in case of errors during fingerprint generation
    console.error('Error generating fingerprint:', err);
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Cache a fingerprint with proper cache management
 */
function cacheFingerprint(cacheKey: string, fingerprint: string): void {
  // Clean old entries if needed
  cleanupCache();
  
  // Add to cache with timestamp
  ERROR_FINGERPRINT_CACHE.set(cacheKey, fingerprint);
}

/**
 * Clean up old entries from the fingerprint cache
 */
function cleanupCache(): void {
  // Check if cache is full
  if (ERROR_FINGERPRINT_CACHE.size >= FINGERPRINT_CACHE_MAX_SIZE) {
    // Remove the oldest entries
    const entries = Array.from(ERROR_FINGERPRINT_CACHE.keys());
    const removeCount = Math.floor(FINGERPRINT_CACHE_MAX_SIZE * 0.2); // Remove 20%
    
    for (let i = 0; i < removeCount; i++) {
      ERROR_FINGERPRINT_CACHE.delete(entries[i]);
    }
  }
}

/**
 * Clean function that should be called periodically
 * to remove expired fingerprints from the cache
 */
export function cleanupFingerprintCache(): void {
  cleanupCache();
}
