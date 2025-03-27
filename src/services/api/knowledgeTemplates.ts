import { supabase, handleError, ApiError, parseSupabaseErrorCode } from './base';
import { KnowledgeTemplate, PaginationParams, PaginatedResponse } from './types';
import { updateKnowledgeSource, createKnowledgeSource } from './knowledgeSources';

export const fetchKnowledgeTemplates = async (pagination?: PaginationParams): Promise<PaginatedResponse<KnowledgeTemplate>> => {
  try {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    
    // First get the total count
    const { count, error: countError } = await supabase
      .from('knowledge_templates')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw new ApiError(countError.message, parseSupabaseErrorCode(countError));
    
    // Then fetch the paginated data
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

export const fetchKnowledgeTemplateById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to fetch knowledge template with ID: ${id}`);
    throw error;
  }
};

export const createKnowledgeTemplate = async (template: Omit<KnowledgeTemplate, 'id'>) => {
  try {
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
    // First, get the template
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    if (!templateData) throw new Error('Template not found');
    
    // Update the source with content from the template
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
    // First, get the template
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    if (!templateData) throw new Error('Template not found');
    
    // Create new source with template content
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
