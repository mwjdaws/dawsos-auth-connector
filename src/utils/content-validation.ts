
import { handleError, ErrorLevel } from './errors';
import { ContentIdValidationResult, ContentIdValidationResultType } from '@/types/validation';
import { fetchKnowledgeSourceExists } from '@/services/api/knowledgeSources';

/**
 * Validate a content ID
 */
export function isValidContentId(contentId?: string): boolean {
  if (!contentId) return false;
  
  // Valid UUID format
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId)) {
    return true;
  }
  
  // Valid temporary ID (starts with 'temp-')
  if (contentId.startsWith('temp-')) {
    return true;
  }
  
  return false;
}

/**
 * Check if a content ID is a temporary ID
 */
export function isTemporaryContentId(contentId?: string): boolean {
  if (!contentId) return false;
  return contentId.startsWith('temp-');
}

/**
 * Check if a content ID is a UUID
 */
export function isUuidContentId(contentId?: string): boolean {
  if (!contentId) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contentId);
}

/**
 * Validate a content ID is a valid UUID or temp ID
 */
export function validateContentId(contentId?: string): boolean {
  return isValidContentId(contentId);
}

/**
 * Comprehensive validation of a content ID with detailed results
 */
export async function validateContentIdWithDetails(contentId?: string): Promise<ContentIdValidationResult> {
  // Missing ID
  if (!contentId) {
    return {
      isValid: false,
      contentExists: false,
      errorMessage: 'No content ID provided',
      message: 'Please provide a valid content ID',
      resultType: ContentIdValidationResultType.INVALID
    };
  }
  
  try {
    // Check if content ID is a valid UUID
    if (isUuidContentId(contentId)) {
      // Check if content exists in the database
      const exists = await fetchKnowledgeSourceExists(contentId);
      
      if (exists) {
        return {
          isValid: true,
          contentExists: true,
          errorMessage: null,
          message: 'Valid UUID content ID that exists',
          resultType: ContentIdValidationResultType.UUID
        };
      } else {
        return {
          isValid: true,
          contentExists: false,
          errorMessage: 'Content with this ID does not exist',
          message: 'The content ID is valid but no content was found',
          resultType: ContentIdValidationResultType.UUID
        };
      }
    }
    
    // Check if content ID is a temporary ID
    if (isTemporaryContentId(contentId)) {
      return {
        isValid: true,
        contentExists: false,
        errorMessage: null,
        message: 'Valid temporary content ID',
        resultType: ContentIdValidationResultType.TEMP
      };
    }
    
    // Invalid content ID format
    return {
      isValid: false,
      contentExists: false,
      errorMessage: 'Invalid content ID format',
      message: 'Please provide a valid content ID',
      resultType: ContentIdValidationResultType.INVALID
    };
  } catch (error) {
    handleError(error, 'Error validating content ID', { 
      level: ErrorLevel.WARNING,
      context: { contentId }
    });
    
    return {
      isValid: false,
      contentExists: false,
      errorMessage: 'Error checking content existence',
      message: 'Failed to validate the content ID',
      resultType: ContentIdValidationResultType.UNKNOWN
    };
  }
}
