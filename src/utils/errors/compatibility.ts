
/**
 * Compatibility layer for error handling between legacy and new systems
 */

import { ErrorLevel, ErrorSource, ErrorHandlingOptions } from './types';
import { handleError as newHandleError } from './handle';

/**
 * Legacy error handling function that maps to the new system
 * 
 * @deprecated Use handleError from @/utils/errors directly
 */
export function legacyHandleError(error: Error | unknown, message: string, options?: any) {
  const newOptions: Partial<ErrorHandlingOptions> = {
    message,
    level: ErrorLevel.Error,
    source: ErrorSource.Unknown,
    context: {},
    silent: false,
    showToast: true,
    toastId: undefined,
    reportToAnalytics: true
  };
  
  if (options) {
    // Map legacy options to new format
    if (options.level) newOptions.level = convertLegacyLevel(options.level);
    if (options.source) newOptions.source = convertLegacySource(options.source);
    if (options.context) newOptions.context = options.context;
    if (options.silent !== undefined) newOptions.silent = options.silent;
    if (options.showToast !== undefined) newOptions.showToast = options.showToast;
    if (options.toastId) newOptions.toastId = options.toastId;
    if (options.reportToAnalytics !== undefined) newOptions.reportToAnalytics = options.reportToAnalytics;
  }
  
  newHandleError(error, newOptions);
}

/**
 * Convert legacy error level strings to new ErrorLevel enum
 */
function convertLegacyLevel(level: string): ErrorLevel {
  switch (level.toLowerCase()) {
    case 'debug':
      return ErrorLevel.Debug;
    case 'info':
      return ErrorLevel.Info;
    case 'warning':
      return ErrorLevel.Warning;
    case 'error':
      return ErrorLevel.Error;
    case 'critical':
      return ErrorLevel.Critical;
    default:
      return ErrorLevel.Error;
  }
}

/**
 * Convert legacy error source strings to new ErrorSource enum
 */
function convertLegacySource(source: string): ErrorSource {
  switch (source.toLowerCase()) {
    case 'api':
      return ErrorSource.API;
    case 'database':
      return ErrorSource.Database;
    case 'validation':
      return ErrorSource.Validation;
    case 'component':
      return ErrorSource.Component;
    case 'hook':
      return ErrorSource.Hook;
    default:
      return ErrorSource.Unknown;
  }
}

/**
 * Convert legacy options format to new ErrorHandlingOptions
 */
export function convertErrorOptions(legacyOptions: any): Partial<ErrorHandlingOptions> {
  const options: Partial<ErrorHandlingOptions> = {};
  
  if (!legacyOptions) return options;
  
  // Map level
  if (legacyOptions.level) {
    switch (legacyOptions.level.toLowerCase()) {
      case 'debug':
        options.level = ErrorLevel.Debug;
        break;
      case 'info':
        options.level = ErrorLevel.Info;
        break;
      case 'warning':
        options.level = ErrorLevel.Warning;
        break;
      case 'error':
        options.level = ErrorLevel.Error;
        break;
      case 'critical':
        options.level = ErrorLevel.Critical;
        break;
    }
  }
  
  // Map source
  if (legacyOptions.source) {
    options.source = ErrorSource.Unknown;
    
    if (typeof legacyOptions.source === 'string') {
      switch (legacyOptions.source.toLowerCase()) {
        case 'api':
          options.source = ErrorSource.API;
          break;
        case 'hook':
          options.source = ErrorSource.Hook;
          break;
        case 'component':
          options.source = ErrorSource.Component;
          break;
        case 'validation':
          options.source = ErrorSource.Validation;
          break;
        case 'database':
          options.source = ErrorSource.Database;
          break;
      }
    }
  }
  
  // Copy other properties
  if (legacyOptions.technical !== undefined) {
    options.showToast = !legacyOptions.technical;
  }
  
  if (legacyOptions.context) {
    options.context = legacyOptions.context;
  }
  
  if (legacyOptions.silent !== undefined) {
    options.silent = legacyOptions.silent;
  }
  
  return options;
}

// Re-export the handle function as default for backward compatibility
export { newHandleError as handleErrorWithMessage };

/**
 * Creates an error with context attached
 */
export function createContextualError(message: string, context: Record<string, any>): Error {
  const error = new Error(message);
  (error as any).context = context;
  return error;
}

// Export as default for backward compatibility
export default legacyHandleError;
