
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTagValidator } from './useTagValidator';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';

export interface SaveTagsResult {
  success: boolean;
  contentId?: string;
  message?: string;
}

export const useSaveTags = (initialContentId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const tagValidator = useTagValidator();

  const saveTags = async (text: string, tags: string[], options?: { contentId?: string }): Promise<SaveTagsResult> => {
    const contentId = options?.contentId || initialContentId;
    
    if (!contentId) {
      toast({
        title: "Error",
        description: "No content ID provided",
        variant: "destructive",
      });
      return { success: false, message: "No content ID provided" };
    }

    // Validate tags before saving
    const isValid = tagValidator.validate(tags);
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: tagValidator.validationResult.message,
        variant: "destructive",
      });
      return { success: false, message: tagValidator.validationResult.message };
    }

    setIsSaving(true);
    setIsProcessing(true);

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

      return { success: true, contentId };
    } catch (error) {
      handleError(error, "Failed to save tags", {
        context: { contentId, tags },
        level: "error"
      });
      return { success: false, message: "Failed to save tags" };
    } finally {
      setIsSaving(false);
      setIsProcessing(false);
    }
  };

  return {
    saveTags,
    isSaving,
    isProcessing,
    isRetrying
  };
};
