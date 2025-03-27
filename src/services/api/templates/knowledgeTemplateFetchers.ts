
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from '../base';
import { KnowledgeTemplate, PaginationParams, PaginatedResponse } from '../types';
import { validateUuid } from './knowledgeTemplateBase';

/**
 * Fetches all knowledge templates with pagination
 */
export const fetchKnowledgeTemplates = async (
  pagination?: PaginationParams,
  fields?: string[]
): Promise<PaginatedResponse<KnowledgeTemplate>> => {
  try {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    
    if (page < 1 || pageSize < 1) {
      throw new ApiError('Invalid pagination parameters: page and pageSize must be positive', 400);
    }
    
    const startIndex = (page - 1) * pageSize;
    
    const selectQuery = fields?.length ? fields.join(', ') : '*';
    
    const { count, error: countError } = await supabase
      .from('knowledge_templates')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      handleError(countError, `Error counting knowledge templates: ${countError.message}`);
      throw new ApiError(countError.message, parseSupabaseErrorCode(countError));
    }
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select(selectQuery)
      .order('name', { ascending: true })
      .range(startIndex, startIndex + pageSize - 1);
    
    if (error) {
      handleError(error, `Error fetching knowledge templates: ${error.message}`, {
        technical: true,
        level: 'error'
      });
      throw new ApiError(error.message, parseSupabaseErrorCode(error));
    }
    
    // Ensure data is an array and properly typed as KnowledgeTemplate[]
    const safeData = Array.isArray(data) ? data as KnowledgeTemplate[] : [];
    
    return {
      data: safeData,
      count: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0
    };
  } catch (error) {
    handleError(error, "Failed to fetch knowledge templates", {
      technical: true,
      level: 'error'
    });
    throw error;
  }
};

/**
 * Fetches a specific knowledge template by ID
 */
export const fetchKnowledgeTemplateById = async (id: string): Promise<KnowledgeTemplate> => {
  try {
    validateUuid(id, 'template ID');
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    if (!data) throw new ApiError(`Knowledge template with ID: ${id} not found`, 404);
    
    // Explicitly type the returned data as KnowledgeTemplate
    return data as KnowledgeTemplate;
  } catch (error) {
    handleError(error, `Failed to fetch knowledge template with ID: ${id}`);
    throw error;
  }
};
