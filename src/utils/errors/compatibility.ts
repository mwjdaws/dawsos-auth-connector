
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';

/**
 * Legacy error handling options structure for backward compatibility
 */
export interface LegacyErrorHandlingOptions {
  level?: string;
  source?: string;
  message?: string;
  shouldReport?: boolean;
  showToast?: boolean;
  silent?: boolean;
  context?: Record<string, any>;
  suppressToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  toastId?: string;
  fingerprint?: string;
  technical?: string;
  originalError?: Error;
}

/**
 * Convert legacy error options to new format
 */
export function convertErrorOptions(options?: LegacyErrorHandlingOptions): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // Map old level string values to ErrorLevel enum
  let level: ErrorLevel | undefined;
  if (options.level) {
    switch (options.level.toLowerCase()) {
      case 'debug':
        level = ErrorLevel.Debug;
        break;
      case 'info':
        level = ErrorLevel.Info;
        break;
      case 'warning':
        level = ErrorLevel.Warning;
        break;
      case 'warn':
        level = ErrorLevel.Warning;
        break;
      case 'error':
        level = ErrorLevel.Error;
        break;
      case 'critical':
        level = ErrorLevel.Critical;
        break;
      default:
        level = ErrorLevel.Error;
    }
  }
  
  // Map old source string values to ErrorSource enum
  let source: ErrorSource | undefined;
  if (options.source) {
    switch (options.source.toLowerCase()) {
      case 'component':
        source = ErrorSource.Component;
        break;
      case 'hook':
        source = ErrorSource.Hook;
        break;
      case 'service':
        source = ErrorSource.Service;
        break;
      case 'util':
        source = ErrorSource.Util;
        break;
      case 'api':
        source = ErrorSource.Api;
        break;
      case 'database':
        source = ErrorSource.Database;
        break;
      case 'network':
        source = ErrorSource.Network;
        break;
      case 'server':
        source = ErrorSource.Server;
        break;
      case 'auth':
        source = ErrorSource.Auth;
        break;
      case 'validation':
        source = ErrorSource.Validation;
        break;
      case 'ui':
        source = ErrorSource.UI;
        break;
      default:
        source = ErrorSource.Unknown;
    }
  }
  
  // Construct modern error options
  return {
    level,
    source,
    message: options.message,
    reportToAnalytics: options.shouldReport,
    showToast: options.showToast,
    silent: options.silent,
    context: options.context,
    suppressToast: options.suppressToast,
    toastTitle: options.toastTitle,
    toastDescription: options.toastDescription,
    toastId: options.toastId,
    fingerprint: options.fingerprint,
    technical: options.technical,
    originalError: options.originalError
  };
}

/**
 * Convert error options from new format to legacy format for backward compatibility
 */
export function compatibleErrorOptions(options: Partial<ErrorHandlingOptions>): LegacyErrorHandlingOptions {
  return {
    level: options.level?.toString(),
    source: options.source?.toString(),
    message: options.message,
    shouldReport: options.reportToAnalytics,
    showToast: options.showToast,
    silent: options.silent,
    context: options.context,
    suppressToast: options.suppressToast,
    toastTitle: options.toastTitle,
    toastDescription: options.toastDescription,
    toastId: options.toastId,
    fingerprint: options.fingerprint,
    technical: options.technical,
    originalError: options.originalError
  };
}
