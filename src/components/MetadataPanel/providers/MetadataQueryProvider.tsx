
import React, { useCallback } from 'react';
import { useTagsQuery, useTagMutations } from '@/hooks/metadata';
import { useSourceMetadata } from '../hooks/useSourceMetadata';
import { useContentValidator } from '@/hooks/validation/useContentValidator';
import { MetadataProvider, MetadataContextProps } from '../hooks/useMetadataContext';
import { createValidResult } from '@/utils/validation/types';
import { handleError } from '@/utils/errors/handle';

interface MetadataQueryProviderProps {
  contentId: string;
  isEditable?: boolean;
  children: React.ReactNode;
}

/**
 * A production-ready MetadataProvider implementation that integrates
 * with React Query to fetch and manage metadata.
 */
export const MetadataQueryProvider: React.FC<MetadataQueryProviderProps> = ({
  contentId,
  isEditable = true,
  children
}) => {
  // Validate content
  const validationResult = useContentValidator(contentId);
  
  // Fetch tags with React Query
  const { 
    data: tags = [], 
    isLoading: isTagsLoading,
    error: tagsError,
    refetch: refetchTags
  } = useTagsQuery(contentId, {
    enabled: validationResult.isValid
  });

  // Tag mutation hooks
  const {
    addTag,
    deleteTag,
    isAddingTag,
    isDeletingTag
  } = useTagMutations();

  // Source metadata
  const {
    data: sourceMetadata,
    isLoading: isSourceLoading,
    error: sourceError,
    fetchSourceMetadata,
  } = useSourceMetadata({
    contentId,
    enabled: validationResult.isValid
  });

  // Combined loading and error states
  const isLoading = isTagsLoading || isSourceLoading || isAddingTag || isDeletingTag;
  const error = tagsError || sourceError;

  // Handle tag addition
  const handleAddTag = useCallback(async (tagName: string, typeId?: string | null) => {
    if (!validationResult.isValid) {
      throw new Error(`Cannot add tag to invalid content: ${validationResult.errorMessage}`);
    }

    try {
      await addTag({
        contentId,
        name: tagName,
        typeId
      });
      
      return true;
    } catch (err) {
      handleError(err, `Failed to add tag "${tagName}"`, {
        context: { contentId },
        level: 'warning'
      });
      throw err;
    }
  }, [contentId, addTag, validationResult]);

  // Handle tag deletion
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!validationResult.isValid) {
      throw new Error(`Cannot delete tag from invalid content: ${validationResult.errorMessage}`);
    }

    try {
      await deleteTag({
        contentId,
        tagId
      });
      
      return true;
    } catch (err) {
      handleError(err, 'Failed to delete tag', {
        context: { contentId, tagId },
        level: 'warning'
      });
      throw err;
    }
  }, [contentId, deleteTag, validationResult]);

  // Refresh metadata
  const refreshMetadata = useCallback(async () => {
    if (!validationResult.isValid) return;
    
    try {
      await Promise.all([
        fetchSourceMetadata(),
        refetchTags()
      ]);
    } catch (err) {
      handleError(err, 'Error refreshing metadata', {
        context: { contentId },
        level: 'warning'
      });
    }
  }, [contentId, validationResult.isValid, fetchSourceMetadata, refetchTags]);

  // Fetch tags manually (useful for imperative calls)
  const fetchTags = useCallback(async (): Promise<any[]> => {
    await refetchTags();
    return tags;
  }, [refetchTags, tags]);

  // Construct the context value
  const contextValue: MetadataContextProps = {
    contentId,
    tags,
    validationResult: validationResult.isValid 
      ? validationResult 
      : createValidResult('Content is valid'),
    isEditable,
    isLoading,
    error: error instanceof Error ? error : null,
    sourceMetadata,
    refreshMetadata,
    fetchTags,
    handleAddTag,
    handleDeleteTag
  };

  return (
    <MetadataProvider value={contextValue}>
      {children}
    </MetadataProvider>
  );
};

export default MetadataQueryProvider;
