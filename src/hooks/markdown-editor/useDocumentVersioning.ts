
import { supabase } from '@/integrations/supabase/client';
import { createKnowledgeSourceVersion, restoreKnowledgeSourceVersion } from '@/services/api/knowledgeSourceVersions';
import { toast } from '@/hooks/use-toast';

interface DocumentData {
  id: string;
  title: string;
  content: string;
  templateId: string | null;
  userId: string | undefined;
}

/**
 * Hook for handling document versioning operations
 */
export const useDocumentVersioning = () => {
  /**
   * Creates a version of the current document content
   * @param documentId The document ID
   * @param isAutoSave Whether this is triggered by autosave
   * @param metadata Additional metadata to store with the version
   */
  const createVersion = async (
    documentId: string, 
    isAutoSave = false,
    metadata: Record<string, any> = {}
  ) => {
    try {
      // Fetch the current content to save as a version
      const { data: currentDocument, error: fetchError } = await supabase
        .from('knowledge_sources')
        .select('content, user_id')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current document content:', fetchError);
        return false;
      } 
      
      if (currentDocument) {
        // Create a version record with enhanced metadata
        const versionMetadata = {
          saved_from: isAutoSave ? "auto_save" : "manual_save",
          saved_by: currentDocument.user_id || null,
          ...metadata
        };

        // Create the version
        await createKnowledgeSourceVersion({
          source_id: documentId,
          version_number: 1, // The API will determine the correct version number
          content: currentDocument.content,
          metadata: versionMetadata
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating version:', error);
      return false;
    }
  };

  /**
   * Loads a specific version of a document
   * @param versionId The version ID to load
   */
  const loadVersion = async (versionId: string) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (error) {
        throw new Error(`Failed to load version: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error loading version:', error);
      toast({
        title: "Error Loading Version",
        description: "Failed to load the requested version",
        variant: "destructive"
      });
      return null;
    }
  };

  /**
   * Restores a specific version of a document
   * @param versionId The version ID to restore
   */
  const restoreVersion = async (versionId: string) => {
    try {
      // First create a new version of the current state as a backup
      const { data: versionData, error: versionError } = await supabase
        .from('knowledge_source_versions')
        .select('source_id')
        .eq('id', versionId)
        .single();
        
      if (versionError) {
        throw new Error(`Failed to get version info: ${versionError.message}`);
      }
      
      // Create a backup of the current state
      const backupCreated = await createVersion(versionData.source_id, false, {
        restore_operation: `backup_before_restoring_${versionId}`
      });
      
      if (!backupCreated) {
        console.warn('Could not create backup before restoring version');
      }
      
      // Now restore the version
      await restoreKnowledgeSourceVersion(versionId);
      
      toast({
        title: "Version Restored",
        description: "The selected version has been restored successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: "Error Restoring Version",
        description: "Failed to restore the selected version",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createVersion,
    loadVersion,
    restoreVersion
  };
};
