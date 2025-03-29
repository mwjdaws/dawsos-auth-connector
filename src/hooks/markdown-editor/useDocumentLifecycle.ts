
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { DocumentLifecycleProps } from './types';

/**
 * Hook that manages document lifecycle operations like validation,
 * versioning, and content enrichment.
 * 
 * This hook centralizes the document lifecycle logic that was previously
 * scattered across multiple handlers.
 * 
 * @param props Functions for versioning and content enrichment
 * @returns Object with document lifecycle management functions
 */
export const useDocumentLifecycle = (props: DocumentLifecycleProps) => {
  const { createVersion, enrichContentWithOntology } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Validates a document before save or publish operations
   * 
   * @param title The document title to validate
   * @param isAutoSave Whether this is an autosave operation (less strict validation)
   * @returns Boolean indicating if the document is valid
   */
  const validateDocument = (title: string, isAutoSave = false): boolean => {
    // Skip title validation for autosave
    if (isAutoSave) return true;
    
    // Title is required for manual saves and publishing
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
   * Creates a version of the document content
   * 
   * @param documentId The ID of the document
   * @param content The content to version
   * @param metadata Optional metadata to store with the version
   * @param showToast Whether to show a toast notification
   * @returns Promise that resolves when version is created
   */
  const createDocumentVersion = async (
    documentId: string, 
    content: string, 
    metadata?: any,
    showToast = true
  ): Promise<void> => {
    if (!createVersion || !documentId) return;
    
    try {
      await createVersion(documentId, content, metadata);
      
      if (showToast) {
        toast({
          title: "Version Created",
          description: "A new version of your document has been saved",
        });
      }
    } catch (error) {
      console.error("Error creating document version:", error);
      
      if (showToast) {
        toast({
          title: "Version Creation Failed",
          description: "Failed to create a new version of your document",
          variant: "destructive",
        });
      }
    }
  };
  
  /**
   * Enriches document content with ontology terms and relationships
   * 
   * @param sourceId The document source ID
   * @param content The document content
   * @param title The document title
   * @param showToast Whether to show toast notifications
   * @param isPublishing Whether this enrichment is part of a publish operation
   * @returns Promise that resolves when enrichment is complete
   */
  const enrichDocumentContent = async (
    sourceId: string,
    content: string,
    title: string,
    showToast = true,
    isPublishing = false
  ): Promise<void> => {
    if (!enrichContentWithOntology || !sourceId) return;
    
    setIsProcessing(true);
    try {
      const options = {
        isPublishing,
        autoSave: !isPublishing
      };
      
      await enrichContentWithOntology(sourceId, content, title, options);
      
      if (showToast) {
        toast({
          title: "Content Enriched",
          description: "Your document has been enriched with ontology terms",
        });
      }
    } catch (error) {
      console.error("Error enriching document content:", error);
      
      if (showToast) {
        toast({
          title: "Enrichment Failed",
          description: "Failed to enrich your document with ontology terms",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    validateDocument,
    createDocumentVersion,
    enrichDocumentContent,
    isProcessing
  };
};
