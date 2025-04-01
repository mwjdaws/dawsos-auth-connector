
/**
 * Error Handling Types
 * 
 * Centralized type definitions for the error handling system
 */

// Error severity levels
export enum ErrorLevel {
  Debug = "debug",
  Info = "info",
  Warning = "warning",
  Error = "error"
}

// Source of errors for categorization
export enum ErrorSource {
  // Core sources
  Unknown = "unknown",
  Database = "database",
  API = "api",
  User = "user",
  System = "system",
  
  // More specific sources
  Utils = "utils",
  Component = "component",
  Hook = "hook",
  Service = "service",
  
  // Specialized sources for better categorization
  Authentication = "auth",
  Storage = "storage",
  Validation = "validation",
  External = "external",
  
  // Legacy API compatibility
  Network = "network",
  Auth = "auth",
  Server = "server",
  UI = "ui"
}

// Core error handling options
export interface ErrorHandlingOptions {
  level: ErrorLevel;
  source?: ErrorSource;
  message?: string;
  context?: Record<string, any>;
  reportToAnalytics?: boolean;
  showToast?: boolean;
  silent?: boolean;
  toastTitle?: string;
  fingerprint?: string;
  // New options
  suppressToast?: boolean;
  toastId?: string;
  technical?: boolean;
  originalError?: any;
}

// Legacy format error handling options for backward compatibility
export interface LegacyErrorHandlingOptions {
  level: string;
  source: string;
  message: string;
  shouldReport: boolean;
  showToast: boolean;
  silent: boolean;
  technical?: boolean;
  context?: Record<string, any>;
  fingerprint?: string;
  suppressToast?: boolean;
  toastId?: string;
  originalError?: any;
}

// Default error options
export const defaultErrorOptions: ErrorHandlingOptions = {
  level: ErrorLevel.Error,
  source: ErrorSource.Unknown,
  reportToAnalytics: true,
  showToast: true,
  silent: false
};
