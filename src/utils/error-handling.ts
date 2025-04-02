
import { toast } from '@/hooks/use-toast';
import { handleError } from './errors/handle';
import { ErrorLevel, ErrorSource } from './errors/types';

/**
 * Simplified error handler for components and hooks
 * 
 * This is a convenience wrapper around the more complex error handling system
 * that provides a simple interface for common error handling needs.
 * 
 * @param error The error object
 * @param message A user-friendly error message
 * @param options Additional options
 */
export function handleError(
  error: Error | unknown,
  message: string,
  options: {
    level?: ErrorLevel | string;
    technical?: boolean;
    showToast?: boolean;
    source?: ErrorSource | string;
    context?: Record<string, any>;
  } = {}
): void {
  // Convert options to the format expected by the core error handler
  const errorLevel = typeof options.level === 'string' 
    ? convertStringToErrorLevel(options.level) 
    : (options.level || ErrorLevel.Error);
    
  const errorSource = typeof options.source === 'string'
    ? convertStringToErrorSource(options.source)
    : (options.source || ErrorSource.Unknown);
  
  handleError(error, {
    message,
    level: errorLevel,
    source: errorSource,
    context: options.context || {},
    showToast: options.showToast !== false
  });
}

/**
 * Convert a string representation of error level to enum
 */
function convertStringToErrorLevel(level: string): ErrorLevel {
  const normalizedLevel = level.toLowerCase();
  
  switch (normalizedLevel) {
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
 * Convert a string representation of error source to enum
 */
function convertStringToErrorSource(source: string): ErrorSource {
  const normalizedSource = source.toLowerCase();
  
  switch (normalizedSource) {
    case 'component':
      return ErrorSource.Component;
    case 'hook':
      return ErrorSource.Hook;
    case 'api':
      return ErrorSource.API;
    case 'database':
      return ErrorSource.Database;
    case 'validation':
      return ErrorSource.Validation;
    case 'auth':
      return ErrorSource.Auth;
    default:
      return ErrorSource.Unknown;
  }
}

// Export error enums for easy access
export { ErrorLevel, ErrorSource };

export default handleError;
