
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
      // Important: We always save before publishing to ensure content consistency
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
      
      // Call publish operation AFTER saving
      const result = await publishDocument(title, content, templateId, externalSourceUrl, userId);
      
      if (result.success) {
        // Create a version for the published document with proper metadata
        // Important: Version is created AFTER successful publish
        if (result.documentId) {
          await createDocumentVersion(
            result.documentId, 
            content, 
            {
              reason: 'Published document',
              published: true,
              publishedAt: new Date().toISOString()
            },
            false // Never autosave for publishing
          );
        }
        
        // Run ontology enrichment after successful publish
        // Important: Enrichment happens AFTER version creation
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
        // Improved error handling: Convert error object to string if needed
        const errorMessage = result.error && typeof result.error === 'object' 
          ? (result.error.message || JSON.stringify(result.error))
          : result.error || 'Failed to publish document';
          
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (typeof error === 'object' ? JSON.stringify(error) : "An unexpected error occurred");
        
      toast({
        title: "Failed to publish document",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    handlePublish
  };
};
