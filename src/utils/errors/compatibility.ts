
import { ErrorHandlingOptions, ErrorLevel } from './types';

/**
 * Compatibility layer for error handling options
 * 
 * This handles legacy error options that might still be used in the codebase
 */
export interface LegacyErrorHandlingOptions {
  level?: ErrorLevel;
  technical?: boolean;  // Legacy property
  silent?: boolean;
  context?: Record<string, any>;
  toastTitle?: string;
  fingerprint?: string;
  category?: string;
  [key: string]: any;
}

/**
 * Convert legacy error handling options to current format
 */
export function convertErrorOptions(options?: LegacyErrorHandlingOptions): Partial<ErrorHandlingOptions> {
  if (!options) return {};
  
  const { technical, category, ...standardOptions } = options;
  
  // Handle special properties
  const newOptions: Partial<ErrorHandlingOptions> = {
    ...standardOptions,
    // If technical is true, don't show toast (unless explicitly set)
    showToast: technical === true 
      ? options.showToast ?? false
      : options.showToast ?? true
  };
  
  return newOptions;
}

/**
 * Alias for convertErrorOptions for backward compatibility
 */
export const convertLegacyOptions = convertErrorOptions;
