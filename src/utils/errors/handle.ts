
import { toast } from '@/hooks/use-toast';
import { ErrorHandlingOptions, ErrorLevel, ErrorSource } from './types';
import { convertErrorOptions } from './compatibility';

/**
 * Default error handler with toast notifications
 */
export function handleError(error: Error | unknown, options?: Partial<ErrorHandlingOptions> | string) {
  const errorOptions = convertErrorOptions(options);
  const level = errorOptions.level ?? ErrorLevel.Error;
  const source = errorOptions.source ?? ErrorSource.Unknown;
  
  // Convert error to an Error object if it's not already
  const err = error instanceof Error ? error : new Error(String(error));
  
  // Log the error to console with appropriate level
  if (level >= ErrorLevel.Error) {
    console.error(`[${source}] ${errorOptions.message || err.message}`, err, errorOptions.context || {});
  } else if (level === ErrorLevel.Warning) {
    console.warn(`[${source}] ${errorOptions.message || err.message}`, err, errorOptions.context || {});
  } else {
    console.log(`[${source}] ${errorOptions.message || err.message}`, err, errorOptions.context || {});
  }
  
  // Display toast notification if not suppressed
  if (!errorOptions.suppressToast && level >= ErrorLevel.Warning) {
    // Generate a unique ID for deduplication
    const id = `${source}-${(errorOptions.message || err.message).slice(0, 20)}-${Date.now()}`;
    
    toast({
      id,
      title: errorOptions.toastTitle || 'Error',
      description: errorOptions.toastDescription || errorOptions.message || err.message,
      variant: level >= ErrorLevel.Error ? 'destructive' : 'default'
    });
  }
  
  // Return the error to allow for chaining
  return err;
}

/**
 * Factory for creating component-specific error handlers
 */
export function createComponentErrorHandler(componentName: string) {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const errorOptions = convertErrorOptions(options);
    
    return handleError(error, {
      ...errorOptions,
      source: errorOptions.source ?? ErrorSource.UI,
      context: {
        ...errorOptions.context,
        component: componentName
      }
    });
  };
}

/**
 * Factory for creating hook-specific error handlers
 */
export function createHookErrorHandler(hookName: string) {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const errorOptions = convertErrorOptions(options);
    
    return handleError(error, {
      ...errorOptions,
      source: errorOptions.source ?? ErrorSource.UI,
      context: {
        ...errorOptions.context,
        hook: hookName
      }
    });
  };
}

/**
 * Factory for creating service-specific error handlers
 */
export function createServiceErrorHandler(serviceName: string) {
  return (error: Error | unknown, options?: Partial<ErrorHandlingOptions> | string) => {
    const errorOptions = convertErrorOptions(options);
    
    return handleError(error, {
      ...errorOptions,
      source: errorOptions.source ?? ErrorSource.System,
      context: {
        ...errorOptions.context,
        service: serviceName
      }
    });
  };
}

// Export an ErrorBoundary compatible error handler
export const reportError = (error: Error | unknown, info?: React.ErrorInfo) => {
  return handleError(error, {
    source: ErrorSource.UI,
    level: ErrorLevel.Error,
    context: { errorInfo: info }
  });
};
