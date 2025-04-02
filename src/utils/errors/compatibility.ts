
/**
 * Compatibility layer for error handling system
 * 
 * This file provides utilities to maintain backward compatibility
 * with older error handling approaches as we evolve the system.
 */
import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';

/**
 * Legacy error handling options format
 */
export interface LegacyErrorHandlingOptions {
  level?: string;
  source?: string;
  message?: string;
  context?: any;
  silent?: boolean;
  showToast?: boolean;
  toastId?: string;
  reportToAnalytics?: boolean;
}

/**
 * Convert legacy options format to new format
 */
export function convertErrorOptions(options: string | LegacyErrorHandlingOptions | undefined): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // If options is a string, treat it as the message
  if (typeof options === 'string') {
    return { message: options };
  }
  
  // Convert legacy level strings to ErrorLevel enum
  let level: ErrorLevel | undefined = undefined;
  if (options.level) {
    switch (options.level.toLowerCase()) {
      case 'debug': level = ErrorLevel.Debug; break;
      case 'info': level = ErrorLevel.Info; break;
      case 'warning': level = ErrorLevel.Warning; break;
      case 'error': level = ErrorLevel.Error; break;
      case 'critical': level = ErrorLevel.Critical; break;
    }
  }
  
  // Convert legacy source strings to ErrorSource enum
  let source: ErrorSource | undefined = undefined;
  if (options.source) {
    switch (options.source.toLowerCase()) {
      case 'user': source = ErrorSource.User; break;
      case 'app': source = ErrorSource.Application; break;
      case 'api': source = ErrorSource.API; break;
      case 'component': source = ErrorSource.Component; break;
      case 'hook': source = ErrorSource.Hook; break;
      case 'database': source = ErrorSource.Database; break;
      case 'network': source = ErrorSource.Network; break;
      case 'service': source = ErrorSource.Service; break;
    }
  }
  
  return {
    level, 
    source,
    message: options.message,
    context: options.context,
    silent: options.silent,
    showToast: options.showToast,
    toastId: options.toastId,
    reportToAnalytics: options.reportToAnalytics
  };
}

/**
 * Make options compatible with both old and new systems
 */
export function compatibleErrorOptions(options: ErrorHandlingOptions): ErrorHandlingOptions & LegacyErrorHandlingOptions {
  return {
    ...options,
    // Add any legacy properties needed for backward compatibility
  };
}
