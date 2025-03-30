
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tag, UseTagFetchResult } from './types';
import { handleError } from "@/utils/errors";
import { isValidContentId } from '@/utils/validation';

interface UseTagFetchProps {
  contentId?: string;
}

/**
 * Hook for fetching tags from the database with proper error handling
 * and loading state management.
 * 
 * @param props - Configuration props including contentId
 * @returns Object with fetchTags function, loading state, and error state
 */
export function useTagFetch({ contentId }: UseTagFetchProps): UseTagFetchResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Fetches tags for the specified content from the database,
   * including their type information if available
   * 
   * @returns Promise resolving to array of Tag objects
   */
  const fetchTags = async (): Promise<Tag[]> => {
    if (!contentId) {
      console.warn('No contentId provided to fetchTags');
      return [];
    }
    
    // Skip fetching for invalid content IDs to avoid unnecessary API calls
    if (!isValidContentId(contentId)) {
      console.warn('Invalid contentId provided to fetchTags:', contentId);
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching tags for content ID: ${contentId}`);
      
      // Fetch tags with join to tag_types to get type names
      const { data, error } = await supabase
        .from('tags')
        .select(`
          id, 
          name, 
          content_id, 
          type_id,
          tag_types(name)
        `)
        .eq('content_id', contentId);
      
      if (error) throw error;
      
      // Process the joined data to flatten the structure
      const processedTags: Tag[] = data.map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        type_name: tag.tag_types?.name
      }));
      
      console.log(`Found ${processedTags.length} tags for content ID: ${contentId}`);
      
      return processedTags;
    } catch (error: any) {
      console.error('Error fetching tags:', error);
      
      // Use standardized error handling
      handleError(error, "Failed to fetch tags", {
        context: { contentId },
        level: "error"
      });
      
      setError(error instanceof Error ? error : new Error(error.message || "Unknown error"));
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
