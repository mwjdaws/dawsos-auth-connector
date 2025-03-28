
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from './base';
import { KnowledgeSourceVersion } from './types';
import { updateKnowledgeSource } from './knowledgeSources';

export const fetchKnowledgeSourceVersions = async (sourceId: string) => {
  try {
    const { data, error } = await supabase
      .from('knowledge_source_versions')
      .select('*')
      .eq('source_id', sourceId)
      .order('version_number', { ascending: false });
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
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
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
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
    // First, get the latest version number for this source
    const { data: versions, error: versionError } = await supabase
      .from('knowledge_source_versions')
      .select('version_number')
      .eq('source_id', version.source_id)
      .order('version_number', { ascending: false })
      .limit(1);
    
    if (versionError) throw new ApiError(versionError.message, parseSupabaseErrorCode(versionError));
    
    // Determine the next version number
    let nextVersionNumber = 1;
    if (versions && versions.length > 0) {
      nextVersionNumber = versions[0].version_number + 1;
    }
    
    // Create the new version with the correct version number
    const versionToCreate = {
      ...version,
      version_number: nextVersionNumber
    };
    
    const { data, error } = await supabase
      .from('knowledge_source_versions')
      .insert([versionToCreate])
      .select();
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
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
    
    if (versionError) throw new ApiError(versionError.message, parseSupabaseErrorCode(versionError));
    if (!versionData) throw new Error('Version not found');
    
    // Update the source with content from the version
    return await updateKnowledgeSource(versionData.source_id, {
      content: versionData.content
    });
  } catch (error) {
    handleError(error, `Failed to restore version with ID: ${versionId}`);
    throw error;
  }
};
