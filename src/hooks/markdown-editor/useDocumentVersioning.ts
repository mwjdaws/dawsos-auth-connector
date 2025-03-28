
import { supabase } from '@/integrations/supabase/client';
import { createKnowledgeSourceVersion } from '@/services/api/knowledgeSourceVersions';
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
   */
  const createVersion = async (documentId: string, isAutoSave = false) => {
    try {
      // Fetch the current content to save as a version
      const { data: currentDocument, error: fetchError } = await supabase
        .from('knowledge_sources')
        .select('content')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current document content:', fetchError);
        return false;
      } 
      
      if (currentDocument) {
        // Create a version record
        await createKnowledgeSourceVersion({
          source_id: documentId,
          version_number: 1, // The API will determine the correct version number
          content: currentDocument.content,
          metadata: { saved_from: isAutoSave ? "auto_save" : "manual_save" }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating version:', error);
      return false;
    }
  };

  return {
    createVersion
  };
};
