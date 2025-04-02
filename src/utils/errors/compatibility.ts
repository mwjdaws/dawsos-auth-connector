
/**
 * Error handling compatibility utilities
 * 
 * These utilities help maintain backward compatibility with older code
 * that uses different error handling patterns.
 */
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';

/**
 * Legacy error handling options type
 */
export interface LegacyErrorHandlingOptions {
  level?: string;
  source?: string;
  message?: string;
  context?: any;
  silent?: boolean;
  technical?: boolean;
  showToast?: boolean;
  toastId?: string;
  reportToAnalytics?: boolean;
}

/**
 * Convert legacy error options to the new format
 */
export function convertErrorOptions(
  options?: LegacyErrorHandlingOptions | string
): Partial<ErrorHandlingOptions> {
  if (!options) {
    return {};
  }

  // Handle string case (often used for just passing a message)
  if (typeof options === 'string') {
    return {
      message: options
    };
  }

  // Convert legacy level strings to enum values
  let level = options.level ? mapLegacyLevel(options.level) : undefined;
  
  // Convert legacy source strings to enum values
  let source = options.source ? mapLegacySource(options.source) : undefined;
  
  // Return converted options
  return {
    level,
    source,
    message: options.message || '',
    context: options.context,
    silent: options.silent,
    showToast: options.showToast,
    toastId: options.toastId,
    reportToAnalytics: options.reportToAnalytics
  };
}

/**
 * Map legacy error level strings to ErrorLevel enum
 */
function mapLegacyLevel(level: string): ErrorLevel {
  switch (level.toLowerCase()) {
    case 'debug':
      return ErrorLevel.Debug;
    case 'info':
      return ErrorLevel.Info;
    case 'warning':
    case 'warn':
      return ErrorLevel.Warning;
    case 'critical':
    case 'fatal':
      return ErrorLevel.Critical;
    case 'error':
    default:
      return ErrorLevel.Error;
  }
}

/**
 * Map legacy error source strings to ErrorSource enum
 */
function mapLegacySource(source: string): ErrorSource {
  switch (source.toLowerCase()) {
    case 'ui':
      return ErrorSource.UI;
    case 'component':
      return ErrorSource.Component;
    case 'hook':
      return ErrorSource.Hook;
    case 'api':
      return ErrorSource.API;
    case 'database':
    case 'db':
      return ErrorSource.Database;
    case 'auth':
    case 'authentication':
      return ErrorSource.Authentication;
    case 'authorization':
      return ErrorSource.Authorization;
    case 'validation':
      return ErrorSource.Validation;
    case 'external':
      return ErrorSource.External;
    case 'network':
      return ErrorSource.Network;
    case 'system':
      return ErrorSource.System;
    case 'service':
      return ErrorSource.Service;
    default:
      return ErrorSource.Unknown;
  }
}

/**
 * Check if a value is a compatible error options object
 */
export function compatibleErrorOptions(value: any): boolean {
  return value && typeof value === 'object' && !Array.isArray(value);
}
