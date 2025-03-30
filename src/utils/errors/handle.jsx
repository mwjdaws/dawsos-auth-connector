
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { generateErrorId } from './generateId';
import { isDuplicateError } from './deduplication';
import { formatErrorMessage, formatUserErrorMessage } from './format';

// Error severity levels
export const ErrorSeverity = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Error counter to prevent flooding users with duplicate errors
const errorCounter = {};

/**
 * Centralized error handling function
 * 
 * This function standardizes error handling throughout the application
 * ensuring consistent user feedback and error tracking.
 * 
 * @param error The error object or message
 * @param userMessage Optional user-friendly message
 * @param options Additional error handling options
 */
export const handleError = (
  error,
  userMessage,
  options = {}
) => {
  // Default options
  const defaultOptions = {
    level: ErrorSeverity.ERROR,
    context: {},
    silent: false,
    deduplicate: true,
    onRetry: undefined,
    title: undefined,
    duration: 5000
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Create standardized error object
  const standardizedError = {
    id: generateErrorId(),
    originalError: error,
    message: formatErrorMessage(error),
    userMessage: userMessage || formatUserErrorMessage(error),
    level: opts.level,
    context: opts.context || {},
    timestamp: new Date(),
    code: error instanceof Error && 'code' in error ? error.code : 'UNKNOWN'
  };

  // Check if we should deduplicate this error
  if (opts.deduplicate && isDuplicateError(standardizedError)) {
    console.debug('Duplicate error suppressed:', standardizedError);
    return;
  }
  
  // Log the error based on severity level
  switch (standardizedError.level) {
    case ErrorSeverity.DEBUG:
      console.debug('Debug error:', standardizedError);
      break;
    case ErrorSeverity.INFO:
      console.info('Info error:', standardizedError);
      break;
    case ErrorSeverity.WARNING:
      console.warn('Warning:', standardizedError);
      break;
    case ErrorSeverity.CRITICAL:
      console.error('CRITICAL ERROR:', standardizedError);
      break;
    case ErrorSeverity.ERROR:
    default:
      console.error('Error:', standardizedError);
  }
  
  // If silent mode is requested, don't show toast
  if (opts.silent) {
    return standardizedError;
  }
  
  // Create retry button if a retry function is provided
  let retryElement = undefined;
  if (opts.onRetry) {
    retryElement = (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => opts.onRetry()}
      >
        Retry
      </Button>
    );
  }
  
  // Show toast notification
  toast({
    title: opts.title || (standardizedError.level === ErrorSeverity.CRITICAL ? 'Critical Error' : 'Error'),
    description: standardizedError.userMessage,
    variant: 'destructive',
    action: retryElement,
    duration: opts.duration
  });
  
  // Return the standardized error for further processing if needed
  return standardizedError;
};
