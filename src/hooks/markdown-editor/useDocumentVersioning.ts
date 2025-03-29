
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';

/**
 * Hook for managing document versioning functionality
 * 
 * This hook handles the creation and management of document versions,
 * allowing the system to track changes over time and restore previous
 * versions if needed.
 * 
 * @returns Object with version creation and management functions
 */
export const useDocumentVersioning = () => {
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  
  /**
   * Creates a new version of a document
   * 
   * @param documentId The ID of the document to version
   * @param content The content to save in this version
   * @param metadata Optional metadata to store with the version
   * @param isAutoSave Whether this is an autosave version (affects metadata)
   * @returns Promise that resolves when version is created
   */
  const createVersion = async (
    documentId: string, 
    content: string, 
    metadata: any = {},
    isAutoSave = false
  ): Promise<void> => {
    if (!documentId || documentId.startsWith('temp-')) {
      // Skip versioning for temporary documents
      return;
    }
    
    try {
      setIsCreatingVersion(true);
      
      // First, fetch the latest version number for this document
      const { data: versions, error: versionError } = await supabase
        .from('knowledge_source_versions')
        .select('version_number')
        .eq('source_id', documentId)
        .order('version_number', { ascending: false })
        .limit(1);
      
      if (versionError) {
        throw versionError;
      }
      
      // Calculate the next version number
      let nextVersionNumber = 1;
      if (versions && versions.length > 0) {
        nextVersionNumber = versions[0].version_number + 1;
      }
      
      // Prepare version metadata
      const versionMetadata = {
        ...metadata,
        isAutoSave,
        created_at: new Date().toISOString(),
      };
      
      // Create the new version
      const { error: insertError } = await supabase
        .from('knowledge_source_versions')
        .insert([{
          source_id: documentId,
          version_number: nextVersionNumber,
          content: content,
          metadata: versionMetadata
        }]);
      
      if (insertError) {
        throw insertError;
      }
      
      // Only show a toast for manual versions, not autosave
      if (!isAutoSave) {
        toast({
          title: "Version Created",
          description: `Version ${nextVersionNumber} of your document has been saved.`,
        });
      }
      
      console.log(`Created version ${nextVersionNumber} for document ${documentId}`);
      
    } catch (error) {
      console.error("Error creating document version:", error);
      handleError(
        error,
        "Failed to create document version",
        { level: "warning", silent: isAutoSave }
      );
    } finally {
      setIsCreatingVersion(false);
    }
  };
  
  /**
   * Restores a document to a previous version
   * 
   * @param versionId The ID of the version to restore
   * @returns Promise that resolves when version is restored
   */
  const restoreVersion = async (versionId: string): Promise<boolean> => {
    try {
      // First, get the version data
      const { data: version, error: versionError } = await supabase
        .from('knowledge_source_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (versionError || !version) {
        throw versionError || new Error('Version not found');
      }
      
      // Update the document with the version's content
      const { error: updateError } = await supabase
        .from('knowledge_sources')
        .update({
          content: version.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', version.source_id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Version Restored",
        description: `Document restored to version ${version.version_number}.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error restoring document version:", error);
      handleError(
        error,
        "Failed to restore document version",
        { level: "error" }
      );
      return false;
    }
  };
  
  return {
    createVersion,
    restoreVersion,
    isCreatingVersion
  };
};
