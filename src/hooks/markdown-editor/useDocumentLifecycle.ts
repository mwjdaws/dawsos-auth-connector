
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';
import { validateDocumentTitle } from '@/utils/validation';
import { DocumentLifecycleProps, OperationResult, SaveHandlerOptions } from './types';

/**
 * Hook to manage common document lifecycle operations 
 * including validation, versioning, enrichment, and metadata updates
 */
export const useDocumentLifecycle = ({
  createVersion,
  enrichContentWithOntology
}: DocumentLifecycleProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Validate document title
   */
  const validateDocument = (title: string, isAutoSave = false): boolean => {
    // Skip validation for autosave
    if (isAutoSave) return true;
    
    const validation = validateDocumentTitle(title);
    if (!validation.isValid) {
      toast({
        title: "Invalid Title",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  /**
   * Create a version for the document
   */
  const createDocumentVersion = async (
    documentId: string, 
    content: string, 
    metadata: Record<string, any> = {},
    isAutoSave = false
  ): Promise<void> => {
    if (!documentId || documentId.startsWith('temp-') || !createVersion) {
      return;
    }
    
    // Skip version creation for auto-save to reduce database load
    if (isAutoSave) {
      return;
    }
    
    try {
      console.log('Creating version for document:', documentId);
      await createVersion(documentId, content, {
        ...metadata,
        auto_save: isAutoSave
      });
    } catch (error) {
      console.error('Error creating version:', error);
      // Silent failure for versioning - it shouldn't block the main operation
    }
  };

  /**
   * Enrich document content with ontology terms
   */
  const enrichDocumentContent = async (
    documentId: string, 
    content: string, 
    title: string,
    isAutoSave = false,
    isPublishing = false
  ): Promise<void> => {
    if (!documentId || documentId.startsWith('temp-') || !enrichContentWithOntology) {
      return;
    }
    
    // Skip enrichment for auto-save unless configuration specifies otherwise
    if (isAutoSave && !isPublishing) {
      return;
    }
    
    try {
      console.log('Running ontology enrichment for document:', documentId);
      
      // Auto-link terms for published content
      const autoLink = isPublishing;
      
      // Process in background, don't wait for result
      enrichContentWithOntology(
        documentId, 
        content, 
        title, 
        {
          autoLink,
          saveMetadata: true
        }
      ).catch(err => console.error('Background enrichment error:', err));
    } catch (error) {
      console.error('Error starting ontology enrichment:', error);
      // Silent failure for enrichment - it shouldn't block the main operation
    }
  };

  /**
   * Handle operation result with appropriate user feedback
   */
  const handleOperationResult = (
    result: OperationResult,
    successTitle: string,
    successMessage: string,
    failureTitle: string,
    isAutoSave = false
  ): OperationResult => {
    if (result.success && !isAutoSave) {
      toast({
        title: successTitle,
        description: successMessage,
      });
    } else if (!result.success && !isAutoSave) {
      handleError(
        result.error,
        failureTitle,
        { level: "error", technical: false }
      );
    }
    
    return result;
  };

  /**
   * Execute document operation with lifecycle management
   */
  const executeDocumentOperation = async <T extends OperationResult>(
    title: string,
    content: string,
    operation: () => Promise<T>,
    options: SaveHandlerOptions = {}
  ): Promise<T | { success: false, documentId: null, error: any }> => {
    const { isManualSave = true, isAutoSave = false, isPublishing = false } = options;
    
    // Skip validation for autosave
    if (!isAutoSave && !validateDocument(title, isAutoSave)) {
      return { success: false, documentId: null, error: "Validation failed" };
    }
    
    if (isManualSave) {
      setIsProcessing(true);
    }
    
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error('Operation failed:', error);
      
      if (!isAutoSave) {
        handleError(
          error,
          "An error occurred during the operation",
          { level: "error", technical: false }
        );
      }
      
      return { success: false, documentId: null, error };
    } finally {
      if (isManualSave) {
        setIsProcessing(false);
      }
    }
  };

  return {
    isProcessing,
    validateDocument,
    createDocumentVersion,
    enrichDocumentContent,
    handleOperationResult,
    executeDocumentOperation
  };
};
