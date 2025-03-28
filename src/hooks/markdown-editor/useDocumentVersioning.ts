
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
      const newVersion = {
        source_id: documentId,
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
      const { data, error } = await supabase.rpc('restore_knowledge_source_version', {
        version_id: versionId
      });
      
      if (error) throw error;
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
