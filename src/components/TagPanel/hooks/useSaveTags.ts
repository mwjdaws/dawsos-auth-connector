
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTagValidator } from './useTagValidator';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';

export const useSaveTags = (contentId: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const tagValidator = useTagValidator();

  const saveTags = async (tags: string[]): Promise<boolean> => {
    if (!contentId) {
      toast({
        title: "Error",
        description: "No content ID provided",
        variant: "destructive",
      });
      return false;
    }

    // Validate tags before saving
    const isValid = tagValidator.validate(tags);
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: tagValidator.validationResult.message,
        variant: "destructive",
      });
      return false;
    }

    setIsSaving(true);

    try {
      // First, delete all existing tags for this content
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('content_id', contentId);

      if (deleteError) {
        throw deleteError;
      }

      // Then insert the new tags
      if (tags.length > 0) {
        const tagsData = tags.map(tag => ({
          content_id: contentId,
          name: tag,
        }));

        const { error: insertError } = await supabase
          .from('tags')
          .insert(tagsData);

        if (insertError) {
          throw insertError;
        }
      }

      toast({
        title: "Success",
        description: `${tags.length} tags have been saved successfully.`,
      });

      return true;
    } catch (error) {
      handleError(error, "Failed to save tags", {
        context: { contentId, tags },
        level: "error"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveTags,
    isSaving,
  };
};
