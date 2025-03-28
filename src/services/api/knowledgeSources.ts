
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from './base';
import { KnowledgeSource } from './types';
import { createKnowledgeSourceVersion } from './knowledgeSourceVersions';

export const fetchKnowledgeSources = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
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
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
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
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
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
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
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
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to delete knowledge source with ID: ${id}`);
    throw error;
  }
};

// New functions for external source operations

export const checkExternalSource = async (id: string) => {
  try {
    // First, get the knowledge source with the external URL
    const { data: source, error: fetchError } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw new ApiError(fetchError.message, parseSupabaseErrorCode(fetchError));
    
    if (!source || !source.external_source_url) {
      throw new Error("No external source URL found for this knowledge source");
    }
    
    // Update the checked_at timestamp
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        external_source_checked_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to check external source for knowledge source with ID: ${id}`);
    throw error;
  }
};

export const markExternalReviewNeeded = async (id: string, needsReview: boolean = true) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        needs_external_review: needsReview
      })
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to update external review flag for knowledge source with ID: ${id}`);
    throw error;
  }
};

export const updateExternalSource = async (id: string, externalSourceUrl: string, contentHash?: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        external_source_url: externalSourceUrl,
        external_content_hash: contentHash,
        external_source_checked_at: new Date().toISOString(),
        needs_external_review: false
      })
      .eq('id', id)
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, `Failed to update external source for knowledge source with ID: ${id}`);
    throw error;
  }
};
