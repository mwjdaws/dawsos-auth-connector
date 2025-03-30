
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isValidContentId } from '@/utils/validation';
import { Tag } from "../../types";
import { handleError } from "@/utils/errors";

export interface UseTagFetchProps {
  contentId: string;
}

export const useTagFetch = ({ contentId }: UseTagFetchProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = async (): Promise<Tag[]> => {
    if (!contentId || !isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching tags:", contentId);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("tags")
        .select("id, name, content_id, type_id, tag_types(name)")
        .eq("content_id", contentId)
        .order("name", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Transform the returned data to include the type_name if available
      const tagsWithTypes: Tag[] = data?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id || null,
        type_name: tag.tag_types?.name || null
      })) || [];

      setTags(tagsWithTypes);
      setIsLoading(false);
      return tagsWithTypes;
    } catch (err) {
      console.error("Error fetching tags:", err);
      
      handleError(
        err instanceof Error ? err : new Error('Failed to fetch tags'), 
        "Error fetching tags", 
        { context: { contentId } }
      );
      
      setError(err instanceof Error ? err : new Error('Unknown error fetching tags'));
      setIsLoading(false);
      return [];
    }
  };

  // Fetch tags when contentId changes
  useEffect(() => {
    if (contentId && isValidContentId(contentId)) {
      fetchTags();
    }
  }, [contentId]);

  return {
    tags,
    setTags,
    fetchTags,
    isLoading,
    error
  };
};
