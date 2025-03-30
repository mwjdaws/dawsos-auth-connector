
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errors";
import { isValidContentId } from "@/utils/content-validation";
import { Tag, TagOperationsProps, UseTagFetchResult } from "./types";

/**
 * Hook responsible for fetching tags from the database for a specific content ID.
 * 
 * Features:
 * - Loading state management
 * - Error handling with structured error reporting
 * - Content ID validation
 * - Consistent response formatting
 * 
 * @param param0 - Object with contentId extracted from TagOperationsProps
 * @returns Object containing fetchTags function, loading state, and error state
 */
export function useTagFetch({ contentId }: Pick<TagOperationsProps, "contentId">): UseTagFetchResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | Error | any>(null);

  /**
   * Fetches tags associated with the provided content ID
   * 
   * @returns Promise resolving to an array of Tag objects
   */
  const fetchTags = async (): Promise<Tag[]> => {
    // Validate content ID before attempting to fetch
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching tags:", contentId);
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching tags for contentId:", contentId);
      
      const result = await supabase
        .from("tags")
        .select("*")
        .eq("content_id", contentId);
      
      // Defensive check for valid response format
      if (typeof result === 'object' && result !== null && 'data' in result) {
        const { data: tagData, error: tagError } = result;
        
        if (tagError) {
          setError(tagError);
          throw tagError;
        }
        
        console.log("Tags fetched:", tagData);
        setIsLoading(false);
        return tagData || [];
      }
      
      // Default return if response format is unexpected
      setIsLoading(false);
      return [];
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      setIsLoading(false);
      setError(err);
      
      // Use standardized error handling
      handleError(err, "Error fetching tags", {
        context: { contentId },
        level: "error"
      });
      
      return []; // Return empty array to prevent UI errors
    }
  };

  return {
    fetchTags,
    isLoading,
    error
  };
}
