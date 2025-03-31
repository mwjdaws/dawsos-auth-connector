
/**
 * useTagsQuery Hook
 * 
 * Custom hook for fetching tags with React Query
 */
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Tag } from '@/types/tag';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors/handle';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

/**
 * Interface for options passed to useTagsQuery
 */
export interface UseTagsQueryOptions extends Omit<UseQueryOptions<Tag[], Error, Tag[], string[]>, 'queryKey' | 'queryFn'> {
  includeTypeInfo?: boolean;
}

/**
 * Fetches tags for a specific content ID
 * 
 * @param contentId The ID of the content to fetch tags for
 * @param includeTypeInfo Whether to include tag type information
 * @returns Promise with the fetched tags
 */
const fetchTags = async (contentId: string, includeTypeInfo: boolean = false): Promise<Tag[]> => {
  try {
    let query = supabase
      .from('tags')
      .select(
        includeTypeInfo
          ? 'id, name, content_id, type_id, display_order, tag_types(name)'
          : 'id, name, content_id, type_id, display_order'
      )
      .eq('content_id', contentId)
      .order('display_order', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Process the tags to ensure they have the correct format
    // This includes extracting the tag_type name if included
    const tags = data.map((tag: any) => {
      return {
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        type_name: tag.tag_types ? tag.tag_types.name : null,
        display_order: tag.display_order
      } as Tag;
    });

    return tags;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch tags",
      { level: "warning" }
    );
    throw error;
  }
};

/**
 * React Query hook for fetching tags
 * 
 * @param contentId The ID of the content to fetch tags for
 * @param options Additional options for the query
 * @returns React Query result with tags data
 */
export function useTagsQuery(contentId: string, options: UseTagsQueryOptions = {}) {
  const { includeTypeInfo = false, ...queryOptions } = options;
  const enabled = options.enabled !== undefined ? options.enabled : !!contentId && isValidContentId(contentId);

  return useQuery<Tag[], Error>({
    queryKey: contentId ? ['tags', contentId, { includeTypeInfo }] : undefined,
    queryFn: () => fetchTags(contentId, includeTypeInfo),
    enabled,
    staleTime: 60000, // 1 minute
    ...queryOptions,
  });
}
