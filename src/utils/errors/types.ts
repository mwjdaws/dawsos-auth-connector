
/**
 * Error handling types
 */

export enum ErrorLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
  
  // Backward compatibility with string error levels
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorSource {
  API = 'api',
  Database = 'database',
  Component = 'component',
  Hook = 'hook',
  Service = 'service',
  Utils = 'utils',
  User = 'user',
  System = 'system',
  Unknown = 'unknown'
}

export type ErrorContext = Record<string, any>;

export interface ErrorHandlingOptions {
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  toastTitle?: string;
  toastDescription?: string;
  error?: Error;
  context?: ErrorContext;
  reportToAnalytics?: boolean;
  silent?: boolean;
  showToast?: boolean;
}

export type ErrorHandlingFunction = (error: Error | string, options?: Partial<ErrorHandlingOptions>) => void;

export interface ErrorMetadata {
  timestamp: string;
  userId?: string;
  sessionId?: string;
  source: ErrorSource;
  level: ErrorLevel;
  browser?: string;
  os?: string;
  url?: string;
  component?: string;
  context?: ErrorContext;
}

export type ErrorHandlerCreator = (defaultOptions?: Partial<ErrorHandlingOptions>) => ErrorHandlingFunction;

export interface ErrorHandlerFactory {
  createComponentErrorHandler: (componentName: string) => ErrorHandlingFunction;
  createHookErrorHandler: (hookName: string) => ErrorHandlingFunction;
  createServiceErrorHandler: (serviceName: string) => ErrorHandlingFunction;
}
