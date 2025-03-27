import { RefObject, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/error-handling";
import { generateTags } from "@/utils/supabase-functions";

interface ProcessOptions {
  maxRetries: number;
  retryDelay: number;
  setIsLoading: (isLoading: boolean) => void;
  isMounted: RefObject<boolean>;
}

/**
 * Hook for handling the tag generation process
 */
export function useTagGenerationProcess(options: ProcessOptions) {
  const { maxRetries, setIsLoading, isMounted } = options;
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const processTagGeneration = useCallback(async (
    text: string, 
    newContentId: string,
    retryCount: number
  ): Promise<string[]> => {
    // Set a UI timeout to prevent the button from getting stuck
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false);
        handleError(
          new Error("Operation timed out"),
          "Tag generation is taking longer than expected. Please try again.",
          { 
            actionLabel: "Retry", 
            action: () => processTagGeneration(text, newContentId, retryCount)
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
        
        return generatedTags;
      }
      
      return generatedTags;
    } catch (error) {
      console.error("Error generating tags:", error);
      if (isMounted.current) {
        handleError(
          error,
          "Failed to generate tags. Please try again.",
          { 
            actionLabel: retryCount < maxRetries ? "Retry" : undefined,
            action: retryCount < maxRetries ? () => {
              // This will be handled by the parent component
              return [];
            } : undefined
          }
        );
      }
      
      return ["content", "text", "document", "fallback", "error"];
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        clearTimeoutRef();
      }
    }
  }, [clearTimeoutRef, isMounted, setIsLoading, maxRetries]);

  return { processTagGeneration };
}
