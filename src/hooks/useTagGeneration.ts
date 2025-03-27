
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";
import { handleError, ValidationError } from "@/utils/error-handling";

interface TagGenerationOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function useTagGeneration(options: TagGenerationOptions = {}) {
  const { maxRetries = 2, retryDelay = 1500 } = options;
  
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentId, setContentId] = useState<string>(`temp-${Date.now()}`);
  const [retryCount, setRetryCount] = useState(0);
  
  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset contentId when component mounts
  useEffect(() => {
    setContentId(`temp-${Date.now()}`);
    
    return () => {
      isMounted.current = false;
      clearTimeoutRef();
      // Abort any in-flight requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const validateInput = useCallback((text: string): boolean => {
    if (!text.trim()) {
      handleError(
        new ValidationError("Empty content"),
        "Please enter some content to generate tags"
      );
      return false;
    }
    
    // Additional validation could be added here 
    // (e.g., minimum length, content type checks, etc.)
    return true;
  }, []);

  const handleGenerateTags = useCallback(async (text: string): Promise<string | undefined> => {
    // Input validation
    if (!validateInput(text)) return;

    // Reset retry count on new generation request
    setRetryCount(0);
    setIsLoading(true);
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    // Generate a new contentId for this content
    const newContentId = `content-${Date.now()}`;
    setContentId(newContentId);
    console.log("Generated new contentId:", newContentId);
    
    // Set a UI timeout to prevent the button from getting stuck
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        setIsLoading(false);
        handleError(
          new Error("Operation timed out"),
          "Tag generation is taking longer than expected. Please try again.",
          { 
            actionLabel: "Retry", 
            action: () => handleGenerateTags(text)
          }
        );
      }
    }, 20000); // 20 second UI timeout
    
    try {
      console.log("Starting tag generation for contentId:", newContentId);
      const generatedTags = await generateTags(text);
      console.log("Tag generation completed:", generatedTags);
      
      if (isMounted.current) {
        clearTimeoutRef();
        
        setTags(generatedTags);
        
        if (generatedTags.includes("fallback") || generatedTags.includes("error")) {
          // If it's not the max retry count yet, attempt a retry
          if (retryCount < maxRetries) {
            toast({
              title: "Retrying generation",
              description: "First attempt returned basic tags. Trying again...",
            });
            
            // Wait before retrying
            setTimeout(() => {
              if (isMounted.current) {
                setRetryCount(prev => prev + 1);
                handleGenerateTags(text);
              }
            }, retryDelay);
            
            return newContentId;
          }
          
          toast({
            title: "Limited results",
            description: "We had trouble generating optimal tags, so we've provided some basic ones.",
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: "Tags generated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error generating tags:", error);
      if (isMounted.current) {
        handleError(
          error,
          "Failed to generate tags. Please try again.",
          { 
            actionLabel: retryCount < maxRetries ? "Retry" : undefined,
            action: retryCount < maxRetries ? () => {
              setRetryCount(prev => prev + 1);
              handleGenerateTags(text);
            } : undefined
          }
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        clearTimeoutRef();
      }
    }
    
    return newContentId;
  }, [clearTimeoutRef, isLoading, retryCount, maxRetries, retryDelay, validateInput]);
  
  return {
    tags,
    setTags,
    isLoading,
    contentId,
    setContentId,
    handleGenerateTags,
    retryCount,
    resetRetryCount: () => setRetryCount(0)
  };
}
