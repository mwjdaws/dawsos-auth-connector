
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { validateDocumentTitle } from '@/utils/validation';

interface UsePublishHandlerProps {
  title: string;
  content: string;
  templateId: string | null;
  externalSourceUrl: string;
  saveDraft: (options?: any) => Promise<string | null>;
  publishDocument: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId: string | undefined) => Promise<any>;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  createVersion: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

export const usePublishHandler = ({
  title,
  content,
  templateId,
  externalSourceUrl,
  saveDraft,
  publishDocument,
  onPublish,
  createVersion
}: UsePublishHandlerProps) => {
  /**
   * Publish the document with user feedback
   */
  const handlePublish = async () => {
    // Always validate title for publishing
    const validation = validateDocumentTitle(title);
    if (!validation.isValid) {
      toast({
        title: "Invalid Title",
        description: validation.errorMessage,
        variant: "destructive",
      });
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
          try {
            console.log('Creating version after publish for document:', result.documentId);
            await createVersion(result.documentId, content, {
              reason: 'Published document',
              published: true
            });
          } catch (versionError) {
            console.error('Error creating version after publish:', versionError);
          }
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
      handleError(
        error,
        "Failed to publish document",
        { level: "error", technical: false }
      );
    }
  };

  return {
    handlePublish
  };
};
