
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate tags from content using Supabase Edge Function
 * @param content The content to generate tags from
 * @param save Whether to save the tags to the database
 * @param contentId The ID of the content to associate tags with (required if save is true)
 */
export const generateTags = async (
  content: string, 
  save = false, 
  contentId?: string
): Promise<string[]> => {
  // Create an AbortController for timeout handling
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 15000);
  
  try {
    if (save && !contentId) {
      throw new Error("Content ID is required when saving tags");
    }

    // Trim and validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      console.warn('Empty content provided for tag generation');
      return ["content", "document", "empty", "fallback"];
    }

    console.log(`Generating tags for content: ${trimmedContent.substring(0, 30)}...`);
    
    // Add dynamic timeout based on content length
    const contentLength = trimmedContent.length;
    const dynamicTimeout = Math.min(5000 + Math.floor(contentLength / 20), 30000);
    
    // Reset the timeout with dynamic duration
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => abortController.abort(), dynamicTimeout);
    
    // Add retry mechanism
    const MAX_RETRIES = 2;
    let retryCount = 0;
    let lastError: Error | null = null;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-tags', {
          body: { 
            content: trimmedContent, 
            save, 
            contentId,
            retryCount  // Send retry count to help the edge function adapt
          },
        });

        if (error) {
          console.error('Error invoking generate-tags function:', error);
          lastError = error;
          retryCount++;
          
          // Exponential backoff between retries
          if (retryCount <= MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
            continue;
          }
          
          // Return fallback tags on max retries
          return ["content", "text", "document", "fallback", "error"];
        }

        // Clean up timeout since request succeeded
        clearTimeout(newTimeoutId);
        
        console.log('Tags generated successfully:', data?.tags);
        return Array.isArray(data?.tags) ? data.tags : [];
      } catch (retryError) {
        console.error(`Error generating tags (attempt ${retryCount + 1}):`, retryError);
        lastError = retryError instanceof Error ? retryError : new Error(String(retryError));
        retryCount++;
        
        // Exponential backoff between retries
        if (retryCount <= MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          continue;
        }
      }
    }
    
    // Clear timeout and return fallback if all retries failed
    clearTimeout(newTimeoutId);
    console.error('All tag generation retries failed:', lastError);
    return ["content", "text", "document", "fallback", "error"];
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);
    
    console.error('Error generating tags:', error);
    // Check if it's an abort error
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Tag generation request timed out');
      return ["content", "text", "document", "timeout", "error"];
    }
    
    // Return fallback tags instead of throwing
    return ["content", "text", "document", "fallback", "error"];
  }
};
