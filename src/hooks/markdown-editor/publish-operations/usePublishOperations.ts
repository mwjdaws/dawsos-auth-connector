
import { useState } from 'react';
import { handleError } from '@/utils/error-handling';
import { ErrorLevel } from '@/utils/errors/types';
import { usePublishDatabase } from './usePublishDatabase';
import { usePublishValidation } from './usePublishValidation';
import { DocumentOperationResult, PublishResult } from '../types';

interface UsePublishOperationsProps {
  saveDraft: (title: string, content: string, templateId: string | null, externalSourceUrl: string, userId?: string) => Promise<string | null>;
}

/**
 * Hook for handling document publish operations with validation
 */
export const usePublishOperations = ({ saveDraft }: UsePublishOperationsProps) => {
  const [error, setError] = useState<Error | null>(null);
  
  // Use database operations
  const { publishToDatabase } = usePublishDatabase();
  
  // Use validation
  const { validatePublish } = usePublishValidation();
  
  /**
   * Publish a document with validation
   */
  const publishDocument = async (
    title: string,
    content: string,
    templateId: string | null,
    externalSourceUrl: string,
    userId?: string
  ): Promise<DocumentOperationResult> => {
    try {
      setError(null);
      
      // Validate inputs
      const validation = validatePublish(title, content);
      if (!validation.isValid) {
        throw new Error(validation.errorMessage || 'Invalid document');
      }
      
      // First save draft to ensure content is saved
      const documentId = await saveDraft(title, content, templateId, externalSourceUrl, userId);
      
      if (!documentId) {
        throw new Error('Failed to save draft before publishing');
      }
      
      // Then publish the content
      const result = await publishToDatabase(documentId);
      
      return {
        success: true,
        contentId: documentId
      };
    } catch (err) {
      console.error('Error publishing document:', err);
      
      // Handle error
      handleError(
        err,
        'Failed to publish document',
        { 
          level: ErrorLevel.Warning,
          source: 'app'
        }
      );
      
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      return {
        success: false,
        contentId: null,
        error: err
      };
    }
  };
  
  return {
    publishDocument,
    error
  };
};
