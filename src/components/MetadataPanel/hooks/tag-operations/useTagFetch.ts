
import { useState, useCallback } from 'react';
import { useTagsQuery } from '@/hooks/metadata/useTagsQuery';
import { Tag, UseTagFetchProps, UseTagFetchResult } from './types';

// Helper function to map API tags to internal Tag type
function mapApiTagToTag(apiTag: any): Tag {
  return {
    id: typeof apiTag.id === 'string' ? apiTag.id : '',
    name: typeof apiTag.name === 'string' ? apiTag.name : '',
    content_id: typeof apiTag.content_id === 'string' ? apiTag.content_id : '',
    type_id: typeof apiTag.type_id === 'string' ? apiTag.type_id : null,
    type_name: apiTag.tag_types && typeof apiTag.tag_types.name === 'string' 
      ? apiTag.tag_types.name 
      : null
  };
}

export function useTagFetch({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchProps): UseTagFetchResult {
  // We track loading and error state in the parent useTagState
  // but need local state to manage suspense boundaries
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);
  const [localTags, setLocalTags] = useState<Tag[]>([]);
  
  // Direct query hook for backward compatibility
  const tagsQuery = useTagsQuery(contentId);
  
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) {
      return [];
    }
    
    try {
      setIsLoading(true);
      setLocalLoading(true);
      
      // Use the refetch method for the latest data
      await tagsQuery.refetch();
      
      // Use the data from the query
      if (tagsQuery.data) {
        const formattedTags = tagsQuery.data.map(tag => mapApiTagToTag(tag));
        setTags(formattedTags);
        setLocalTags(formattedTags);
        return formattedTags;
      }
      
      // If all else fails, return empty array
      return [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      setError(error);
      setLocalError(error);
      return [];
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  }, [contentId, tagsQuery, setTags, setIsLoading, setError]);
  
  return {
    fetchTags,
    isLoading: localLoading,
    error: localError,
    tags: localTags
  };
}
