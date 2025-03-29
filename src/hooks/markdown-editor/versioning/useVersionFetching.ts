
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { KnowledgeSourceVersion } from '@/services/api/types';

/**
 * Hook for fetching document versions
 * 
 * Manages the loading state and error handling for version retrieval operations
 * 
 * @returns Object with version fetching state and function
 */
export const useVersionFetching = () => {
  const [versions, setVersions] = useState<KnowledgeSourceVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Fetches all versions for a specific document
   * 
   * @param documentId The ID of the document to fetch versions for
   * @returns Promise that resolves when versions are fetched
   */
  const fetchVersions = async (documentId: string): Promise<void> => {
    if (!documentId) {
      return;
    }
    
    // Skip fetching versions for temporary documents (starts with "temp-")
    if (documentId.startsWith('temp-')) {
      console.log("Skipping version fetch for temporary document:", documentId);
      setVersions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .select('*')
        .eq('source_id', documentId)
        .order('version_number', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setVersions(data || []);
    } catch (error) {
      console.error("Error fetching document versions:", error);
      handleError(
        error,
        "Failed to fetch document versions",
        { level: "warning" }
      );
      setVersions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    versions,
    isLoading,
    fetchVersions
  };
};
