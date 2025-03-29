
import { supabase } from '@/supabaseClient';
import { KnowledgeTemplate, PaginationParams } from '../types';
import { getTemplateCategory, TEMPLATE_CATEGORIES } from './knowledgeTemplateBase';

/**
 * Fetch all knowledge templates with optional pagination and filtering
 */
export async function fetchKnowledgeTemplates(params?: PaginationParams & { 
  search?: string;
  category?: string;
  isGlobal?: boolean;
  userId?: string;
}) {
  let query = supabase
    .from('knowledge_templates')
    .select('*');

  // Apply filters if provided
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }

  if (params?.isGlobal !== undefined) {
    query = query.eq('is_global', params.isGlobal);
  }

  if (params?.userId) {
    query = query.eq('user_id', params.userId);
  }

  // Apply pagination if provided
  if (params?.page && params?.pageSize) {
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize - 1;
    query = query.range(start, end);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Apply category filtering in memory if requested
  let filteredData = data as KnowledgeTemplate[];
  if (params?.category) {
    filteredData = filteredData.filter(template => 
      getTemplateCategory(template) === params.category
    );
  }

  return {
    data: filteredData,
    count: filteredData.length,
    // Simple pagination info when using in-memory filtering
    page: params?.page || 1,
    pageSize: params?.pageSize || filteredData.length,
    totalPages: params?.pageSize 
      ? Math.ceil(filteredData.length / params.pageSize) 
      : 1
  };
}

/**
 * Fetch a specific knowledge template by ID
 */
export async function fetchKnowledgeTemplateById(id: string): Promise<KnowledgeTemplate> {
  const { data, error } = await supabase
    .from('knowledge_templates')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as KnowledgeTemplate;
}

/**
 * Fetch templates by category
 */
export async function fetchTemplatesByCategory(category: string) {
  const { data: allTemplates } = await fetchKnowledgeTemplates();
  const templates = allTemplates.filter(template => 
    getTemplateCategory(template) === category
  );
  
  return {
    data: templates,
    count: templates.length
  };
}

/**
 * Fetch debug-specific templates
 */
export async function fetchDebugTemplates() {
  return fetchTemplatesByCategory(TEMPLATE_CATEGORIES.DEBUGGING);
}

/**
 * Fetch compliance-specific templates
 */
export async function fetchComplianceTemplates() {
  return fetchTemplatesByCategory(TEMPLATE_CATEGORIES.COMPLIANCE);
}

/**
 * Fetch agent-specific templates
 */
export async function fetchAgentTemplates() {
  return fetchTemplatesByCategory(TEMPLATE_CATEGORIES.AGENT);
}
