
/**
 * Error categorization utilities
 */
import { ErrorCategory } from './types';

/**
 * Categorize errors to help with handling strategies
 */
export const categorizeError = (error: unknown): ErrorCategory => {
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : typeof error === 'string' 
      ? error.toLowerCase() 
      : '';

  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') || 
      errorMessage.includes('connection')) {
    return 'network';
  }
  
  if (errorMessage.includes('auth') || 
      errorMessage.includes('permission') || 
      errorMessage.includes('unauthorized')) {
    return 'authentication';
  }
  
  if (errorMessage.includes('timeout') || 
      errorMessage.includes('time out') || 
      errorMessage.includes('timed out')) {
    return 'timeout';
  }
  
  if (errorMessage.includes('not found') || 
      errorMessage.includes('404') || 
      errorMessage.includes('missing')) {
    return 'not_found';
  }
  
  if (errorMessage.includes('validation') || 
      errorMessage.includes('invalid') || 
      errorMessage.includes('required')) {
    return 'validation';
  }
  
  if (errorMessage.includes('database') || 
      errorMessage.includes('db') || 
      errorMessage.includes('supabase')) {
    return 'database';
  }
  
  return 'unknown';
}
