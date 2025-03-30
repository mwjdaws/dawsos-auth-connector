
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { ApiError } from '@/utils/errors/types';

// Export common utilities
export { supabase, handleError, ApiError };

// Export a helper function to parse Supabase error codes
export function parseSupabaseErrorCode(error: any): number {
  if (!error || !error.code) return 500;
  return typeof error.code === 'string' ? parseInt(error.code) : error.code;
}
