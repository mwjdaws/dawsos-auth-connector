
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";
import { handleError, ValidationError } from "@/utils/error-handling";

type SaveTagsResult = string | false;

interface SaveTagsOptions {
  contentId?: string;
  skipGenerateFunction?: boolean;
  maxRetries?: number;
}

export function useSaveTags() {
  const [isRetrying, setIsRetrying] = useState(false);
  const previousOptions = useRef<SaveTagsOptions | null>(null);
  const previousResult = useRef<SaveTagsResult | null>(null);
  
  const validateTags = useCallback((tags: string[]): boolean => {
    if (tags.length === 0) {
      handleError(
        new ValidationError("No tags provided"),
        "No tags to save"
      );
      return false;
    }
    
    // Validate individual tags if needed
    const invalidTags = tags.filter(tag => !tag || typeof tag !== 'string' || tag.trim() === '');
    if (invalidTags.length > 0) {
      handleError(
        new ValidationError(`Found ${invalidTags.length} invalid tags`),
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
    // Simple memoization for identical requests
    const optionsString = JSON.stringify({ tags, options });
    if (previousOptions.current === optionsString && previousResult.current) {
      return previousResult.current;
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

    try {
      // Generate a valid content ID if not already present
      const validContentId = initialContentId || `content-${Date.now()}`;
      
      console.log(`Attempting to save tags with content_id: ${validContentId}`);
      
      // Use the edge function if text is provided and not explicitly skipped
      if (text && text.trim() && !skipGenerateFunction) {
        try {
          console.log("Attempting to save tags via edge function");
          const savedTags = await generateTags(text, true, validContentId);
          
          if (!savedTags.includes("error") && !savedTags.includes("fallback")) {
            toast({
              title: "Success",
              description: `${tags.length} tags saved successfully via edge function`,
            });
            
            // Store result for memoization
            previousOptions.current = optionsString;
            previousResult.current = validContentId;
            return validContentId;
          }
          
          console.log("Edge function approach returned error flags, falling back");
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          console.log("Edge function approach failed, falling back to direct DB insertion");
        }
      }
      
      // If the edge function approach failed or we don't have text, fallback to direct DB insertion
      const tagObjects = tags.map(tag => ({
        name: tag.trim(),
        content_id: validContentId
      }));

      console.log("Directly inserting tags:", tagObjects);
      
      const { error, data } = await supabase
        .from("tags")
        .insert(tagObjects)
        .select();

      if (error) {
        throw error;
      }
      
      console.log("Tags inserted successfully:", data);
      
      toast({
        title: "Success",
        description: `${tags.length} tags saved successfully via direct insertion`,
      });
      
      // Store result for memoization
      previousOptions.current = optionsString;
      previousResult.current = validContentId;
      return validContentId;
    } catch (error: any) {
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
      } else if (error.message) {
        errorMessage = error.message;
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

  return { saveTags, isRetrying };
}
