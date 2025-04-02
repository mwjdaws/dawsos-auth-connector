
/**
 * Error categorization utilities
 */
import { ErrorSource } from './types';

// Error message patterns for categorization
const errorPatterns = {
  network: [
    'network error',
    'failed to fetch',
    'internet',
    'connection',
    'timeout',
    'aborted',
    'cors',
    'offline'
  ],
  authentication: [
    'unauthorized',
    'unauthenticated',
    'auth',
    'authentication',
    'permission',
    'login',
    'session expired',
    'token',
    'jwt'
  ],
  validation: [
    'validation',
    'invalid',
    'required',
    'must be',
    'not allowed',
    'constraint',
    'format'
  ],
  database: [
    'database',
    'query',
    'db',
    'postgresql',
    'postgres',
    'sql',
    'supabase',
    'duplicate key'
  ],
  api: [
    'api',
    'endpoint',
    'server',
    'status code',
    'response',
    'request',
    'http',
    'rest'
  ],
  external: [
    'external',
    'third party',
    'provider',
    'service'
  ]
};

/**
 * Categorize an error based on its properties and message
 * 
 * @param error The error to categorize
 * @returns The categorized error source
 */
export function categorizeError(error: unknown): ErrorSource {
  if (!error) {
    return ErrorSource.Unknown;
  }
  
  // Cast error to string for pattern matching
  const errorString = error instanceof Error 
    ? `${error.name} ${error.message} ${error.stack || ''}`
    : String(error);
  
  const lowercaseError = errorString.toLowerCase();
  
  // Check for network errors
  if (errorPatterns.network.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.Network;
  }
  
  // Check for authentication errors
  if (errorPatterns.authentication.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.Authentication;
  }
  
  // Check for validation errors
  if (errorPatterns.validation.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.Validation;
  }
  
  // Check for database errors
  if (errorPatterns.database.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.Database;
  }
  
  // Check for API errors
  if (errorPatterns.api.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.API;
  }
  
  // Check for external service errors
  if (errorPatterns.external.some(pattern => lowercaseError.includes(pattern))) {
    return ErrorSource.External;
  }
  
  // Default to unknown if no pattern matches
  return ErrorSource.Unknown;
}
