
import { toast } from '@/hooks/use-toast';

/**
 * Error severity levels
 */
export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical'
}

/**
 * Error source categories
 */
export enum ErrorSource {
  Unknown = 'unknown',
  User = 'user',
  Component = 'component',
  Hook = 'hook',
  Service = 'service',
  API = 'api',
  Database = 'database',
  Network = 'network',
  Auth = 'auth',
  Storage = 'storage',
  Edge = 'edge',
  System = 'system',
  External = 'external',
  Validation = 'validation',
  App = 'app'
}

/**
 * Options for error handling
 */
export interface ErrorHandlingOptions {
  level?: ErrorLevel;
  source?: ErrorSource;
  message: string;
  context?: Record<string, any>;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  suppressToast?: boolean;
  silent?: boolean;
  toastId?: string;
  toastTitle?: string;
  fingerprint?: string;
  originalError?: Error;
  technical?: string;
}

/**
 * Centralized error handler function
 *
 * @param error The original error
 * @param options Options for handling the error or a simple message string
 */
export function handleError(
  error: Error | unknown,
  options?: string | Partial<ErrorHandlingOptions>
): void {
  // Default options
  const defaultOptions: ErrorHandlingOptions = {
    level: ErrorLevel.Error,
    source: ErrorSource.Unknown,
    message: error instanceof Error ? error.message : String(error),
    context: {},
    reportToAnalytics: true,
    showToast: true,
    suppressToast: false,
    silent: false
  };

  // Convert string options to object
  const parsedOptions: Partial<ErrorHandlingOptions> = 
    typeof options === 'string' 
      ? { message: options } 
      : options || {};

  // Merge options
  const finalOptions = { ...defaultOptions, ...parsedOptions };

  // Log the error
  if (!finalOptions.silent) {
    console.error(
      `[${finalOptions.level?.toUpperCase()}] ${finalOptions.message}`,
      { error, ...finalOptions.context }
    );
  }

  // Show toast notification if enabled
  if (finalOptions.showToast && !finalOptions.suppressToast && !finalOptions.silent) {
    toast({
      title: finalOptions.toastTitle || `Error: ${finalOptions.level}`,
      description: finalOptions.message,
      variant: 'destructive',
    });
  }

  // Report to analytics if enabled
  if (finalOptions.reportToAnalytics && !finalOptions.silent) {
    // Analytics reporting would go here
    // This is a placeholder for future implementation
  }
}
