
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/content-validation";

export interface UseSourceMetadataProps {
  contentId: string;
}

export const useSourceMetadata = ({ contentId }: UseSourceMetadataProps) => {
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const fetchSourceMetadata = async () => {
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching source metadata:", contentId);
      return null;
    }
    
    try {
      // Fetch source metadata
      const { data: sourceData, error: sourceError } = await supabase
        .from("knowledge_sources")
        .select("external_source_url, needs_external_review, external_source_checked_at")
        .eq("id", contentId)
        .single();
      
      if (sourceError && sourceError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - not an error for us
        throw sourceError;
      }
      
      console.log("Source metadata fetched:", sourceData);
      return sourceData;
    } catch (err: any) {
      console.error("Error fetching source metadata:", err);
      throw err;
    }
  };

  const updateSourceMetadataState = (sourceData: any) => {
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
