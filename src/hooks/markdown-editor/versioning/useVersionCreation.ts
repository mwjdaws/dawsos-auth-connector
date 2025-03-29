
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for creating document versions
 * 
 * Manages the creation state and error handling for version creation operations
 * 
 * @returns Object with version creation state and function
 */
export const useVersionCreation = () => {
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

  return {
    isCreatingVersion,
    createVersion
  };
};
