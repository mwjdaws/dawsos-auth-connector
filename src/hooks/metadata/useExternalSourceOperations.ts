
/**
 * Hook for external source operations
 */
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ExternalSourceMetadata } from "./useMetadataBase";
import { handleError, ErrorLevel, createHookErrorHandler } from "@/utils/errors";

// Create hook-specific error handler
const errorHandler = createHookErrorHandler('useExternalSourceOperations');

interface UseExternalSourceOperationsProps {
  contentId?: string;
  externalSource: ExternalSourceMetadata | null;
  setExternalSource: (source: ExternalSourceMetadata | null) => void;
}

/**
 * Hook for external source operations
 */
export function useExternalSourceOperations({
  contentId,
  externalSource,
  setExternalSource
}: UseExternalSourceOperationsProps) {
  
  /**
   * Update external source metadata
   */
  const updateExternalSource = useCallback(async (
    externalSourceUrl: string | null,
    needsExternalReview: boolean = false
  ): Promise<boolean> => {
    if (!contentId) return false;
    
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ 
          external_source_url: externalSourceUrl, 
          needs_external_review: needsExternalReview 
        })
        .eq('id', contentId);
      
      if (error) throw error;
      
      // Update local state
      if (externalSource) {
        setExternalSource({
          ...externalSource,
          externalSourceUrl,
          needsExternalReview
        });
      } else {
        setExternalSource({
          externalSourceUrl,
          needsExternalReview,
          lastCheckedAt: null
        });
      }
      
      toast({
        title: "Success",
        description: "External source metadata updated successfully",
      });
      
      return true;
    } catch (error) {
      errorHandler(
        error,
        "Failed to update external source metadata",
        { 
          level: ErrorLevel.WARNING, 
          context: { contentId }
        }
      );
      
      return false;
    }
  }, [contentId, externalSource, setExternalSource]);

  /**
   * Update the external source check timestamp
   */
  const markExternalSourceChecked = useCallback(async (): Promise<boolean> => {
    if (!contentId) return false;
    
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ 
          external_source_checked_at: new Date().toISOString(),
          needs_external_review: false
        })
        .eq('id', contentId);
      
      if (error) throw error;
      
      // Update local state
      if (externalSource) {
        setExternalSource({
          ...externalSource,
          lastCheckedAt: new Date().toISOString(),
          needsExternalReview: false
        });
      }
      
      toast({
        title: "Success",
        description: "External source marked as checked",
      });
      
      return true;
    } catch (error) {
      errorHandler(
        error,
        "Failed to mark external source as checked",
        { 
          level: ErrorLevel.WARNING, 
          context: { contentId }
        }
      );
      
      return false;
    }
  }, [contentId, externalSource, setExternalSource]);

  return {
    updateExternalSource,
    markExternalSourceChecked
  };
}
