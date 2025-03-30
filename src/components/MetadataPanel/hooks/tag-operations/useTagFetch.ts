
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { Tag } from './types';

export function useTagFetch(contentId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch tags for a specific content ID
   */
  const fetchTags = async (): Promise<Tag[]> => {
    if (!isValidContentId(contentId)) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch tags with type info if available
      const { data, error: fetchError } = await supabase
        .from('tags')
        .select(`
          id,
          name,
          content_id,
          type_id,
          tag_types (
            id,
            name
          )
        `)
        .eq('content_id', contentId);

      if (fetchError) throw fetchError;

      // Transform the data to include type_name
      const tagsWithTypes = (data || []).map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        type_name: tag.tag_types ? tag.tag_types.name : null
      }));

      // Cast the type to satisfy the TypeScript compiler and fix null vs undefined issues
      const typedTags: Tag[] = tagsWithTypes.map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id || contentId, // Fallback to current contentId if null
        type_id: tag.type_id,
        type_name: tag.type_name
      }));
      
      return typedTags;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      setError(error);
      console.error('Error fetching tags:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchTags,
    isLoading,
    error
  };
}
