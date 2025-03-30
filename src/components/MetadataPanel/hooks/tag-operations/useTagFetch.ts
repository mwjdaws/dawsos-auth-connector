
/**
 * Tag Fetch Hook
 * 
 * A specialized hook for fetching tags with type information for the metadata panel.
 * Includes data validation, error handling, and transformation.
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Tag with optional type information
 */
interface TagWithType {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  tag_types?: {
    name: string;
  } | null;
  [key: string]: any; // Allow for additional properties
}

/**
 * Type guard to check if an object is a valid tag
 * Ensures proper type safety when working with database results
 * 
 * @param tag - Any object to check
 * @returns Type predicate indicating if the object is a valid TagWithType
 */
function isValidTag(tag: any): tag is TagWithType {
  return (
    tag &&
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.content_id === 'string'
  );
}

/**
 * Hook to fetch tags for a specific content ID with type information
 * 
 * @param contentId - The ID of the content to fetch tags for
 * @returns Query result with transformed tag data
 */
export const useTagFetch = (contentId: string) => {
  return useQuery({
    queryKey: ['tags', contentId],
    queryFn: async () => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      try {
        const { data, error } = await supabase
          .from('tags')
          .select('id, name, type_id, tag_types(name), content_id')
          .eq('content_id', contentId)
          .order('name', { ascending: true });

        if (error) throw error;

        if (!data || !Array.isArray(data)) return [];

        // Filter out any invalid data and transform to the expected format
        return data
          .filter(isValidTag)
          .map(tag => ({
            id: tag.id,
            name: tag.name,
            content_id: tag.content_id,
            type_id: tag.type_id,
            type_name: tag.tag_types?.name
          }));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch tags');
        handleError(error, 'Failed to fetch tags');
        throw error;
      }
    },
    enabled: isValidContentId(contentId),
    staleTime: 60000 // 1 minute
  });
};
