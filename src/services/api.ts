import { supabase } from '@/integrations/supabase/client';
import { handleError, ApiError } from '@/utils/error-handling';
import { Json } from '@/integrations/supabase/types';

export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
}

export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  version_number: number;
  content: string;
  metadata?: Json;
  created_at?: string;
}

export interface KnowledgeTemplate {
  id: string;
  name: string;
  content: string;
  metadata?: Json;
}

// Knowledge Sources CRUD Operations
export const fetchKnowledgeSources = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch knowledge sources");
    throw error;
  }
};

export const fetchKnowledgeSourceById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, `Failed to fetch knowledge source with ID: ${id}`);
    throw error;
  }
};

export const createKnowledgeSource = async (source: Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .insert([source])
      .select();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    
    // Create initial version (version 1)
    if (data && data.length > 0) {
      const initialVersion = {
        source_id: data[0].id,
        version_number: 1,
        content: source.content,
        metadata: { initial_version: true }
      };
      
      await createKnowledgeSourceVersion(initialVersion);
    }
    
    return data;
  } catch (error) {
    handleError(error, "Failed to create knowledge source");
    throw error;
  }
};

export const updateKnowledgeSource = async (id: string, updates: Partial<KnowledgeSource>) => {
  try {
    // First retrieve the current version number
    let versionNumber = 1;
    const { data: versionData } = await supabase
      .from('knowledge_source_versions')
      .select('version_number')
      .eq('source_id', id)
      .order('version_number', { ascending: false })
      .limit(1);
    
    if (versionData && versionData.length > 0) {
      versionNumber = versionData[0].version_number + 1;
    }
    
    // Update the knowledge source
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    
    // If content was updated, create a new version
    if (updates.content && data && data.length > 0) {
      const newVersion = {
        source_id: id,
        version_number: versionNumber,
        content: updates.content,
        metadata: { update_reason: "Content changed" }
      };
      
      await createKnowledgeSourceVersion(newVersion);
    }
    
    return data;
  } catch (error) {
    handleError(error, `Failed to update knowledge source with ID: ${id}`);
    throw error;
  }
};

export const deleteKnowledgeSource = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, `Failed to delete knowledge source with ID: ${id}`);
    throw error;
  }
};

// Knowledge Source Versions Operations
export const fetchKnowledgeSourceVersions = async (sourceId: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_source_versions')
      .select('*')
      .eq('source_id', sourceId)
      .order('version_number', { ascending: false });
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, `Failed to fetch versions for knowledge source with ID: ${sourceId}`);
    throw error;
  }
};

export const fetchKnowledgeSourceVersionById = async (versionId: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_source_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, `Failed to fetch version with ID: ${versionId}`);
    throw error;
  }
};

export const createKnowledgeSourceVersion = async (
  version: Omit<KnowledgeSourceVersion, 'id' | 'created_at'>
) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_source_versions')
      .insert([version])
      .select();
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
  } catch (error) {
    handleError(error, "Failed to create knowledge source version");
    throw error;
  }
};

export const restoreKnowledgeSourceVersion = async (versionId: string) => {
  try {
    // First, get the version
    const { data: versionData, error: versionError } = await supabase
      .from('knowledge_source_versions')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (versionError) throw new ApiError(versionError.message, versionError.code ? parseInt(versionError.code) : 500);
    if (!versionData) throw new Error('Version not found');
    
    // Get source info
    const { data: sourceData, error: sourceError } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('id', versionData.source_id)
      .single();
    
    if (sourceError) throw new ApiError(sourceError.message, sourceError.code ? parseInt(sourceError.code) : 500);
    if (!sourceData) throw new Error('Source not found');
    
    // Update the source with content from the version
    return await updateKnowledgeSource(versionData.source_id, {
      content: versionData.content
    });
  } catch (error) {
    handleError(error, `Failed to restore version with ID: ${versionId}`);
    throw error;
  }
};

// Knowledge Templates Operations
export const fetchKnowledgeTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_templates')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
    return data;
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
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
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
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
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
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
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
    
    if (error) throw new ApiError(error.message, error.code ? parseInt(error.code) : 500);
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
    
    if (templateError) throw new ApiError(templateError.message, templateError.code ? parseInt(templateError.code) : 500);
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

// Create a new knowledge source from a template
export const createKnowledgeSourceFromTemplate = async (
  templateId: string, 
  sourceData: Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at' | 'content' | 'template_id'>
) => {
  try {
    // First, get the template
    const { data: templateData, error: templateError } = await supabase
      .from('knowledge_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw new ApiError(templateError.message, templateError.code ? parseInt(templateError.code) : 500);
    if (!templateData) throw new Error('Template not found');
    
    // Create new source with template content
    return await createKnowledgeSource({
      ...sourceData,
      content: templateData.content,
      template_id: templateId
    });
  } catch (error) {
    handleError(error, `Failed to create knowledge source from template with ID: ${templateId}`);
    throw error;
  }
};
