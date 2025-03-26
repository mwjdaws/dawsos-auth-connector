
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate tags from content using Supabase Edge Function
 */
export const generateTags = async (content: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-tags', {
      body: { content },
    });

    if (error) {
      throw error;
    }

    return data.tags || [];
  } catch (error) {
    console.error('Error generating tags:', error);
    throw error;
  }
};
