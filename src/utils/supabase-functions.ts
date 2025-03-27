
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
  try {
    if (save && !contentId) {
      throw new Error("Content ID is required when saving tags");
    }

    console.log(`Generating tags for content: ${content.substring(0, 30)}...`);
    
    // Add a timeout to prevent hanging indefinitely
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Tag generation timed out")), 15000); // Reduced timeout to 15 seconds
    });
    
    const functionPromise = supabase.functions.invoke('generate-tags', {
      body: { content, save, contentId },
    });
    
    // Race between the function call and the timeout
    const { data, error } = await Promise.race([
      functionPromise,
      timeoutPromise.then(() => {
        throw new Error("Tag generation timed out");
      })
    ]);

    if (error) {
      console.error('Error invoking generate-tags function:', error);
      // Return fallback tags on error instead of throwing
      return ["content", "text", "document", "fallback", "error"];
    }

    console.log('Tags generated successfully:', data?.tags);
    return data?.tags || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    // Return fallback tags instead of throwing
    return ["content", "text", "document", "fallback", "error"];
  }
};
