
import { toast } from '@/hooks/use-toast';
import { useDocumentLifecycle } from '../useDocumentLifecycle';

interface UsePublishHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  saveDraft: (options?: any) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined) => Promise<any>;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

export const usePublishHandler = ({
  title,
  content,
  templateId,
  externalSourceUrl,
  saveDraft,
  publishDocument,
  onPublish,
  createVersion,
  enrichContentWithOntology
}: UsePublishHandlerProps) => {
  // Use the document lifecycle hook
  const { 
    validateDocument, 
    createDocumentVersion, 
    enrichDocumentContent 
  } = useDocumentLifecycle({
    createVersion,
    enrichContentWithOntology
  });
  
  /**
   * Publish the document with user feedback
   */
  const handlePublish = async () => {
    // Validate the document before publishing
    if (!validateDocument(title, false)) {
      return;
    }
    
    try {
      // Save first to ensure we have the latest content
      const savedId = await saveDraft({ isManualSave: true, isAutoSave: false });
      if (!savedId) {
        toast({
          title: "Save Required",
          description: "Your document must be saved before publishing",
          variant: "destructive",
        });
        return;
      }
      
      // Get current user ID (from auth context if available)
      const userId = undefined; // Replace with actual user ID from auth context if available
      
      const result = await publishDocument(title, content, templateId, externalSourceUrl, userId);
      
      if (result.success) {
        // Create a version for the published document
        if (result.documentId) {
          await createDocumentVersion(
            result.documentId, 
            content, 
            {
              reason: 'Published document',
              published: true
            },
            false
          );
        }
        
        // Run ontology enrichment after successful publish
        if (result.documentId) {
          await enrichDocumentContent(
            result.documentId,
            content,
            title,
            false,
            true  // isPublishing = true
          );
        }
        
        toast({
          title: "Published Successfully",
          description: "Your document has been published",
        });
        
        // Call the onPublish callback if provided
        if (onPublish && result.documentId) {
          try {
            onPublish(result.documentId, title, content, templateId, externalSourceUrl);
          } catch (callbackError) {
            console.error('Error in onPublish callback:', callbackError);
          }
        }
      } else {
        throw new Error(result.error || 'Failed to publish document');
      }
    } catch (error) {
      toast({
        title: "Failed to publish document",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    handlePublish
  };
};
