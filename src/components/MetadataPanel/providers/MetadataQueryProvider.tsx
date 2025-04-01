
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetadataProvider } from '../hooks/useMetadataContext';
import { fetchKnowledgeSourceById } from '@/services/api/knowledgeSources';
import { Tag } from '@/types/tag';
import { OntologyTerm } from '@/types/ontology';
import { createContentIdValidationResult } from '@/utils/validation/types';
import { useTagOperations } from '../hooks/tag-operations/useTagOperations';
import { SourceMetadata } from '../types';

// Props interface for the provider
interface MetadataQueryProviderProps {
  contentId: string;
  isEditable?: boolean;
  children: React.ReactNode;
}

export const MetadataQueryProvider: React.FC<MetadataQueryProviderProps> = ({
  contentId,
  isEditable = false,
  children
}) => {
  // Get tag operations
  const {
    tags,
    isLoading: isTagsLoading,
    error: tagsError,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleRefresh: refreshTags
  } = useTagOperations(contentId);

  // Content validation
  const validationResult = createContentIdValidationResult({
    contentId,
    isValid: true,
    contentExists: true,
    errorMessage: null,
    message: null
  });

  // Source metadata query
  const { 
    data: sourceData,
    isLoading: isSourceLoading,
    error: sourceError,
    refetch: refetchSource
  } = useQuery({
    queryKey: contentId ? ['metadata', 'source', contentId] : null,
    queryFn: async () => {
      if (!contentId) return null;
      const data = await fetchKnowledgeSourceById(contentId);
      return data ? {
        id: data.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        user_id: data.user_id,
        created_by: data.created_by,
        published: data.published || false,
        published_at: data.published_at,
        external_source_url: data.external_source_url,
        external_source_checked_at: data.external_source_checked_at,
        external_content_hash: data.external_content_hash,
        needs_external_review: data.needs_external_review || false,
        template_id: data.template_id
      } as SourceMetadata : null;
    },
    enabled: !!contentId
  });

  // Combined refresh function
  const refreshMetadata = async () => {
    if (!contentId) return;
    
    try {
      await Promise.all([
        refetchSource(),
        refreshTags()
      ]);
    } catch (error) {
      console.error('Error refreshing metadata:', error);
    }
  };

  // Determine combined loading and error states
  const isLoading = isSourceLoading || isTagsLoading;
  const error = sourceError || tagsError;

  return (
    <MetadataProvider
      value={{
        contentId,
        tags,
        validationResult,
        isEditable,
        isLoading,
        error,
        sourceMetadata: sourceData,
        refreshMetadata,
        handleAddTag: async (tagName, typeId) => {
          if (!handleAddTag) return;
          setNewTag(tagName);
          await handleAddTag(typeId);
        },
        handleDeleteTag
      }}
    >
      {children}
    </MetadataProvider>
  );
};

export default MetadataQueryProvider;
