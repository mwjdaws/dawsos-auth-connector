
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isValidContentId } from "@/utils/validation/contentIdValidation";
import { handleError } from "@/utils/errors";
import { SimpleSourceMetadata } from "../types";

export interface UseSourceMetadataProps {
  contentId?: string;
}

export const useSourceMetadata = ({ contentId }: UseSourceMetadataProps) => {
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<SimpleSourceMetadata | null>(null);

  const fetchSourceMetadata = async (): Promise<SimpleSourceMetadata | null> => {
    if (!contentId) {
      console.log("No contentId provided for fetching source metadata");
      return null;
    }
    
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching source metadata:", contentId);
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await supabase
        .from("knowledge_sources")
        .select("external_source_url, needs_external_review, external_source_checked_at")
        .eq("id", contentId)
        .maybeSingle();
      
      if (typeof result === 'object' && result !== null && 'data' in result) {
        const { data: sourceData, error: sourceError } = result;
        
        if (sourceError && sourceError.code !== 'PGRST116') {
          throw sourceError;
        }
        
        console.log("Source metadata fetched:", sourceData);
        
        // Create a properly typed metadata object
        const metadata: SimpleSourceMetadata = {
          external_source_url: sourceData?.external_source_url || null,
          needs_external_review: sourceData?.needs_external_review || false,
          external_source_checked_at: sourceData?.external_source_checked_at || null
        };
        
        setData(metadata);
        updateSourceMetadataState(metadata);
        setIsLoading(false);
        return metadata;
      }
      
      const defaultData: SimpleSourceMetadata = {
        external_source_url: null,
        needs_external_review: false,
        external_source_checked_at: null
      };
      
      setData(defaultData);
      setIsLoading(false);
      return defaultData;
    } catch (err: any) {
      console.error("Error fetching source metadata:", err);
      
      handleError(err, "Error fetching source metadata", {
        context: { contentId },
        level: "error"
      });
      
      setError(err);
      setIsLoading(false);
      return null;
    }
  };

  const updateSourceMetadataState = (sourceData: SimpleSourceMetadata | null) => {
    if (sourceData) {
      setExternalSourceUrl(sourceData.external_source_url);
      setNeedsExternalReview(sourceData.needs_external_review);
      setLastCheckedAt(sourceData.external_source_checked_at);
    }
  };

  useEffect(() => {
    if (contentId && isValidContentId(contentId)) {
      fetchSourceMetadata();
    }
  }, [contentId]);

  return {
    externalSourceUrl,
    setExternalSourceUrl,
    needsExternalReview,
    setNeedsExternalReview,
    lastCheckedAt,
    setLastCheckedAt,
    fetchSourceMetadata,
    updateSourceMetadataState,
    isLoading,
    error,
    data
  };
};
