
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sortTagsByDisplayOrder } from '@/utils/metadata/tagUtils';
import { Tag, isValidTag } from '@/types/tag';
import { handleError } from '@/utils/error-handling';
import { isValidContentId, tryParseContentIdAsUUID } from '@/utils/content-validation';

interface UseTagsQueryOptions {
  enabled?: boolean;
  includeTypeInfo?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
}

/**
 * Fetch tags for a specific content
 * 
 * @param contentId ID of the content to fetch tags for
 * @param options Query options
 * @returns Promise resolving to an array of tags
 */
export const fetchTagsForContent = async (
  contentId: string, 
  includeTypeInfo = false
): Promise<Tag[]> => {
  try {
    if (!contentId || !isValidContentId(contentId)) {
      return [];
    }
    
    // Try to convert to UUID for database lookup
    const dbContentId = tryParseContentIdAsUUID(contentId) || contentId;
    
    // Basic query
    let query = supabase
      .from('tags')
      .select(includeTypeInfo ? 'id, name, content_id, type_id, display_order, tag_types(name)' : '*')
      .eq('content_id', dbContentId)
      .order('display_order', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    
    // Transform results if type info is included
    const transformedData = includeTypeInfo 
      ? data.map(item => ({
          id: item.id,
          name: item.name,
          content_id: item.content_id,
          type_id: item.type_id,
          type_name: item.tag_types?.name || null,
          display_order: item.display_order || 0
        }))
      : data;
    
    // Filter to ensure we only return valid tags and sort by display_order
    const validTags = transformedData.filter(isValidTag);
    return sortTagsByDisplayOrder(validTags);
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch tags';
    handleError(error, errorMessage, { 
      level: 'warning',
      category: 'database',
      contentId
    });
    
    if (error.details && Array.isArray(error.details)) {
      console.warn('Error details:', error.details.toString());
    }
    
    return [];
  }
};

/**
 * React Query hook for fetching tags
 * 
 * @param contentId ID of the content to fetch tags for
 * @param options Query options
 * @returns React Query result with tags data
 */
export const useTagsQuery = (contentId: string, options: UseTagsQueryOptions = {}) => {
  const { 
    enabled = true, 
    includeTypeInfo = false,
    refetchOnWindowFocus = true,
    refetchInterval = false
  } = options;
  
  return useQuery({
    queryKey: contentId ? ['tags', contentId, { includeTypeInfo }] : null,
    queryFn: () => fetchTagsForContent(contentId, includeTypeInfo),
    enabled: !!contentId && isValidContentId(contentId) && enabled,
    refetchOnWindowFocus,
    refetchInterval
  });
};
