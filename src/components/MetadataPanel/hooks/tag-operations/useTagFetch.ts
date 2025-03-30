
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { Tag, UseTagFetchProps } from './types';

export function useTagFetch({ 
  contentId, 
  setTags, 
  setIsLoading, 
  setError 
}: UseTagFetchProps) {
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);
  
  // Set internal loading state while providing external state control
  const updateLoading = (state: boolean) => {
    setLoading(state);
    if (setIsLoading) setIsLoading(state);
  };
  
  // Set internal error state while providing external state control
  const updateError = (err: Error | null) => {
    setErrorState(err);
    if (setError) setError(err);
  };
  
  const fetchTags = async (): Promise<Tag[]> => {
    if (!contentId || !isValidContentId(contentId)) {
      return [];
    }
    
    updateLoading(true);
    updateError(null);
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, content_id, type_id, tag_types:type_id (name)')
        .eq('content_id', contentId);
      
      if (error) {
        throw error;
      }
      
      // Convert to Tags and ensure all fields are properly typed
      const mappedTags = (data || []).map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id || contentId, // Use contentId as fallback
        type_id: tag.type_id,
        type_name: tag.tag_types ? tag.tag_types.name : null
      }));
      
      setTags(mappedTags as Tag[]);
      return mappedTags as Tag[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching tags');
      updateError(error);
      console.error('Error fetching tags:', error);
      return [];
    } finally {
      updateLoading(false);
    }
  };
  
  return {
    fetchTags,
    isLoading: loading,
    error
  };
}
