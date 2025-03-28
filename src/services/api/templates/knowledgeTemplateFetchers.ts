
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeTemplate } from '@/services/api/types';
import { ApiError, parseSupabaseErrorCode } from '../base';

export const fetchKnowledgeTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .order('name');
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching knowledge templates:', error);
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
    console.error(`Error fetching knowledge template with ID ${id}:`, error);
    throw error;
  }
};
