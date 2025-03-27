
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from '../base';
import { validateUuid } from './knowledgeTemplateBase';
import { updateKnowledgeSource, createKnowledgeSource } from '../knowledgeSources';

/**
 * Applies a template to an existing knowledge source
 */
export const applyTemplateToSource = async (templateId: string, sourceId: string) => {
  try {
    validateUuid(templateId, 'template ID');
    validateUuid(sourceId, 'source ID');
    
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) {
      handleError(templateError, `Error fetching template with ID: ${templateId}`, {
        technical: true,
        level: 'error'
      });
      throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    }
    
    if (!templateData) {
      throw new ApiError(`Template with ID: ${templateId} not found`, 404);
    }
    
    return await updateKnowledgeSource(sourceId, {
      content: templateData.content,
      template_id: templateId
    });
  } catch (error) {
    handleError(error, `Failed to apply template with ID: ${templateId} to source with ID: ${sourceId}`, {
      technical: true,
      level: 'error'
    });
    throw error;
  }
};

/**
 * Creates a new knowledge source from a template
 */
export const createKnowledgeSourceFromTemplate = async (
  templateId: string, 
  sourceData: { title: string, user_id?: string }
) => {
  try {
    validateUuid(templateId, 'template ID');
    
    if (!sourceData.title || sourceData.title.trim() === '') {
      throw new ApiError('Source title is required', 400);
    }
    
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) {
      handleError(templateError, `Error fetching template with ID: ${templateId}`, {
        technical: true,
        level: 'error'
      });
      throw new ApiError(templateError.message, parseSupabaseErrorCode(templateError));
    }
    
    if (!templateData) {
      throw new ApiError(`Template with ID: ${templateId} not found`, 404);
    }
    
    return await createKnowledgeSource({
      title: sourceData.title,
      content: templateData.content,
      template_id: templateId,
      user_id: sourceData.user_id
    });
  } catch (error) {
    handleError(error, `Failed to create knowledge source from template with ID: ${templateId}`, {
      technical: true,
      level: 'error'
    });
    throw error;
  }
};
