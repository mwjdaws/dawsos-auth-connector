/**
 * Error ID generation utilities
 * 
 * This file provides utilities for generating unique identifiers
 * for errors to aid in deduplication and tracking.
 */
import { ErrorHandlingOptions } from './types';

/**
 * Generate a fingerprint for an error to use in deduplication
 * 
 * @param error The error object
 * @param options Error handling options
 * @returns A string fingerprint that identifies this error
 */
export function generateFingerprint(
  error: unknown, 
  options: Partial<ErrorHandlingOptions>
): string {
  // If a fingerprint is provided in options, use it
  if (options.fingerprint) {
    return options.fingerprint;
  }
  
  // Start with the error message
  let base = '';
  
  if (error instanceof Error) {
    base = `${error.name}:${error.message}`;
    
    // Add stack trace information if available (first 2 lines only)
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(0, 3);
      base += `:${stackLines.join('')}`;
    }
  } else if (typeof error === 'string') {
    base = error;
  } else {
    base = String(error);
  }
  
  // Add context from options to make the fingerprint more specific
  if (options.source) {
    base += `:${options.source}`;
  }
  
  if (options.message) {
    base += `:${options.message}`;
  }
  
  // Handling specific context values that help identify unique errors
  if (options.context) {
    const contextStr = Object.entries(options.context)
      .filter(([key]) => {
        // Only include certain keys that are useful for identifying errors
        // Avoid including values that change frequently (like timestamps)
        return [
          'componentName', 
          'hookName', 
          'serviceName', 
          'functionName', 
          'endpoint', 
          'entityId',
          'entityType'
        ].includes(key);
      })
      .map(([key, value]) => `${key}:${String(value)}`)
      .join(',');
      
    if (contextStr) {
      base += `:${contextStr}`;
    }
  }
  
  // Hash the fingerprint to keep it a reasonable length
  return hashString(base);
}

/**
 * Simple hash function to convert a string to a shorter fixed-length identifier
 * 
 * @param str The string to hash
 * @returns A hashed string
 */
function hashString(str: string): string {
  let hash = 0;
  
  if (str.length === 0) {
    return '0';
  }
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to a string and ensure it's positive
  return Math.abs(hash).toString(36);
}

/**
 * Generate a unique ID for an error instance
 * Different from fingerprint as it's unique per error occurrence
 * 
 * @returns A unique ID
 */
export function generateUniqueErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
