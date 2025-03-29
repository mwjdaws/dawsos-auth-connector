
import { toast } from '@/hooks/use-toast';

interface UseDocumentLifecycleProps {
  createVersion?: (documentId: string, content: string, metadata?: any, isAutoSave?: boolean) => Promise<void>;
  enrichContentWithOntology?: (sourceId: string, content: string, title: string, options?: any) => Promise<any>;
}

/**
 * Hook for managing document lifecycle operations
 * 
 * This hook provides utilities for validating, versioning, and enriching documents
 * during their lifecycle (create, save, publish, etc.)
 * 
 * @param props Hook configuration options
 * @returns Object with lifecycle management functions
 */
export const useDocumentLifecycle = ({
  createVersion,
  enrichContentWithOntology
}: UseDocumentLifecycleProps) => {
  /**
   * Validate a document before saving or publishing
   * 
   * @param title Document title to validate
   * @param isAutoSave Whether this is an autosave (less strict validation)
   * @returns Whether the document is valid
   */
  const validateDocument = (title: string, isAutoSave: boolean): boolean => {
    // For autosave, we're less strict with validation
    if (isAutoSave) return true;
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your document",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  /**
   * Create a version of a document during lifecycle operations
   * 
   * This ensures versions are created consistently across all document operations
   * 
   * @param documentId The document ID
   * @param content Document content
   * @param metadata Version metadata
   * @param isAutoSave Whether this is an autosave
   * @returns Promise that resolves when version is created
   */
  const createDocumentVersion = async (
    documentId: string,
    content: string,
    metadata: any = {},
    isAutoSave: boolean = false
  ): Promise<void> => {
    // Skip version creation for autosaves to reduce database load
    if (isAutoSave || !createVersion) {
      return;
    }
    
    try {
      console.log(`Creating document version for document: ${documentId}, isAutoSave: ${isAutoSave}`);
      
      // Add consistent metadata
      const versionMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        isAutoSave
      };
      
      await createVersion(documentId, content, versionMetadata, isAutoSave);
    } catch (error) {
      console.error("Error creating document version:", error);
      // Don't throw - version creation should not block the main operation
    }
  };
  
  /**
   * Enrich document content with ontology terms
   * 
   * This operation should always happen after saving or publishing
   * 
   * @param documentId The document ID
   * @param content Document content
   * @param title Document title
   * @param isAutoSave Whether this is an autosave
   * @param isPublishing Whether this is a publish operation
   * @returns Promise that resolves when enrichment is complete
   */
  const enrichDocumentContent = async (
    documentId: string,
    content: string,
    title: string,
    isAutoSave: boolean = false,
    isPublishing: boolean = false
  ): Promise<void> => {
    // Skip enrichment for autosaves and if enrichment is not available
    if ((isAutoSave && !isPublishing) || !enrichContentWithOntology) {
      return;
    }
    
    try {
      console.log(`Enriching document content for document: ${documentId}, isPublishing: ${isPublishing}`);
      
      // Set priority based on operation type
      const priority = isPublishing ? 'high' : 'normal';
      
      await enrichContentWithOntology(documentId, content, title, { 
        priority,
        isPublished: isPublishing,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error enriching document content:", error);
      // Don't throw - enrichment should not block the main operation
    }
  };
  
  return {
    validateDocument,
    createDocumentVersion,
    enrichDocumentContent
  };
};
