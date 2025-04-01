
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';

/**
 * Type for legacy error handling options for backward compatibility
 */
export interface LegacyErrorHandlingOptions {
  level?: string; 
  severity?: string;
  source?: string;
  category?: string;
  message?: string;
  toastTitle?: string;
  toastDescription?: string;
  context?: Record<string, any>;
  originalError?: Error;
  suppressToast?: boolean;
  silent?: boolean;
  fingerprint?: string;
  reportToAnalytics?: boolean;
  technical?: boolean;
  user?: string | { id: string };
  [key: string]: any;
}

/**
 * Convert legacy error options to the new format
 * This is used to maintain backward compatibility with older code
 */
export function convertErrorOptions(
  legacyOptions: LegacyErrorHandlingOptions | undefined
): Partial<ErrorHandlingOptions> {
  if (!legacyOptions) return {};

  // Map severity/level to ErrorLevel enum
  let level: ErrorLevel | undefined;
  if (legacyOptions.level) {
    level = mapStringToErrorLevel(legacyOptions.level);
  } else if (legacyOptions.severity) {
    level = mapStringToErrorLevel(legacyOptions.severity);
  }

  // Map category/source to ErrorSource enum
  let source: ErrorSource | undefined;
  if (legacyOptions.source) {
    source = mapStringToErrorSource(legacyOptions.source);
  } else if (legacyOptions.category) {
    source = mapStringToErrorSource(legacyOptions.category);
  }

  // Map the rest of the options
  const result: Partial<ErrorHandlingOptions> = {
    level,
    source,
    message: legacyOptions.message,
    toastTitle: legacyOptions.toastTitle,
    toastDescription: legacyOptions.toastDescription,
    context: legacyOptions.context,
    originalError: legacyOptions.originalError,
    suppressToast: legacyOptions.suppressToast,
    silent: legacyOptions.silent,
    fingerprint: legacyOptions.fingerprint,
    reportToAnalytics: legacyOptions.reportToAnalytics,
    showToast: !legacyOptions.technical // Map technical flag to showToast
  };
  
  return result;
}

/**
 * Make the options compatible with the new error handling system
 * This is a convenience function to support backward compatibility
 */
export function compatibleErrorOptions(
  options: LegacyErrorHandlingOptions | Partial<ErrorHandlingOptions> | undefined
): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // If there are legacy properties, convert them
  if (
    'severity' in options || 
    'category' in options || 
    'technical' in options
  ) {
    return convertErrorOptions(options as LegacyErrorHandlingOptions);
  }
  
  // Otherwise, assume it's already in the new format
  return options as Partial<ErrorHandlingOptions>;
}

/**
 * Map string severity to ErrorLevel enum
 */
function mapStringToErrorLevel(level: string): ErrorLevel {
  const lowerLevel = level.toLowerCase();
  
  switch (lowerLevel) {
    case 'debug':
      return ErrorLevel.Debug;
    case 'info':
      return ErrorLevel.Info;
    case 'warning':
    case 'warn':
      return ErrorLevel.Warning;
    case 'error':
      return ErrorLevel.Error;
    case 'critical':
    case 'fatal':
      return ErrorLevel.Critical;
    default:
      return ErrorLevel.Error;
  }
}

/**
 * Map string category to ErrorSource enum
 */
function mapStringToErrorSource(source: string): ErrorSource {
  const lowerSource = source.toLowerCase();
  
  switch (lowerSource) {
    case 'user':
      return ErrorSource.User;
    case 'system':
      return ErrorSource.System;
    case 'network':
      return ErrorSource.Network;
    case 'database':
    case 'db':
      return ErrorSource.Database;
    case 'server':
      return ErrorSource.Server;
    case 'auth':
    case 'authentication':
      return ErrorSource.Auth;
    case 'validation':
      return ErrorSource.Validation;
    case 'ui':
    case 'interface':
      return ErrorSource.UI;
    case 'api':
      return ErrorSource.API;
    default:
      return ErrorSource.Unknown;
  }
}
