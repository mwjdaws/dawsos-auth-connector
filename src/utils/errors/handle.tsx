
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { StandardizedError, ErrorHandlingOptions } from './types';
import { generateErrorId } from './generateId';
import { ToastActionElement } from "@/components/ui/toast";
import { formatErrorMessage, formatUserErrorMessage } from './format';
import { isDuplicateError } from './deduplication';

// Error severity levels
export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';

// Error counter to prevent flooding users with duplicate errors
const errorCounter: Record<string, number> = {};

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
  error: unknown,
  userMessage?: string,
  options?: Partial<ErrorHandlingOptions>
) => {
  // Default options
  const defaultOptions: ErrorHandlingOptions = {
    level: 'error',
    context: {},
    silent: false,
    deduplicate: true
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Create standardized error object
  const standardizedError: StandardizedError = {
    id: generateErrorId(),
    originalError: error,
    message: formatErrorMessage(error),
    userMessage: userMessage || formatErrorMessage(error),
    level: opts.level,
    context: opts.context || {},
    timestamp: new Date(),
    code: error instanceof Error && 'code' in error ? (error as any).code : 'UNKNOWN'
  };

  // Check if we should deduplicate this error
  if (opts.deduplicate && isDuplicateError(standardizedError)) {
    console.debug('Duplicate error suppressed:', standardizedError);
    return;
  }
  
  // Log the error based on severity level
  switch (standardizedError.level) {
    case 'debug':
      console.debug('Debug error:', standardizedError);
      break;
    case 'info':
      console.info('Info error:', standardizedError);
      break;
    case 'warning':
      console.warn('Warning:', standardizedError);
      break;
    case 'critical':
      console.error('CRITICAL ERROR:', standardizedError);
      break;
    case 'error':
    default:
      console.error('Error:', standardizedError);
  }
  
  // If silent mode is requested, don't show toast
  if (opts.silent) {
    return;
  }
  
  // Create retry button if a retry function is provided
  let retryElement: ToastActionElement | undefined = undefined;
  if (opts.onRetry) {
    retryElement = (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => opts.onRetry?.()}
      >
        Retry
      </Button>
    );
  }
  
  // Show toast notification
  toast({
    title: standardizedError.level === 'critical' ? 'Critical Error' : 'Error',
    description: standardizedError.userMessage,
    variant: 'destructive',
    action: retryElement,
    duration: 5000
  });
  
  // Return the standardized error for further processing if needed
  return standardizedError;
};
