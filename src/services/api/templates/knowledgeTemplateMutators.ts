
import { supabase } from '@/supabaseClient';
import { KnowledgeTemplate } from '../types';
import { validateUuid } from './knowledgeTemplateBase';

/**
 * Create a new knowledge template
 */
export async function createKnowledgeTemplate(templateData: Omit<KnowledgeTemplate, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('knowledge_templates')
      .insert(templateData)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create knowledge template:', error);
    throw error;
  }
}

/**
 * Update an existing knowledge template
 */
export async function updateKnowledgeTemplate(id: string, updates: Partial<KnowledgeTemplate>) {
  try {
    validateUuid(id, 'template ID');
    
    const { data, error } = await supabase
      .from('knowledge_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Failed to update template with ID: ${id}`, error);
    throw error;
  }
}

/**
 * Delete a knowledge template
 */
export async function deleteKnowledgeTemplate(id: string) {
  try {
    validateUuid(id, 'template ID');
    
    const { error } = await supabase
      .from('knowledge_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Failed to delete template with ID: ${id}`, error);
    throw error;
  }
}

/**
 * Duplicate an existing template
 */
export async function duplicateKnowledgeTemplate(id: string, newName?: string) {
  try {
    validateUuid(id, 'template ID');
    
    // 1. Fetch the original template
    const { data: original, error: fetchError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    if (!original) throw new Error(`Template with ID: ${id} not found`);
    
    // 2. Create a duplicate with a new name
    const duplicateData = {
      name: newName || `${original.name} (Copy)`,
      content: original.content,
      structure: original.structure,
      metadata: original.metadata,
      is_global: false, // Duplicates are never global by default
      user_id: original.user_id
    };
    
    // 3. Insert the duplicate
    const { data, error } = await supabase
      .from('knowledge_templates')
      .insert(duplicateData)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Failed to duplicate template with ID: ${id}`, error);
    throw error;
  }
}
