import { supabase, handleError, ApiError, parseSupabaseErrorCode } from './base';
import { KnowledgeTemplate, PaginationParams, PaginatedResponse } from './types';
import { updateKnowledgeSource, createKnowledgeSource } from './knowledgeSources';

export const fetchKnowledgeTemplates = async (pagination?: PaginationParams): Promise<PaginatedResponse<KnowledgeTemplate>> => {
  try {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    
    const { count, error: countError } = await supabase
      .from('knowledge_templates')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw new ApiError(countError.message, parseSupabaseErrorCode(countError));
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .order('name', { ascending: true })
      .range(startIndex, startIndex + pageSize - 1);
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
    return {
      data: data || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0
    };
  } catch (error) {
    handleError(error, "Failed to fetch knowledge templates");
    throw error;
  }
};

export const fetchKnowledgeTemplateById = async (id: string): Promise<KnowledgeTemplate> => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new ApiError(`Invalid template ID format: ${id}`, 400);
    }
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    if (!data) throw new ApiError(`Knowledge template with ID: ${id} not found`, 404);
    
    return data;
  } catch (error) {
    handleError(error, `Failed to fetch knowledge template with ID: ${id}`);
    throw error;
  }
};

export const createKnowledgeTemplate = async (template: Omit<KnowledgeTemplate, 'id'>) => {
  try {
    if (!template.name || template.name.trim() === '') {
      throw new ApiError('Template name is required', 400);
    }
    
    if (!template.content) {
      throw new ApiError('Template content is required', 400);
    }
    
    if (template.metadata && typeof template.metadata === 'object' && 'structure' in template.metadata) {
      if (!template.metadata.structure) {
        throw new ApiError('Template structure is required if provided', 400);
      }
    }
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .insert([template])
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, "Failed to create knowledge template");
    throw error;
  }
};

export const updateKnowledgeTemplate = async (id: string, updates: Partial<KnowledgeTemplate>) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new ApiError(`Invalid template ID format: ${id}`, 400);
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new ApiError('No updates provided', 400);
    }
    
    if (updates.name !== undefined && updates.name.trim() === '') {
      throw new ApiError('Template name cannot be empty', 400);
    }
    
    if (updates.content !== undefined && !updates.content) {
      throw new ApiError('Template content cannot be empty', 400);
    }
    
    if (updates.metadata && typeof updates.metadata === 'object' && 'structure' in updates.metadata) {
      if (!updates.metadata.structure) {
        throw new ApiError('Template structure is required if provided', 400);
      }
    }
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to update knowledge template with ID: ${id}`);
    throw error;
  }
};

export const deleteKnowledgeTemplate = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_templates')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to delete knowledge template with ID: ${id}`);
    throw error;
  }
};

export const applyTemplateToSource = async (templateId: string, sourceId: string) => {
  try {
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    if (!templateData) throw new Error('Template not found');
    
    return await updateKnowledgeSource(sourceId, {
      content: templateData.content,
      template_id: templateId
    });
  } catch (error) {
    handleError(error, `Failed to apply template with ID: ${templateId} to source with ID: ${sourceId}`);
    throw error;
  }
};

export const createKnowledgeSourceFromTemplate = async (
  templateId: string, 
  sourceData: { title: string, user_id?: string }
) => {
  try {
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    if (!templateData) throw new Error('Template not found');
    
    return await createKnowledgeSource({
      title: sourceData.title,
      content: templateData.content,
      template_id: templateId,
      user_id: sourceData.user_id
    });
  } catch (error) {
    handleError(error, `Failed to create knowledge source from template with ID: ${templateId}`);
    throw error;
  }
};
