
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeTemplate, PaginationParams } from '@/services/api/types';
import { ApiError, parseSupabaseErrorCode } from '../base';

export const fetchKnowledgeTemplates = async (params?: PaginationParams) => {
  try {
    // Start building the query
    let query = supabase
      .from('knowledge_templates')
      .select('*', { count: 'exact' });
    
    // Get the current user for filtering
    const { data: { user } } = await supabase.auth.getUser();
    
    // Apply RLS automatically - this query will only return:
    // 1. Global templates (is_global = true)
    // 2. Private templates where user_id = current user's ID
    
    // Apply pagination if provided
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }
    
    // Execute the query
    const { data, error, count } = await query.order('name');
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
    // Prepare pagination information
    const totalItems = count || (data?.length || 0);
    const pageSize = params?.pageSize || totalItems;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = params?.page || 1;
    
    return { 
      data: data || [],
      count: totalItems,
      page: currentPage,
      pageSize: pageSize,
      totalPages: totalPages
    };
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
