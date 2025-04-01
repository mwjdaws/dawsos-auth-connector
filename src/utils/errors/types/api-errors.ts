
/**
 * API error related types
 */
import { ErrorLevel, ErrorSource } from '../types';

/**
 * API Error interface
 */
export interface ApiError extends Error {
  status: number;
  statusText: string;
  url: string;
  method: string;
  responseData: any;
  context: Record<string, any>;
  source: ErrorSource.Api;
  level: ErrorLevel;
}

/**
 * Factory function to create API errors
 */
export function createApiError(
  message: string,
  status: number,
  statusText: string = '',
  url: string = '',
  method: string = 'GET',
  responseData: any = null,
  context: Record<string, any> = {}
): ApiError {
  const error = new Error(message) as ApiError;
  
  error.name = 'ApiError';
  error.status = status;
  error.statusText = statusText;
  error.url = url;
  error.method = method;
  error.responseData = responseData;
  error.context = context;
  error.source = ErrorSource.Api;
  error.level = status >= 500 ? ErrorLevel.Error : ErrorLevel.Warning;
  
  return error;
}

/**
 * Factory function for network connection errors
 */
export function createNetworkError(
  url: string = '',
  method: string = 'GET',
  context: Record<string, any> = {}
): ApiError {
  return createApiError(
    'Network connection error',
    0,
    'Failed to connect',
    url,
    method,
    null,
    context
  );
}

/**
 * Factory function for request timeout errors
 */
export function createTimeoutError(
  url: string = '',
  method: string = 'GET',
  timeoutMs: number = 30000,
  context: Record<string, any> = {}
): ApiError {
  return createApiError(
    `Request timed out after ${timeoutMs}ms`,
    0,
    'Timeout',
    url,
    method,
    null,
    context
  );
}
