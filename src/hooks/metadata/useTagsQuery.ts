
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sortTagsByDisplayOrder } from '@/utils/metadata/tagUtils';
import { Tag, isValidTag } from '@/types/tag';
import { handleError } from '@/utils/error-handling';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

/**
 * Fetch tags for a specific content
 * 
 * @param contentId ID of the content to fetch tags for
 * @returns Promise resolving to an array of tags
 */
export const fetchTagsForContent = async (contentId: string): Promise<Tag[]> => {
  try {
    if (!contentId || !isValidContentId(contentId)) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('content_id', contentId)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    
    // Filter to ensure we only return valid tags and sort by display_order
    const validTags = data.filter(isValidTag);
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
export const useTagsQuery = (contentId: string, options = {}) => {
  return useQuery({
    queryKey: contentId ? ['tags', contentId] : null,
    queryFn: () => fetchTagsForContent(contentId),
    enabled: !!contentId && isValidContentId(contentId),
    ...options
  });
};
