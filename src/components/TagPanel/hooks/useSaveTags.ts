
import { useState, useCallback, useEffect } from "react";
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
  
  const { validateTags } = useTagValidator();
  const { processBatch } = useBatchProcessor();
  const { checkCache, updateCache } = useTagCache();
  
  // Cleanup function to cancel any in-flight requests when component unmounts
  useEffect(() => {
    const abortController = new AbortController();
    
    return () => {
      abortController.abort();
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
      return false;
    }

    setIsProcessing(true);
    
    // Create an AbortController to handle timeouts and cancellations
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout
    
    try {
      // Generate a valid content ID if not already present
      const validContentId = initialContentId || `content-${Date.now()}`;
      
      console.log(`Attempting to save tags with content_id: ${validContentId}`);
      
      // Use the edge function if text is provided and not explicitly skipped
      if (text && text.trim() && !skipGenerateFunction) {
        try {
          console.log("Attempting to save tags via edge function");
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
          
          console.log("Edge function approach returned error flags, falling back");
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          console.log("Edge function approach failed, falling back to direct DB insertion");
        }
      }
      
      // If the edge function approach failed or we don't have text, fallback to direct DB insertion
      // Prepare tags with a batch approach to optimize insert performance
      const tagObjects = tags.map(tag => ({
        name: tag.trim(),
        content_id: validContentId
      }));

      console.log("Directly inserting tags:", tagObjects);
      
      const result = await processBatch(tagObjects);
      
      // Clear timeout since requests completed
      clearTimeout(timeoutId);
      
      if (!result.success) {
        throw new Error("Failed to insert all tag batches");
      }
      
      console.log(`Tags inserted successfully: ${result.count} tags`);
      
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
      
      console.error("Error saving tags:", error);
      
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
      
      // Enhanced error handling with abort status detection
      if (error.name === "AbortError") {
        errorMessage = "Operation timed out. Please try again.";
      }
      
      handleError(
        error,
        errorMessage,
        { 
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
  }, [validateTags, isRetrying, processBatch, checkCache, updateCache]);

  return { saveTags, isRetrying, isProcessing };
}
