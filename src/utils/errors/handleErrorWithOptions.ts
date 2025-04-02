
import { handleError } from './handle';
import { ErrorLevel, ErrorSource } from './types';

/**
 * Simplified error handler with correct parameter order
 * to fix the common pattern of passing level as third parameter
 */
export function handleErrorWithOptions(
  error: Error | unknown,
  message: string,
  options: {
    level?: ErrorLevel;
    source?: ErrorSource;
    context?: Record<string, any>;
    silent?: boolean;
    showToast?: boolean;
    reportToAnalytics?: boolean;
  } = {}
) {
  handleError(error, {
    message,
    level: options.level || ErrorLevel.Error,
    source: options.source || ErrorSource.Unknown,
    context: options.context || {},
    silent: options.silent || false,
    showToast: options.showToast !== false, // Default to true
    reportToAnalytics: options.reportToAnalytics !== false // Default to true
  });
}

// Helper function to adapt calls from old format to new format
export function handleErrorWithLevel(
  error: Error | unknown,
  message: string,
  level: string | ErrorLevel
) {
  // Convert string level to enum value
  let errorLevel: ErrorLevel;
  
  if (typeof level === 'string') {
    // Handle case where uppercase strings were used (like 'WARNING')
    switch (level.toUpperCase()) {
      case 'DEBUG':
        errorLevel = ErrorLevel.Debug;
        break;
      case 'INFO':
        errorLevel = ErrorLevel.Info;
        break;
      case 'WARNING':
        errorLevel = ErrorLevel.Warning;
        break;
      case 'ERROR':
        errorLevel = ErrorLevel.Error;
        break;
      case 'CRITICAL':
        errorLevel = ErrorLevel.Critical;
        break;
      default:
        errorLevel = ErrorLevel.Error;
    }
  } else {
    errorLevel = level;
  }
  
  handleError(error, {
    message,
    level: errorLevel
  });
}

export default handleErrorWithOptions;
