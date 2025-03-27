
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from '../base';
import { KnowledgeTemplate } from '../types';

/**
 * Validates a UUID format string
 */
export const validateUuid = (id: string, entityName = 'ID'): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    throw new ApiError(`Invalid ${entityName} format: ${id}`, 400);
  }
  return true;
};

/**
 * Validates template content
 */
export const validateTemplateContent = (content: string | undefined): boolean => {
  if (content === undefined || content === '') {
    throw new ApiError('Template content cannot be empty', 400);
  }
  return true;
};

/**
 * Validates template metadata if provided
 */
export const validateTemplateMetadata = (metadata: any): boolean => {
  if (metadata && typeof metadata === 'object' && 'structure' in metadata) {
    if (!metadata.structure) {
      throw new ApiError('Template structure is required if provided', 400);
    }
  }
  return true;
};

/**
 * Validates template name
 */
export const validateTemplateName = (name: string | undefined): boolean => {
  if (name !== undefined && name.trim() === '') {
    throw new ApiError('Template name cannot be empty', 400);
  }
  return true;
};
