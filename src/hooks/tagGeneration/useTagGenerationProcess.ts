
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for handling the tag generation process
 */
export function useTagGenerationProcess() {
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  /**
   * Clean and parse tags from potentially JSON formatted responses
   */
  const cleanTags = (rawTags: string[]): string[] => {
    console.log('cleanTags: Raw tags received:', rawTags);
    
    if (!Array.isArray(rawTags)) {
      console.error('cleanTags: Received non-array input:', rawTags);
      return [];
    }
    
    // Check if the first item indicates a JSON code block
    if (rawTags[0] && typeof rawTags[0] === 'string' && rawTags[0].includes('```json')) {
      console.log('cleanTags: Detected JSON code block format, cleaning tags');
      
      // Extract actual tags from the code block format
      const cleanedTags = rawTags
        .filter(tag => tag && typeof tag === 'string')
        .map(tag => {
          // Remove JSON quotes, backticks, and trim
          return tag
            .replace(/^```json$/g, '')
            .replace(/^```$/g, '')
            .replace(/^["']/g, '')
            .replace(/["']$/g, '')
            .trim();
        })
        .filter(tag => 
          tag && 
          !tag.includes('```') && 
          tag.length > 1 && 
          !tag.includes('undefined')
        );
      
      console.log('cleanTags: Cleaned tags:', cleanedTags);
      return cleanedTags;
    }
    
    // Regular cleaning for normal array responses
    const cleanedTags = rawTags
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 1);
    
    console.log('cleanTags: Standard cleaned tags:', cleanedTags);
    return cleanedTags;
  };

  /**
   * Generate tags from content
   */
  const generateTags = useCallback(async (content: string): Promise<string[]> => {
    if (!content.trim()) {
      console.error('generateTags: Empty content provided');
      toast({
        title: "Error",
        description: "Please provide some content to generate tags",
        variant: "destructive",
      });
      return [];
    }

    setIsLoading(true);
    
    try {
      console.log('useTagGenerationProcess: Trying generate-tags function first');
      
      // First try to use the generate-tags edge function
      const { data: generateData, error: generateError } = await supabase.functions.invoke('generate-tags', {
        body: { content: content.trim() }
      });
      
      if (generateError) {
        console.error('useTagGenerationProcess: Error from generate-tags:', generateError);
        throw new Error(`Error calling generate-tags: ${generateError.message}`);
      }
      
      if (generateData && generateData.tags) {
        console.log('useTagGenerationProcess: Response from generate-tags:', generateData);
        
        // Process the tags from generate-tags
        if (Array.isArray(generateData.tags)) {
          const processedTags = cleanTags(generateData.tags);
          console.log('useTagGenerationProcess: Successfully retrieved tags from generate-tags:', processedTags);
          return processedTags;
        } else {
          console.warn('useTagGenerationProcess: generate-tags returned non-array tags:', generateData.tags);
        }
      }
      
      // If we reach here, generate-tags didn't return usable tags, try suggest-tags as fallback
      console.log('useTagGenerationProcess: Calling suggest-tags function with text length:', content.length);
      
      const { data: suggestData, error: suggestError } = await supabase.functions.invoke('suggest-tags', {
        body: { text: content.trim() }
      });
      
      if (suggestError) {
        console.error('useTagGenerationProcess: Error from suggest-tags:', suggestError);
        throw new Error(`Error calling suggest-tags: ${suggestError.message}`);
      }
      
      console.log('useTagGenerationProcess: Raw response from suggest-tags:', suggestData);
      
      // Handle different response formats from suggest-tags
      if (suggestData) {
        let tagsToProcess: string[] = [];
        
        // Handle different response structures
        if (Array.isArray(suggestData)) {
          console.log('useTagGenerationProcess: suggest-tags returned direct array');
          tagsToProcess = suggestData;
        } else if (suggestData.tags && Array.isArray(suggestData.tags)) {
          console.log('useTagGenerationProcess: suggest-tags returned object with tags array');
          tagsToProcess = suggestData.tags;
        } else if (typeof suggestData === 'string') {
          // Try to parse possible JSON response
          try {
            const parsed = JSON.parse(suggestData);
            if (parsed.tags && Array.isArray(parsed.tags)) {
              console.log('useTagGenerationProcess: suggest-tags returned JSON string with tags array');
              tagsToProcess = parsed.tags;
            }
          } catch (e) {
            console.warn('useTagGenerationProcess: Could not parse suggest-tags string response:', e);
          }
        }
        
        if (tagsToProcess.length > 0) {
          const processedTags = cleanTags(tagsToProcess);
          console.log('useTagGenerationProcess: Successfully retrieved tags from suggest-tags:', processedTags);
          return processedTags;
        }
      }
      
      // If we reach here, neither function returned usable tags
      console.warn('useTagGenerationProcess: No valid tags returned from either function');
      toast({
        title: "Warning",
        description: "No valid tags could be generated. Try with different content.",
        variant: "destructive",
      });
      
      return ["content", "document", "generic", "fallback"];
      
    } catch (error) {
      console.error('useTagGenerationProcess: Error generating tags:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tags",
        variant: "destructive",
      });
      
      // Return fallback tags instead of throwing
      return ["content", "document", "error", "fallback"];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    tags,
    setTags,
    generateTags
  };
}
