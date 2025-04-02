
/**
 * Error handling compatibility utilities
 */

import { 
  ErrorHandlingOptions, 
  LegacyErrorHandlingOptions,
  ErrorLevel,
  ErrorSource
} from './types';

/**
 * Convert legacy error options to the new format
 */
export function convertErrorOptions(legacyOptions?: LegacyErrorHandlingOptions): Partial<ErrorHandlingOptions> {
  if (!legacyOptions) {
    return {};
  }
  
  // Handle case where legacy options is just a string (assumed to be message)
  if (typeof legacyOptions === 'string') {
    return { message: legacyOptions };
  }
  
  // Map legacy error level strings to ErrorLevel enum
  let level: ErrorLevel | undefined;
  if (legacyOptions.level) {
    switch (legacyOptions.level.toLowerCase()) {
      case 'debug':
      case 'DEBUG':
        level = ErrorLevel.Debug;
        break;
      case 'info':
      case 'INFO':
        level = ErrorLevel.Info;
        break;
      case 'warning':
      case 'WARNING':
      case 'warn':
      case 'WARN':
        level = ErrorLevel.Warning;
        break;
      case 'error':
      case 'ERROR':
        level = ErrorLevel.Error;
        break;
      case 'critical':
      case 'CRITICAL':
        level = ErrorLevel.Critical;
        break;
      default:
        level = ErrorLevel.Error;
    }
  }
  
  // Map legacy source strings to ErrorSource enum
  let source: ErrorSource | undefined;
  if (legacyOptions.source) {
    switch (legacyOptions.source.toLowerCase()) {
      case 'database':
      case 'db':
        source = ErrorSource.Database;
        break;
      case 'api':
        source = ErrorSource.API;
        break;
      case 'user':
        source = ErrorSource.User;
        break;
      case 'system':
        source = ErrorSource.System;
        break;
      case 'component':
      case 'ui':
        source = ErrorSource.Component;
        break;
      case 'hook':
        source = ErrorSource.Hook;
        break;
      case 'service':
        source = ErrorSource.Service;
        break;
      case 'auth':
      case 'authentication':
        source = ErrorSource.Authentication;
        break;
      case 'storage':
        source = ErrorSource.Storage;
        break;
      case 'validation':
        source = ErrorSource.Validation;
        break;
      case 'external':
        source = ErrorSource.External;
        break;
      case 'app':
        source = ErrorSource.App;
        break;
      default:
        source = ErrorSource.Unknown;
    }
  }
  
  // Convert legacy options to new format
  return {
    level,
    source,
    message: legacyOptions.message,
    context: legacyOptions.context,
    reportToAnalytics: legacyOptions.shouldReport,
    showToast: legacyOptions.showToast,
    silent: legacyOptions.silent,
    suppressToast: legacyOptions.suppressToast,
    toastId: legacyOptions.toastId,
    technical: legacyOptions.technical,
    originalError: legacyOptions.originalError,
    fingerprint: legacyOptions.fingerprint
  };
}

/**
 * Make error options compatible with both old and new error handlers
 * for backward compatibility during migration
 */
export function compatibleErrorOptions(options?: Partial<ErrorHandlingOptions>): LegacyErrorHandlingOptions & ErrorHandlingOptions {
  if (!options) {
    return {
      level: ErrorLevel.Error,
      source: ErrorSource.Unknown,
      shouldReport: true,
      showToast: true,
      silent: false,
      reportToAnalytics: true
    };
  }
  
  return {
    ...options,
    level: options.level || ErrorLevel.Error,
    source: options.source || ErrorSource.Unknown,
    shouldReport: options.reportToAnalytics !== undefined ? options.reportToAnalytics : true,
    reportToAnalytics: options.reportToAnalytics !== undefined ? options.reportToAnalytics : true,
    showToast: options.showToast !== undefined ? options.showToast : true,
    silent: options.silent !== undefined ? options.silent : false
  };
}
