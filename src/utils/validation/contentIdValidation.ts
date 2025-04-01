
import { ContentIdValidationResult, ContentIdValidationResultType } from './types';
import { createContentValidationResult } from './utils';
import { fetchKnowledgeSource } from '@/services/api/knowledgeSources';

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Temporary ID prefix check
 */
const TEMP_ID_PREFIX = 'temp-';

/**
 * Checks if a string is a valid UUID
 */
export const isUUID = (str: string): boolean => {
  return UUID_REGEX.test(str);
};

/**
 * Checks if a string is a temporary ID (starts with 'temp-')
 */
export const isTempId = (str: string): boolean => {
  return str.startsWith(TEMP_ID_PREFIX);
};

/**
 * Validate a content ID string
 * Returns a ContentIdValidationResult
 */
export const validateContentId = (contentId: string | null | undefined): ContentIdValidationResult => {
  if (!contentId) {
    return createContentValidationResult(
      false,
      'Content ID is required',
      ContentIdValidationResultType.MISSING,
      false
    );
  }

  if (isTempId(contentId)) {
    return createContentValidationResult(
      true,
      'Valid temporary content ID',
      ContentIdValidationResultType.TEMP,
      false
    );
  }

  if (!isUUID(contentId)) {
    return createContentValidationResult(
      false,
      'Invalid content ID format',
      ContentIdValidationResultType.INVALID_FORMAT,
      false
    );
  }

  return createContentValidationResult(
    true,
    'Valid content ID format',
    ContentIdValidationResultType.VALID_FORMAT,
    true
  );
};

/**
 * Check if a content ID exists in the database
 * This makes an API call, so use sparingly
 */
export const checkContentExists = async (contentId: string): Promise<boolean> => {
  try {
    const source = await fetchKnowledgeSource(contentId);
    return !!source;
  } catch (error) {
    console.error('Error checking content existence:', error);
    return false;
  }
};

/**
 * Simple check if a content ID is valid (either UUID or temp ID)
 * This doesn't check database existence, just format
 */
export const isValidContentId = (contentId: string | null | undefined): boolean => {
  if (!contentId) return false;
  return isUUID(contentId) || isTempId(contentId);
};
