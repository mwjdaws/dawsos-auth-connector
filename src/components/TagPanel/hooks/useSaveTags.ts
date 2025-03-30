
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTagValidator } from './useTagValidator';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';
import { SaveTagsResult, SaveTagsOptions, PreviousData } from './types';

export const useSaveTags = (initialContentId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [previousData, setPreviousData] = useState<PreviousData | null>(null);
  const tagValidator = useTagValidator();

  const saveTags = async (
    text: string, 
    tags: string[], 
    options?: SaveTagsOptions
  ): Promise<SaveTagsResult> => {
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
    const isValid = tagValidator.validateTagList(tags).isValid;
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: tagValidator.validateTagList(tags).message || "Invalid tags",
        variant: "destructive",
      });
      return { success: false, message: tagValidator.validateTagList(tags).message || "Invalid tags" };
    }

    setIsSaving(true);
    setIsProcessing(true);
    
    // Store data for potential retry
    setPreviousData({
      options: options || {},
      tags,
      result: { success: false }
    });

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
      
      // Update previous data with successful result
      setPreviousData({
        options: options || {},
        tags,
        result: contentId
      });

      return contentId;
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

  const retryLastSave = async (): Promise<SaveTagsResult> => {
    if (!previousData) {
      return { success: false, message: "No previous save attempt to retry" };
    }
    
    setIsRetrying(true);
    
    try {
      return await saveTags('', previousData.tags, previousData.options);
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    saveTags,
    retryLastSave,
    isSaving,
    isProcessing,
    isRetrying,
    previousData
  };
};
