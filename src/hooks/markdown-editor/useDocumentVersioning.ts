
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchKnowledgeSourceVersions } from '@/services/api/knowledgeSourceVersions';
import { handleError } from '@/utils/error-handling';

interface DocumentVersion {
  id: string;
  version_number: number;
  content: string;
  created_at: string;
  metadata?: any;
}

/**
 * Hook for managing document version history
 */
export const useDocumentVersioning = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);

  /**
   * Fetch version history for a document
   */
  const fetchVersions = async (documentId: string) => {
    // Skip operation for temporary IDs
    if (documentId.startsWith('temp-')) {
      setVersions([]);
      return [];
    }
    
    setIsLoading(true);
    try {
      const data = await fetchKnowledgeSourceVersions(documentId);
      setVersions(data || []);
      return data;
    } catch (error) {
      console.error('Failed to load versions:', error);
      handleError(
        error,
        "Failed to load version history",
        { level: "warning" }
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new version of a document
   */
  const createVersion = async (
    documentId: string,
    content: string,
    metadata: Record<string, any> = {}
  ) => {
    // Skip version creation for temporary IDs
    if (!documentId || documentId.startsWith('temp-')) {
      return null;
    }
    
    try {
      // First, get the latest version number for this source
      const { data: versions, error: versionError } = await supabase
        .from('knowledge_source_versions')
        .select('version_number')
        .eq('source_id', documentId)
        .order('version_number', { ascending: false })
        .limit(1);
      
      if (versionError) throw versionError;
      
      // Determine the next version number
      let nextVersionNumber = 1;
      if (versions && versions.length > 0) {
        nextVersionNumber = versions[0].version_number + 1;
      }
      
      // Create new version with explicit version number
      const newVersion = {
        source_id: documentId,
        version_number: nextVersionNumber,
        content,
        metadata
      };
      
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .insert(newVersion)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the versions list
      await fetchVersions(documentId);
      
      return data;
    } catch (error) {
      console.error('Failed to create version:', error);
      // Silent failure for versioning - it shouldn't block the main operation
      return null;
    }
  };

  /**
   * Restore a specific version of a document
   */
  const restoreVersion = async (versionId: string) => {
    setIsLoading(true);
    try {
      // Call the restore_knowledge_source_version function
      // Fix: Use a more generic approach instead of .rpc with a specific function name
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .select('source_id, content')
        .eq('id', versionId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Version not found');
      }
      
      // Create a backup of the current state
      const { data: currentSource, error: sourceError } = await supabase
        .from('knowledge_sources')
        .select('content')
        .eq('id', data.source_id)
        .single();
        
      if (sourceError) throw sourceError;
      
      if (currentSource) {
        // Create a backup before restoring
        await createVersion(data.source_id, currentSource.content, {
          restore_operation: `backup_before_restoring_${versionId}`
        });
      }
      
      // Update the source with the version content
      const { error: updateError } = await supabase
        .from('knowledge_sources')
        .update({ content: data.content })
        .eq('id', data.source_id);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error('Failed to restore version:', error);
      handleError(
        error,
        "Failed to restore version",
        { level: "error" }
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    versions,
    isLoading,
    fetchVersions,
    createVersion,
    restoreVersion
  };
};
