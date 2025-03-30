
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isValidContentId } from "@/utils/validation";
import { Tag, UseTagFetchResult } from "./types";
import { handleError } from "@/utils/errors";

export interface UseTagFetchProps {
  contentId: string;
}

export const useTagFetch = ({ contentId }: UseTagFetchProps): UseTagFetchResult => {
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
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("id, name, content_id, type_id, tag_types:type_id (name)")
        .eq("content_id", contentId);

      if (tagError) {
        throw tagError;
      }

      setIsLoading(false);

      // Transform the data to include type_name
      return (tagData || []).map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        type_name: tag.tag_types?.name || null
      }));
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      
      handleError(err, "Error fetching tags", {
        context: { contentId },
        level: "error"
      });
      
      setError(err);
      setIsLoading(false);
      return [];
    }
  };

  return {
    fetchTags,
    isLoading,
    error
  };
};
