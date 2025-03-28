
import { useState, useCallback } from "react";
import { MutableRefObject } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseTagGenerationProcessProps {
  maxRetries: number;
  retryDelay: number;
  setIsLoading: (loading: boolean) => void;
  isMounted: MutableRefObject<boolean>;
}

export function useTagGenerationProcess({
  maxRetries,
  retryDelay,
  setIsLoading,
  isMounted
}: UseTagGenerationProcessProps) {
  const [retryAttempts, setRetryAttempts] = useState(0);

  const processTagGeneration = useCallback(async (
    text: string, 
    contentId: string,
    retryCount: number
  ): Promise<string[]> => {
    try {
      console.log("useTagGenerationProcess: Calling suggest-tags function with text length:", text.length);
      
      // First try with generate-tags (which uses OpenAI)
      try {
        console.log("useTagGenerationProcess: Trying generate-tags function first");
        const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-tags', {
          body: { 
            content: text.substring(0, 8000), // Limit content size to avoid payload issues
            retryCount,
            save: false // Don't save tags yet, just generate them
          }
        });
        
        console.log("useTagGenerationProcess: Response from generate-tags:", aiData);
        
        if (!aiError && aiData && Array.isArray(aiData.tags) && aiData.tags.length > 0) {
          console.log("useTagGenerationProcess: Successfully retrieved tags from generate-tags:", aiData.tags);
          return cleanTags(aiData.tags);
        } else {
          console.error("useTagGenerationProcess: Error or invalid response from generate-tags:", aiError || "No tags returned");
        }
      } catch (aiException) {
        console.error("useTagGenerationProcess: Exception with generate-tags:", aiException);
      }
      
      // Fallback to suggest-tags (simpler algorithm)
      console.log("useTagGenerationProcess: Falling back to suggest-tags function");
      const { data, error } = await supabase.functions.invoke('suggest-tags', {
        body: { 
          queryText: text.substring(0, 5000), // Limit content size
          contentId: null // Don't save yet
        }
      });
      
      if (error) {
        console.error("useTagGenerationProcess: Error invoking suggest-tags function:", error);
        return ["error", "failed", "generation", "api-error"];
      }
      
      console.log("useTagGenerationProcess: suggest-tags response:", data);
      
      // Check if tags property exists and is an array
      if (data && Array.isArray(data.tags)) {
        console.log("useTagGenerationProcess: Successfully retrieved tags:", data.tags);
        return cleanTags(data.tags);
      } else {
        console.error("useTagGenerationProcess: Unexpected response format from suggest-tags:", data);
        return ["error", "unexpected", "response", "format"];
      }
    } catch (error) {
      console.error("useTagGenerationProcess: Exception in processTagGeneration:", error);
      
      // Retry logic for recoverable errors
      if (retryAttempts < maxRetries) {
        setRetryAttempts(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Only retry if the component is still mounted
        if (isMounted.current) {
          return processTagGeneration(text, contentId, retryCount + 1);
        }
      }
      
      return ["error", "failed", "generation", "exception"];
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [maxRetries, retryDelay, retryAttempts, setIsLoading, isMounted]);
  
  // Helper function to clean and validate tags
  function cleanTags(tags: any[]): string[] {
    if (!Array.isArray(tags)) {
      console.error("cleanTags: Tags is not an array:", tags);
      return ["error", "invalid", "format"];
    }
    
    // If the first tag contains JSON markers like ```json, we need special handling
    if (tags.length > 0 && typeof tags[0] === 'string' && tags[0].includes('```')) {
      console.log("cleanTags: Detected JSON code block format, cleaning tags");
      
      // Join all parts and try to extract the actual tags
      const joinedText = tags.join(' ');
      const matches = joinedText.match(/\[(.*)\]/s);
      
      if (matches && matches[1]) {
        try {
          // Try to parse the content as JSON
          const extractedTags = JSON.parse('[' + matches[1] + ']');
          console.log("cleanTags: Successfully extracted tags from JSON format:", extractedTags);
          return extractedTags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
        } catch (e) {
          console.error("cleanTags: Failed to parse extracted JSON:", e);
          
          // Alternative approach: split by commas and clean up
          const tagArray = matches[1].split(',')
            .map(t => t.trim().replace(/^["']|["']$/g, ''))
            .filter(t => t.length > 0);
          
          console.log("cleanTags: Extracted tags by splitting:", tagArray);
          return tagArray;
        }
      }
      
      // If we can't extract from JSON format, clean up each tag individually
      return tags.map(tag => {
        if (typeof tag === 'string') {
          return tag.replace(/```json|```/g, '').replace(/^["']|["']$/g, '').trim();
        }
        return '';
      }).filter(tag => tag.length > 0);
    }
    
    // Regular cleaning for standard tag arrays
    return tags.filter(tag => {
      // Filter out certain tag formats
      if (!tag || typeof tag !== 'string') return false;
      if (tag.startsWith('```') || tag.endsWith('```')) return false;
      if (tag === "error" || tag === "fallback" || tag === "timeout" || tag === "network") return false;
      return true;
    }).map(tag => {
      // Clean up tag strings
      if (typeof tag === 'string') {
        // Remove any quotes
        return tag.replace(/^["']|["']$/g, '').trim();
      }
      return tag;
    });
  }
  
  return { processTagGeneration, retryAttempts };
}
