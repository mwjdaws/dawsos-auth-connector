
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './errors/types';

/**
 * Interface for legacy error handling options
 */
export interface LegacyErrorHandlingOptions {
  level?: string;
  silent?: boolean;
  toastTitle?: string;
  retryCount?: number;
  context?: Record<string, any>;
  suppressToast?: boolean;
  technical?: string;
  [key: string]: any;
}

/**
 * Convert legacy error options to the new format
 */
export function convertErrorOptions(options?: LegacyErrorHandlingOptions): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  const result: Partial<ErrorHandlingOptions> = { ...options };
  
  // Convert string level to enum if needed
  if (typeof options.level === 'string') {
    switch (options.level.toLowerCase()) {
      case 'debug':
        result.level = ErrorLevel.Debug;
        break;
      case 'info':
        result.level = ErrorLevel.Info;
        break;
      case 'warning':
        result.level = ErrorLevel.Warning;
        break;
      case 'error':
        result.level = ErrorLevel.Error;
        break;
      case 'critical':
        result.level = ErrorLevel.Critical;
        break;
    }
  }
  
  // Preserve retryCount for backward compatibility if needed
  if (options.retryCount !== undefined && result.context) {
    result.context.retryCount = options.retryCount;
  }
  
  return result;
}

/**
 * Function to ensure backward compatibility with older error handling code
 */
export function compatibleErrorOptions(
  options?: Partial<ErrorHandlingOptions> | LegacyErrorHandlingOptions
): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  // Check if this is a legacy options object
  if (
    typeof options.level === 'string' ||
    'retryCount' in options ||
    'technical' in options
  ) {
    return convertErrorOptions(options as LegacyErrorHandlingOptions);
  }
  
  // Already in the right format
  return options as Partial<ErrorHandlingOptions>;
}
