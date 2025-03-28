
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from '../base';
import { KnowledgeTemplate } from '../types';
import { 
  validateUuid, 
  validateTemplateName, 
  validateTemplateContent, 
  validateTemplateMetadata 
} from './knowledgeTemplateBase';

/**
 * Creates a new knowledge template
 */
export const createKnowledgeTemplate = async (template: Omit<KnowledgeTemplate, 'id'>) => {
  try {
    if (!template.name || template.name.trim() === '') {
      throw new ApiError('Template name is required', 400);
    }
    
    validateTemplateContent(template.content);
    validateTemplateMetadata(template.metadata);
    
    // Verify user_id is set for private templates
    if (template.is_global === false && !template.user_id) {
      // Get the current user ID if not provided
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new ApiError('User ID is required for private templates', 400);
      }
      
      template.user_id = user.id;
    }
    
    // Create a clean object with only the properties we need
    const templateData = {
      name: template.name,
      content: template.content,
      metadata: template.metadata,
      structure: template.structure,
      is_global: template.is_global || false,
      user_id: template.user_id
    };
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .insert([templateData])
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, "Failed to create knowledge template");
    throw error;
  }
};

/**
 * Updates an existing knowledge template
 */
export const updateKnowledgeTemplate = async (id: string, updates: Partial<KnowledgeTemplate>) => {
  try {
    validateUuid(id, 'template ID');
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new ApiError('No updates provided', 400);
    }
    
    validateTemplateName(updates.name);
    
    if (updates.content !== undefined) {
      validateTemplateContent(updates.content);
    }
    
    validateTemplateMetadata(updates.metadata);
    
    // Ensure user_id is maintained for private templates
    if (updates.is_global === false && !updates.user_id) {
      // Get the current user ID if not provided
      const { data: { user } } = await supabase.auth.getUser();
      
      // First get the current template to check if we're changing from global to private
      const { data: existingTemplate, error: fetchError } = await supabase
        .from('knowledge_templates')
        .select('is_global, user_id')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        throw new ApiError(fetchError.message, parseSupabaseErrorCode(fetchError));
      }
      
      // If changing from global to private, ensure user_id is set
      if (existingTemplate.is_global && !existingTemplate.user_id) {
        if (!user?.id) {
          throw new ApiError('User ID is required when changing template from global to private', 400);
        }
        updates.user_id = user.id;
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

/**
 * Deletes a knowledge template
 */
export const deleteKnowledgeTemplate = async (id: string) => {
  try {
    validateUuid(id, 'template ID');
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
    if (!data || data.length === 0) {
      throw new ApiError(`Template with ID: ${id} not found or already deleted`, 404);
    }
    
    return data;
  } catch (error) {
    handleError(error, `Failed to delete knowledge template with ID: ${id}`);
    throw error;
  }
};
