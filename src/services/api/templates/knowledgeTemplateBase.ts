
import { supabase } from '@/supabaseClient';
import { KnowledgeTemplate } from '../types';

/**
 * Known template categories for better classification of templates
 */
export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'business',
  RESEARCH: 'research',
  TECHNICAL: 'technical',
  DEBUGGING: 'debugging',
  COMPLIANCE: 'compliance',
  AGENT: 'agent',
  GENERAL: 'general',
} as const;

/**
 * Maps template names to their categories for better organization
 */
export const TEMPLATE_CATEGORY_MAP: Record<string, string> = {
  // Business templates
  'Meeting Notes': TEMPLATE_CATEGORIES.BUSINESS,
  'Project Plan': TEMPLATE_CATEGORIES.BUSINESS,
  
  // Research templates
  'Research Summary': TEMPLATE_CATEGORIES.RESEARCH,
  'Experiment Log': TEMPLATE_CATEGORIES.RESEARCH,
  
  // Technical templates
  'Technical Design Document': TEMPLATE_CATEGORIES.TECHNICAL,
  'API Documentation': TEMPLATE_CATEGORIES.TECHNICAL,
  
  // Debug templates
  'System Debug Note': TEMPLATE_CATEGORIES.DEBUGGING,
  
  // Agent templates
  'Agent Reference Template': TEMPLATE_CATEGORIES.AGENT,
  
  // Compliance templates
  'Governance Tracker': TEMPLATE_CATEGORIES.COMPLIANCE,
  
  // General templates
  'Personal Journal': TEMPLATE_CATEGORIES.GENERAL,
  'Brainstorming Notes': TEMPLATE_CATEGORIES.GENERAL
};

/**
 * Get template category from template object or name
 */
export function getTemplateCategory(template: KnowledgeTemplate | string): string {
  const templateName = typeof template === 'string' ? template : template.name;
  return TEMPLATE_CATEGORY_MAP[templateName] || TEMPLATE_CATEGORIES.GENERAL;
}

/**
 * Base functions for working with knowledge templates
 */
export async function fetchKnowledgeTemplateBaseById(id: string): Promise<KnowledgeTemplate> {
  const { data, error } = await supabase
    .from('knowledge_templates')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as KnowledgeTemplate;
}
