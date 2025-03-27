
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
    
    // Ensure proper type handling with type checking
    const templates: KnowledgeTemplate[] = [];
    
    if (Array.isArray(data)) {
      for (const rawItem of data) {
        // Skip null items
        if (!rawItem) continue;
        
        const item = rawItem as Record<string, any>;
        
        if (item && typeof item === 'object' && 'id' in item && 'name' in item && 'content' in item) {
          templates.push({
            id: String(item.id || ''),
            name: String(item.name || ''),
            content: String(item.content || ''),
            metadata: item.metadata || undefined,
            structure: item.structure || undefined,
            is_global: Boolean(item.is_global || false),
            created_at: item.created_at ? String(item.created_at) : undefined,
            updated_at: item.updated_at ? String(item.updated_at) : undefined
          });
        }
      }
    }
    
    return {
      data: templates,
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
    
    // Ensure proper type handling with type checking
    if (!data.id || !data.name || !data.content) {
      throw new ApiError(`Invalid template data returned for ID: ${id}`, 500);
    }
    
    // Create template object with verified properties
    const template: KnowledgeTemplate = {
      id: String(data.id),
      name: String(data.name),
      content: String(data.content),
      metadata: data.metadata || undefined,
      structure: data.structure || undefined,
      is_global: Boolean(data.is_global || false),
      created_at: data.created_at ? String(data.created_at) : undefined,
      updated_at: data.updated_at ? String(data.updated_at) : undefined
    };
    
    return template;
  } catch (error) {
    handleError(error, `Failed to fetch knowledge template with ID: ${id}`);
    throw error;
  }
};
