
import { v4 as uuidv4, validate as validateUUID } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdValidationResult, ContentIdValidationResultType, createContentIdValidationResult } from './types';

/**
 * Validate a content ID
 * 
 * @param contentId The content ID to validate
 * @returns A validation result object
 */
export function validateContentId(contentId: string | null | undefined): ContentIdValidationResult {
  // Check for empty or null values
  if (!contentId) {
    return createContentIdValidationResult(
      false,
      'Content ID is required',
      ContentIdValidationResultType.INVALID_FORMAT,
      false
    );
  }
  
  // Handle temporary IDs (starting with 'temp-')
  if (contentId.startsWith('temp-')) {
    return createContentIdValidationResult(
      true,
      null,
      ContentIdValidationResultType.TEMP,
      false
    );
  }
  
  // Validate UUID format
  if (!validateUUID(contentId)) {
    return createContentIdValidationResult(
      false,
      'Invalid content ID format',
      ContentIdValidationResultType.INVALID_FORMAT,
      false
    );
  }
  
  // Valid UUID
  return createContentIdValidationResult(
    true,
    null,
    ContentIdValidationResultType.VALID,
    true // Assuming it exists since it has valid format, will be checked separately
  );
}

/**
 * Check if a content ID is a valid UUID or temporary ID
 */
export function isValidContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  return contentId.startsWith('temp-') || validateUUID(contentId);
}

/**
 * Try to convert a content ID to a UUID
 */
export function tryConvertToUUID(contentId: string | null | undefined): string | null {
  if (!contentId) return null;
  
  return validateUUID(contentId) ? contentId : null;
}

/**
 * Check if a content ID can be stored in the database
 */
export function isStorableContentId(contentId: string | null | undefined): boolean {
  if (!contentId) return false;
  
  // Only valid UUIDs can be stored
  return validateUUID(contentId);
}

/**
 * Get a detailed validation result for a content ID
 */
export async function getContentIdValidationResult(contentId: string | null | undefined): Promise<ContentIdValidationResult> {
  // First validate the format
  const formatValidation = validateContentId(contentId);
  
  // If the format is invalid, return the result
  if (!formatValidation.isValid) {
    return formatValidation;
  }
  
  // If it's a temporary ID, return the result
  if (formatValidation.resultType === ContentIdValidationResultType.TEMP) {
    return formatValidation;
  }
  
  // Check if the content exists
  try {
    if (contentId) {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id')
        .eq('id', contentId)
        .single();
      
      if (error || !data) {
        return createContentIdValidationResult(
          false,
          'Content not found',
          ContentIdValidationResultType.NOT_FOUND,
          false
        );
      }
      
      return createContentIdValidationResult(
        true,
        null,
        ContentIdValidationResultType.VALID,
        true
      );
    }
  } catch (error) {
    console.error('Error checking content existence:', error);
  }
  
  // Fallback to format validation if something went wrong
  return formatValidation;
}
