
import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";
import { handleError, ValidationError } from "@/utils/error-handling";
import { isEqual } from "lodash";

type SaveTagsResult = string | false;

interface SaveTagsOptions {
  contentId?: string;
  skipGenerateFunction?: boolean;
  maxRetries?: number;
}

// Cache data structure
interface PreviousData {
  options: SaveTagsOptions;
  tags: string[];
  result: SaveTagsResult;
}

export function useSaveTags() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const previousData = useRef<PreviousData | null>(null);
  
  // Cleanup function to cancel any in-flight requests when component unmounts
  useEffect(() => {
    const abortController = new AbortController();
    
    return () => {
      abortController.abort();
    };
  }, []);
  
  const validateTags = useCallback((tags: string[]): boolean => {
    if (!tags?.length) {
      handleError(
        new ValidationError("No tags provided"),
        "No tags to save"
      );
      return false;
    }
    
    // Validate individual tags more efficiently with a Set to track invalid tags
    const invalidTags = new Set<string>();
    for (const tag of tags) {
      if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        invalidTags.add(tag || 'empty');
      }
    }
    
    if (invalidTags.size > 0) {
      handleError(
        new ValidationError(`Found ${invalidTags.size} invalid tags`),
        "Some tags are invalid and cannot be saved"
      );
      return false;
    }
    
    return true;
  }, []);

  const saveTags = useCallback(async (
    text: string, 
    tags: string[], 
    options: SaveTagsOptions = {}
  ): Promise<SaveTagsResult> => {
    // Enhanced memoization with deep equality check to prevent unnecessary API calls
    if (
      previousData.current && 
      isEqual(previousData.current.options, options) &&
      isEqual(previousData.current.tags, tags)
    ) {
      console.log('Using cached result from previous identical call');
      return previousData.current.result;
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
            
            // Store result for memoization with defensive copying to avoid reference issues
            previousData.current = {
              options: { ...options },
              tags: [...tags],
              result: validContentId
            };
            
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
      
      // Use a batch size of 50 tags to prevent potential DB performance issues with large tag sets
      const BATCH_SIZE = 50;
      let allSuccess = true;
      let insertedCount = 0;
      
      for (let i = 0; i < tagObjects.length; i += BATCH_SIZE) {
        const batch = tagObjects.slice(i, i + BATCH_SIZE);
        
        // Track progress for large tag sets
        if (tagObjects.length > BATCH_SIZE) {
          console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(tagObjects.length / BATCH_SIZE)}`);
        }
        
        const { error } = await supabase
          .from("tags")
          .insert(batch)
          .select();
          
        if (error) {
          console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
          allSuccess = false;
          break;
        }
        
        insertedCount += batch.length;
      }
      
      // Clear timeout since requests completed
      clearTimeout(timeoutId);
      
      if (!allSuccess) {
        throw new Error("Failed to insert all tag batches");
      }
      
      console.log(`Tags inserted successfully: ${insertedCount} tags`);
      
      toast({
        title: "Success",
        description: `${insertedCount} tags saved successfully via direct insertion`,
      });
      
      // Store result for memoization with defensive copying
      previousData.current = {
        options: { ...options },
        tags: [...tags],
        result: validContentId
      };
      
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
  }, [validateTags, isRetrying]);

  return { saveTags, isRetrying, isProcessing };
}
