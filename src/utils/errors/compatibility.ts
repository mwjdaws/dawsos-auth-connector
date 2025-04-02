
/**
 * Compatibility layer for error handling
 * 
 * This module provides functions to bridge between different error handling approaches
 * used in the codebase over time.
 */

import { handleError } from './handle';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';

/**
 * Convert legacy error handling options to the current format
 */
export function convertErrorOptions(options: any = {}): Partial<ErrorHandlingOptions> {
  return {
    message: options.message || '',
    level: convertLegacyLevel(options.level),
    source: convertLegacySource(options.source),
    context: options.context || {},
    silent: !!options.silent,
    showToast: options.showToast !== false,
    reportToAnalytics: options.reportToAnalytics !== false
  };
}

/**
 * Legacy error handler (3-parameter version)
 */
export function legacyHandleError(
  error: Error | unknown,
  message: string,
  level: string | ErrorLevel = ErrorLevel.Error
) {
  handleError(error, {
    message,
    level: convertLegacyLevel(level)
  });
}

/**
 * Error handler with message as primary parameter
 */
export function handleErrorWithMessage(
  message: string,
  error: Error | unknown,
  options: Partial<ErrorHandlingOptions> = {}
) {
  handleError(error, {
    message,
    ...options
  });
}

/**
 * Create a contextual error with additional information
 */
export function createContextualError(
  originalError: Error | unknown,
  contextMessage: string,
  context: Record<string, any> = {}
): Error {
  const errorMessage = originalError instanceof Error 
    ? originalError.message 
    : String(originalError);
  
  const error = new Error(`${contextMessage}: ${errorMessage}`);
  (error as any).originalError = originalError;
  (error as any).context = context;
  
  return error;
}

/**
 * Convert legacy level strings to ErrorLevel enum
 */
function convertLegacyLevel(level: string | ErrorLevel | undefined): ErrorLevel {
  if (level === undefined) return ErrorLevel.Error;
  
  if (typeof level === 'string') {
    const upperLevel = level.toUpperCase();
    if (upperLevel === 'DEBUG') return ErrorLevel.Debug;
    if (upperLevel === 'INFO') return ErrorLevel.Info;
    if (upperLevel === 'WARNING') return ErrorLevel.Warning;
    if (upperLevel === 'ERROR') return ErrorLevel.Error;
    if (upperLevel === 'CRITICAL') return ErrorLevel.Critical;
    return ErrorLevel.Error;
  }
  
  return level;
}

/**
 * Convert legacy source strings to ErrorSource enum
 */
function convertLegacySource(source: string | ErrorSource | undefined): ErrorSource {
  if (source === undefined) return ErrorSource.Unknown;
  
  if (typeof source === 'string') {
    const upperSource = source.toUpperCase();
    if (upperSource === 'USER') return ErrorSource.User;
    if (upperSource === 'COMPONENT') return ErrorSource.Component;
    if (upperSource === 'HOOK') return ErrorSource.Hook;
    if (upperSource === 'SERVICE') return ErrorSource.Service;
    if (upperSource === 'API') return ErrorSource.API;
    if (upperSource === 'DATABASE') return ErrorSource.Database;
    if (upperSource === 'NETWORK') return ErrorSource.Network;
    if (upperSource === 'AUTH') return ErrorSource.Auth;
    if (upperSource === 'EDGE') return ErrorSource.Edge;
    return ErrorSource.Unknown;
  }
  
  return source;
}
