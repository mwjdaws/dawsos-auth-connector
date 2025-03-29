
import { supabase } from '@/supabaseClient';
import { KnowledgeTemplate } from '../types';
import { getTemplateCategory } from './knowledgeTemplateBase';

/**
 * Create a new knowledge template
 */
export async function createKnowledgeTemplate(template: Omit<KnowledgeTemplate, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('knowledge_templates')
    .insert([template])
    .select();
    
  if (error) throw error;
  return data;
}

/**
 * Update an existing knowledge template
 */
export async function updateKnowledgeTemplate(id: string, template: Partial<KnowledgeTemplate>) {
  const { data, error } = await supabase
    .from('knowledge_templates')
    .update(template)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data;
}

/**
 * Delete a knowledge template
 */
export async function deleteKnowledgeTemplate(id: string) {
  const { error } = await supabase
    .from('knowledge_templates')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
}

/**
 * Generate a knowledge template structure from content
 * This is a helper to convert markdown content to structured sections
 */
export function generateStructureFromContent(content: string) {
  // Split the content by markdown headings (## Title)
  const sections = content.split(/(?=#{2}\s+)/);
  
  // Process each section
  const structuredSections = sections
    .filter(section => section.trim())
    .map(section => {
      // Extract the title from the heading
      const titleMatch = section.match(/#{2}\s+(.*?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Remove the heading from the content
      const sectionContent = section.replace(/#{2}\s+(.*?)(?:\n|$)/, '').trim();
      
      return {
        title,
        content: sectionContent
      };
    })
    .filter(section => section.title); // Only keep sections with titles

  // Return the structured format
  return {
    sections: structuredSections
  };
}

/**
 * Duplicate a template (useful for creating variations of system templates)
 */
export async function duplicateTemplate(sourceId: string, newName: string, userId: string, makePrivate = true) {
  // Fetch the source template
  const { data: sourceTemplate, error: fetchError } = await supabase
    .from('knowledge_templates')
    .select('*')
    .eq('id', sourceId)
    .single();
    
  if (fetchError || !sourceTemplate) {
    throw fetchError || new Error('Source template not found');
  }
  
  // Create a new template based on the source
  const newTemplate = {
    name: newName,
    content: sourceTemplate.content,
    structure: sourceTemplate.structure,
    is_global: !makePrivate, // Usually duplicated templates are private
    user_id: userId,
    metadata: {
      ...sourceTemplate.metadata as Record<string, any>,
      duplicated_from: sourceId,
      category: getTemplateCategory(sourceTemplate as KnowledgeTemplate)
    }
  };
  
  // Insert the new template
  const { data, error } = await supabase
    .from('knowledge_templates')
    .insert([newTemplate])
    .select();
    
  if (error) throw error;
  return data;
}
