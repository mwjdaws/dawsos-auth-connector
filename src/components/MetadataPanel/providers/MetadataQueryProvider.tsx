
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetadataProvider } from '../hooks/useMetadataContext';
import { useTagOperations } from '../hooks/tag-operations';
import { createValidationResult } from '@/utils/validation/utils';
import { useContentValidator } from '@/hooks/validation/useContentValidator';
import { createComponentErrorHandler } from '@/utils/errors/wrappers';

const handleError = createComponentErrorHandler('MetadataQueryProvider');

interface MetadataQueryProviderProps {
  contentId: string;
  isEditable?: boolean;
  children: React.ReactNode;
}

/**
 * Provider that handles metadata fetching with React Query
 * and provides data via MetadataContext
 */
export const MetadataQueryProvider: React.FC<MetadataQueryProviderProps> = ({
  contentId,
  isEditable = false,
  children
}) => {
  // Validate the content ID
  const contentValidation = useContentValidator(contentId);
  
  // Get tag operations
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    handleAddTag,
    handleDeleteTag,
    handleRefresh: refreshTags
  } = useTagOperations(contentId);
  
  // Get source metadata
  const { 
    data: sourceMetadata,
    isLoading: isSourceLoading,
    error: sourceError 
  } = useQuery({
    queryKey: ['sourceMetadata', contentId],
    queryFn: async () => {
      // In a real implementation, this would fetch from the API
      // For now, we'll return mock data
      return {
        id: contentId,
        title: 'Sample content',
        external_source_url: "https://example.com/article",
        external_source_checked_at: new Date().toISOString(),
        needs_external_review: false,
        published: true,
        updated_at: new Date().toISOString()
      };
    },
    enabled: contentValidation.isValid
  });
  
  // Combined loading and error states
  const isLoading = isTagsLoading || isSourceLoading;
  const error = tagsError || sourceError;
  
  // Refresh all metadata
  const refreshMetadata = async () => {
    try {
      await refreshTags();
      // Additional refresh logic would go here
    } catch (err) {
      handleError(err, "Failed to refresh metadata", {
        context: { contentId }
      });
    }
  };
  
  // The context value
  const contextValue = {
    contentId,
    tags,
    validationResult: contentValidation,
    isEditable,
    isLoading,
    error: error instanceof Error ? error : null,
    sourceMetadata,
    refreshMetadata,
    handleAddTag,
    handleDeleteTag
  };
  
  return (
    <MetadataProvider value={contextValue}>
      {children}
    </MetadataProvider>
  );
};
