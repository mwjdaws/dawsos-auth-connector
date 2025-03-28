
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { handleError } from './error-handling';

/**
 * Common error codes from Supabase/PostgreSQL and their human-readable messages
 */
const errorCodeMessages: Record<string, string> = {
  '23505': 'Duplicate entry: This record already exists.', // unique_violation
  '23503': 'Referenced record does not exist.', // foreign_key_violation
  '23502': 'Required field is missing.', // not_null_violation 
  '42P01': 'Database table does not exist. Please contact support.', // undefined_table
  '42703': 'Database column does not exist. Please contact support.', // undefined_column
  '42601': 'SQL syntax error. Please contact support.', // syntax_error
  '42501': 'Permission denied: Your account does not have access to this operation.', // insufficient_privilege
  '28P01': 'Invalid login credentials.',  // invalid_password
  '3D000': 'Database does not exist. Please contact support.', // invalid_catalog_name
  '3F000': 'Schema does not exist. Please contact support.', // invalid_schema_name
  '08003': 'Connection to database lost. Please try again.', // connection_failure
  '08006': 'Connection failure. Please try again.', // connection_failure
  '23514': 'Check constraint violation.', // check_violation
  '57014': 'Query cancelled due to timeout. Please try a simpler query.', // query_canceled
  '53100': 'Disk full or out of memory. Please try again later.', // disk_full
  '53200': 'Out of memory. Please try again later.', // out_of_memory
  '53300': 'Too many connections. Please try again later.', // too_many_connections
  '55P03': 'Too many connections to database. Please try again later.' // too_many_connections
};

/**
 * Get a user-friendly message for a database error code
 */
export function getErrorMessage(code?: string): string {
  if (!code) return 'An unknown database error occurred.';
  return errorCodeMessages[code] || `Database error code ${code}.`;
}

/**
 * Parse an error code from a Supabase error
 */
export function parseErrorCode(error?: PostgrestError | null): string | undefined {
  if (!error) return undefined;
  
  // Some error codes are returned as strings that need to be parsed
  if (error.code) {
    if (typeof error.code === 'string') {
      // Sometimes the code is in a format like "PGRST301"
      const matches = error.code.match(/\d+/);
      return matches ? matches[0] : error.code;
    }
    return String(error.code);
  }
  
  // Sometimes the code is in the details or hint
  if (error.details && typeof error.details === 'string') {
    const matches = error.details.match(/\b\d{5}\b/);
    return matches ? matches[0] : undefined;
  }
  
  return undefined;
}

/**
 * Handles a Supabase error with user-friendly messages
 */
export function handleSupabaseError(
  error: PostgrestError | null | unknown,
  fallbackMessage = "An error occurred with the database operation",
  options: { 
    showToast?: boolean;
    logToConsole?: boolean;
    actionLabel?: string;
    action?: () => void;
  } = {}
): void {
  const { showToast = true, logToConsole = true, actionLabel, action } = options;
  
  if (!error) return;
  
  let message = fallbackMessage;
  let errorCode: string | undefined;
  
  // Handle PostgrestError type
  if (error && typeof error === 'object' && 'code' in error) {
    const pgError = error as PostgrestError;
    errorCode = parseErrorCode(pgError);
    
    if (errorCode) {
      message = getErrorMessage(errorCode);
    } else if (pgError.message) {
      message = pgError.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  if (logToConsole) {
    console.error('Supabase operation error:', error);
    if (errorCode) {
      console.error(`Error code: ${errorCode}`);
    }
  }
  
  if (showToast) {
    handleError(error, message, {
      title: 'Database Error',
      actionLabel,
      action
    });
  }
}

/**
 * Helper for safely handling Supabase operations with proper error handling
 */
export async function safeDbOperation<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  errorMessage = "An error occurred with the database operation",
  options: {
    showToast?: boolean;
    logToConsole?: boolean;
    handleResult?: (data: T | null) => void;
    onError?: (error: PostgrestError | null) => void;
  } = {}
): Promise<T | null> {
  const { showToast = true, logToConsole = true, handleResult, onError } = options;
  
  try {
    const { data, error } = await operation();
    
    if (error) {
      handleSupabaseError(error, errorMessage, { showToast, logToConsole });
      if (onError) onError(error);
      return null;
    }
    
    if (handleResult) handleResult(data);
    return data;
  } catch (error) {
    handleSupabaseError(error, errorMessage, { showToast, logToConsole });
    if (onError) onError(null);
    return null;
  }
}
