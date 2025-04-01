
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { ErrorLevel, ErrorSource } from '@/utils/errors/types';
import { createApiError } from '@/utils/errors/types/api-errors';

export { supabase };
export { handleError };

/**
 * Parse Supabase error code into a more user-friendly error message
 */
export function parseSupabaseErrorCode(code: string): string {
  switch (code) {
    case '22P02':
      return 'Invalid input syntax';
    case '23505':
      return 'Duplicate entry exists';
    case '23503':
      return 'Referenced record does not exist';
    case '42P01':
      return 'Table does not exist';
    case '42703':
      return 'Column does not exist';
    case '42883':
      return 'Function does not exist';
    case '22003':
      return 'Numeric value out of range';
    case '22007':
      return 'Invalid date/time format';
    case '22008':
      return 'Date/time field overflow';
    case '22P05':
      return 'Invalid binary string format';
    default:
      return `Database error (${code})`;
  }
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(
  error: any,
  message: string,
  context: Record<string, any> = {}
): never {
  // Create a structured API error
  const apiError = createApiError(
    message,
    error?.status || 500,
    error?.statusText || 'Internal Error',
    context?.url || '',
    context?.method || 'GET',
    error?.data,
    context
  );
  
  // Handle the error using the central error handler
  handleError(apiError, message, {
    source: ErrorSource.Api,
    level: ErrorLevel.Error,
    context
  });
  
  // Re-throw to allow caller to handle if necessary
  throw apiError;
}
