
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";
import { handleError } from "@/utils/error-handling";
import { SaveTagsOptions, SaveTagsResult } from "./types";
import { useTagValidator } from "./useTagValidator";
import { useBatchProcessor } from "./useBatchProcessor";
import { useTagCache } from "./useTagCache";

export function useSaveTags() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { validateTags } = useTagValidator();
  const { processBatch } = useBatchProcessor();
  const { checkCache, updateCache } = useTagCache();
  
  // Cleanup function to cancel any in-flight requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const saveTags = useCallback(async (
    text: string, 
    tags: string[], 
    options: SaveTagsOptions = {}
  ): Promise<SaveTagsResult> => {
    // Check cache first
    const cachedResult = checkCache(tags, options);
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    const { 
      contentId: initialContentId, 
      skipGenerateFunction = false,
      maxRetries = 1 
    } = options;

    // Validate input tags
    if (!validateTags(tags)) {
      handleError(
        new Error("Invalid tags format"),
        "The tags format is invalid. Please try regenerating the tags.",
        { level: "warning" }
      );
      return false;
    }

    // Prevent concurrent operations
    if (isProcessing) {
      toast({
        title: "Operation in Progress",
        description: "Please wait for the current operation to complete",
      });
      return false;
    }

    setIsProcessing(true);
    
    // Create a new AbortController for this operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Create a timeout that will automatically abort the operation after 30 seconds
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 30000);
    
    try {
      // Generate a valid content ID if not already present
      const validContentId = initialContentId || `content-${Date.now()}`;
      
      // Use the edge function if text is provided and not explicitly skipped
      if (text && text.trim() && !skipGenerateFunction) {
        try {
          const savedTags = await generateTags(text, true, validContentId);
          
          // Clear timeout since request completed
          clearTimeout(timeoutId);
          
          if (!savedTags.includes("error") && !savedTags.includes("fallback")) {
            toast({
              title: "Success",
              description: `${tags.length} tags saved successfully via edge function`,
            });
            
            // Store result in cache
            updateCache(tags, options, validContentId);
            
            setIsProcessing(false);
            return validContentId;
          }
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          // Continue to fallback method instead of returning
        }
      }
      
      // If the edge function approach failed or we don't have text, fallback to direct DB insertion
      // Prepare tags with a batch approach to optimize insert performance
      const tagObjects = tags.map(tag => ({
        name: tag.trim(),
        content_id: validContentId
      }));
      
      const result = await processBatch(tagObjects);
      
      // Clear timeout since requests completed
      clearTimeout(timeoutId);
      
      if (!result.success) {
        throw new Error(`Failed to insert all tag batches: ${result.error || "Unknown error"}`);
      }
      
      toast({
        title: "Success",
        description: `${result.count} tags saved successfully via direct insertion`,
      });
      
      // Store result in cache
      updateCache(tags, options, validContentId);
      
      setIsProcessing(false);
      return validContentId;
    } catch (error: any) {
      // Clear timeout if there was an error
      clearTimeout(timeoutId);
      setIsProcessing(false);
      
      // Check if it was intentionally aborted
      if (error.name === "AbortError") {
        handleError(
          error,
          "Operation timed out. Please try again.",
          { level: "error" }
        );
        return false;
      }
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to save tags. Please try again.";
      let shouldRetry = maxRetries > 0 && !isRetrying;
      
      if (error.code === "23505") {
        errorMessage = "Some tags already exist for this content.";
        shouldRetry = false;
      } else if (error.code === "42P01") {
        errorMessage = "Database configuration issue. Please contact support.";
        shouldRetry = false;
      } else if (error.code === "23503") {
        errorMessage = "Referenced content ID does not exist.";
        shouldRetry = false;
      } else if (error.code === "23502") {
        errorMessage = "Required tag data is missing.";
        shouldRetry = false;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      handleError(
        error,
        errorMessage,
        { 
          level: "error",
          actionLabel: shouldRetry ? "Retry" : undefined,
          action: shouldRetry ? async () => {
            setIsRetrying(true);
            try {
              await saveTags(text, tags, { 
                ...options, 
                maxRetries: 0 // Prevent infinite retries
              });
            } finally {
              setIsRetrying(false);
            }
          } : undefined
        }
      );
      
      return false;
    }
  }, [validateTags, isRetrying, processBatch, checkCache, updateCache, isProcessing]);

  return { 
    saveTags, 
    isRetrying, 
    isProcessing,
    cancelOperation: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsProcessing(false);
      }
    }
  };
}
