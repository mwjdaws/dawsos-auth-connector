
/**
 * Content Validation Utilities
 */
import { validate as validateUUID } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a content ID exists in the database
 */
export async function checkContentExists(contentId: string): Promise<boolean> {
  try {
    if (!isValidContentId(contentId)) return false;
    
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('id')
      .eq('id', contentId)
      .single();
      
    return !error && !!data;
  } catch (error) {
    console.error('Error checking if content exists:', error);
    return false;
  }
}

/**
 * Check if a string is a valid UUID
 */
export function isUUID(str: string): boolean {
  return validateUUID(str);
}

/**
 * Check if a content ID is valid (either a UUID or a temporary ID starting with 'temp-')
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return isUUID(contentId) || contentId.startsWith('temp-');
}

/**
 * Check if a content ID is storable (is a UUID and not a temporary ID)
 */
export function isStorableContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  return isUUID(contentId);
}

/**
 * Try to convert a string to a UUID, returning null if invalid
 */
export function tryConvertToUUID(str: string): string | null {
  return isUUID(str) ? str : null;
}

/**
 * Try to parse a content ID as a UUID, returning null if not a UUID
 */
export function tryParseContentIdAsUUID(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  return isUUID(contentId) ? contentId : null;
}
