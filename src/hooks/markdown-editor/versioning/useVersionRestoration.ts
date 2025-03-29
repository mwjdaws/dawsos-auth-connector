
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for restoring document versions
 * 
 * Provides functionality to restore documents to previous versions
 * 
 * @returns Object with version restoration function
 */
export const useVersionRestoration = () => {
  /**
   * Restores a document to a previous version
   * 
   * @param versionId The ID of the version to restore
   * @returns Promise that resolves to a boolean indicating success
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
    restoreVersion
  };
};
