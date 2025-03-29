
import { supabase } from '@/supabaseClient';
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
      throw new Error(`Error fetching template with ID: ${templateId}. ${templateError.message}`);
    }
    
    if (!templateData) {
      throw new Error(`Template with ID: ${templateId} not found`);
    }
    
    return await updateKnowledgeSource(sourceId, {
      content: templateData.content,
      template_id: templateId
    });
  } catch (error) {
    console.error(`Failed to apply template with ID: ${templateId} to source with ID: ${sourceId}`, error);
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
      throw new Error('Source title is required');
    }
    
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) {
      throw new Error(`Error fetching template with ID: ${templateId}. ${templateError.message}`);
    }
    
    if (!templateData) {
      throw new Error(`Template with ID: ${templateId} not found`);
    }
    
    return await createKnowledgeSource({
      title: sourceData.title,
      content: templateData.content,
      template_id: templateId,
      user_id: sourceData.user_id
    });
  } catch (error) {
    console.error(`Failed to create knowledge source from template with ID: ${templateId}`, error);
    throw error;
  }
};
