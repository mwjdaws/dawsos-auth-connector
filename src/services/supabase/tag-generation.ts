import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';

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
    
    // Add metadata for logging
    const requestMetadata = {
      requestId: `tag-gen-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      contentLength,
      save,
      requestType: 'user-initiated'
    };
    
    // Add retry mechanism
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: Error | null = null;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-tags', {
          body: { 
            content: trimmedContent, 
            save, 
            contentId,
            retryCount,
            metadata: requestMetadata
          }
          // Signal property is intentionally omitted to avoid errors
        });

        // Check for rate limiting by examining error or data properties
        // Since status is not directly available, we'll check error message or code
        if (error && (error.message?.includes('429') || error.code === 429)) {
          console.warn('Rate limited by tag generation service');
          
          // Get retry delay from data or use exponential backoff
          const retryAfter = data?.retryAfter || Math.pow(2, retryCount) * 1000;
          
          if (retryCount < MAX_RETRIES) {
            console.log(`Waiting ${retryAfter}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, retryAfter));
            retryCount++;
            continue;
          } else {
            // Return fallback tags when all retries are exhausted
            clearTimeout(newTimeoutId);
            console.error('Rate limit retries exhausted for tag generation');
            return ["content", "text", "document", "rate_limited", "fallback"]; 
          }
        }

        if (error) {
          console.error('Error invoking generate-tags function:', error);
          lastError = error;
          retryCount++;
          
          // Exponential backoff between retries
          if (retryCount <= MAX_RETRIES) {
            const backoffTime = 1000 * Math.pow(2, retryCount - 1);
            console.log(`Retrying tag generation in ${backoffTime}ms (attempt ${retryCount}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            continue;
          }
          
          // Return fallback tags on max retries
          clearTimeout(newTimeoutId);
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
          const backoffTime = 1000 * Math.pow(2, retryCount - 1);
          console.log(`Retrying tag generation in ${backoffTime}ms (attempt ${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
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
    
    // Check if it's a network error
    if (error instanceof Error && error.message.includes('network')) {
      console.error('Network error during tag generation');
      return ["content", "text", "document", "network", "error"];
    }
    
    // Return fallback tags instead of throwing
    return ["content", "text", "document", "fallback", "error"];
  }
};

/**
 * Run batch tag generation for multiple content items
 */
export const generateTagsBatch = async (
  contentItems: Array<{id: string, content: string, title?: string}>
): Promise<{
  success: boolean;
  results: Array<{id: string, tags: string[], error?: string}>;
}> => {
  try {
    console.log(`Batch generating tags for ${contentItems.length} items`);
    
    // Add request metadata
    const requestMetadata = {
      requestId: `batch-tags-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      itemCount: contentItems.length,
      requestType: 'batch'
    };
    
    const { data, error } = await supabase.functions.invoke('batch-tag-generation', {
      body: {
        items: contentItems,
        metadata: requestMetadata
      }
    });
    
    if (error) {
      console.error('Error in batch tag generation:', error);
      return {
        success: false,
        results: contentItems.map(item => ({
          id: item.id,
          tags: ["batch", "error", "fallback"],
          error: error.message
        }))
      };
    }
    
    return {
      success: true,
      results: data.results || []
    };
  } catch (error) {
    console.error('Exception in batch tag generation:', error);
    
    return {
      success: false,
      results: contentItems.map(item => ({
        id: item.id,
        tags: ["batch", "exception", "fallback"],
        error: error instanceof Error ? error.message : String(error)
      }))
    };
  }
};
