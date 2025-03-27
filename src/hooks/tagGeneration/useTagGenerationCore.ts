
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { TagGenerationOptions, TagGenerationAPI } from "./types";
import { useTagValidator } from "./useTagValidator";
import { useTagCache } from "./useTagCache";
import { useTagGenerationProcess } from "./useTagGenerationProcess";

/**
 * Core hook for tag generation functionality
 */
export function useTagGenerationCore(options: TagGenerationOptions = {}): TagGenerationAPI {
  const { maxRetries = 2, retryDelay = 1500 } = options;
  
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentId, setContentId] = useState<string>(`temp-${Date.now()}`);
  const [retryCount, setRetryCount] = useState(0);
  
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { validateInput } = useTagValidator();
  const { checkCache, updateCache } = useTagCache();
  const { processTagGeneration } = useTagGenerationProcess({
    maxRetries,
    retryDelay,
    setIsLoading,
    isMounted
  });

  // Reset contentId when component mounts
  useEffect(() => {
    setContentId(`temp-${Date.now()}`);
    
    return () => {
      isMounted.current = false;
      // Abort any in-flight requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleGenerateTags = useCallback(async (text: string): Promise<string | undefined> => {
    // Check cache first for the exact same text
    const cachedResult = checkCache(text);
    if (cachedResult) {
      setTags(cachedResult.tags);
      setContentId(cachedResult.contentId);
      return cachedResult.contentId;
    }
    
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
    
    try {
      const generatedTags = await processTagGeneration(text, newContentId, retryCount);
      
      if (isMounted.current) {
        setTags(generatedTags);
        
        // Store in cache
        updateCache(text, newContentId, generatedTags);
        
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
      
      return newContentId;
    } catch (error) {
      console.error("Error in tag generation:", error);
      return undefined;
    }
  }, [validateInput, checkCache, updateCache, processTagGeneration, retryCount, maxRetries, retryDelay]);
  
  // Memoize returning object to prevent unnecessary re-renders
  const tagGenerationApi = useMemo(() => ({
    tags,
    setTags,
    isLoading,
    contentId,
    setContentId,
    handleGenerateTags,
    retryCount,
    resetRetryCount: () => setRetryCount(0)
  }), [tags, isLoading, contentId, handleGenerateTags, retryCount]);
  
  return tagGenerationApi;
}
