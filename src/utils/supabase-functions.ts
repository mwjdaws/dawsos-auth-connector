
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

    const { data, error } = await supabase.functions.invoke('generate-tags', {
      body: { content, save, contentId },
    });

    if (error) {
      console.error('Error invoking generate-tags function:', error);
      throw error;
    }

    return data.tags || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    throw error;
  }
};
