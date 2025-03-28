
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
      // Call the generate-tags edge function
      const { data, error } = await supabase.functions.invoke('generate-tags', {
        body: { 
          content: text,
          retryCount
        }
      });
      
      if (error) {
        console.error("Error invoking generate-tags function:", error);
        return ["error", "failed", "generation", "api-error"];
      }
      
      // Check if tags property exists and is an array
      if (data && Array.isArray(data.tags)) {
        return data.tags;
      } else {
        console.error("Unexpected response format from generate-tags:", data);
        return ["error", "unexpected", "response", "format"];
      }
    } catch (error) {
      console.error("Exception in processTagGeneration:", error);
      
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
  
  return { processTagGeneration, retryAttempts };
}
