
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isValidContentId } from "@/utils/content-validation";
import { handleError } from "@/utils/errors";

export interface UseSourceMetadataProps {
  contentId?: string;
}

export interface SourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}

export const useSourceMetadata = ({ contentId }: UseSourceMetadataProps) => {
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const fetchSourceMetadata = async (): Promise<SourceMetadata | null> => {
    if (!contentId) {
      console.log("No contentId provided for fetching source metadata");
      return null;
    }
    
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching source metadata:", contentId);
      return null;
    }
    
    try {
      // Fetch source metadata
      const result = await supabase
        .from("knowledge_sources")
        .select("external_source_url, needs_external_review, external_source_checked_at")
        .eq("id", contentId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows are returned
      
      // Defensive check for valid response format
      if (typeof result === 'object' && result !== null && 'data' in result) {
        const { data: sourceData, error: sourceError } = result;
        
        // Handle error but exclude "no rows returned" as it's not a real error for us
        if (sourceError && sourceError.code !== 'PGRST116') {
          throw sourceError;
        }
        
        console.log("Source metadata fetched:", sourceData);
        return sourceData || {
          external_source_url: null,
          needs_external_review: false,
          external_source_checked_at: null
        };
      }
      
      // Default return if response format is unexpected
      return {
        external_source_url: null,
        needs_external_review: false,
        external_source_checked_at: null
      };
    } catch (err: any) {
      console.error("Error fetching source metadata:", err);
      
      // Use standardized error handling
      handleError(err, "Error fetching source metadata", {
        context: { contentId },
        level: "error"
      });
      
      throw err;
    }
  };

  const updateSourceMetadataState = (sourceData: SourceMetadata | null) => {
    if (sourceData) {
      setExternalSourceUrl(sourceData.external_source_url);
      setNeedsExternalReview(sourceData.needs_external_review || false);
      setLastCheckedAt(sourceData.external_source_checked_at);
    }
  };

  return {
    externalSourceUrl,
    setExternalSourceUrl,
    needsExternalReview,
    setNeedsExternalReview,
    lastCheckedAt,
    setLastCheckedAt,
    fetchSourceMetadata,
    updateSourceMetadataState
  };
};
