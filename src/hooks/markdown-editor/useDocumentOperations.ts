
import { useState } from 'react';
import { useDocumentVersioning } from './useDocumentVersioning';
import { useDraftOperations } from './useDraftOperations';
import { usePublishOperations } from './usePublishOperations';
import { DocumentOperationsProps } from './types';

/**
 * Main hook for document operations including saving and publishing
 */
export const useDocumentOperations = ({
  documentId,
  onSaveDraft,
  onPublish
}: DocumentOperationsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { createVersion } = useDocumentVersioning();
  
  // Use the draft operations
  const { saveDraft: saveDraftOperation } = useDraftOperations({ createVersion });
  
  /**
   * Save document as a draft with state handling
   */
  const saveDraft = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined,
    isAutoSave = false
  ) => {
    setIsSaving(true);
    try {
      const result = await saveDraftOperation(title, content, templateId, userId, documentId, isAutoSave);
      
      if (result.success && result.documentId && onSaveDraft) {
        onSaveDraft(result.documentId, title, content, templateId);
      }
      
      return result.documentId;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Use the publish operations with the saveDraft function
  const { publishDocument: publishDocumentOperation } = usePublishOperations({ 
    saveDraft: (title, content, templateId, userId, isAutoSave) => 
      saveDraft(title, content, templateId, userId, isAutoSave) 
  });
  
  /**
   * Publish document with state handling
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    userId: string | undefined
  ) => {
    setIsPublishing(true);
    try {
      const result = await publishDocumentOperation(title, content, templateId, userId);
      
      if (result.success && result.documentId && onPublish) {
        onPublish(result.documentId, title, content, templateId);
      }
      
      return result;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    isSaving,
    isPublishing,
    saveDraft,
    publishDocument
  };
};
