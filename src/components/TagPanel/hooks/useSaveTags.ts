
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useTagValidator, TagValidationOptions } from './useTagValidator';

interface SaveTagsOptions {
  contentId?: string;
  skipExistingCheck?: boolean;
}

interface SaveTagsResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

/**
 * Hook for saving batches of tags
 */
export function useSaveTags() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { validateTag } = useTagValidator();
  
  /**
   * Save a batch of tags to a content item
   */
  const saveTags = useCallback(async (
    text: string, 
    tags: string[],
    options?: SaveTagsOptions
  ): Promise<string | null> => {
    const { contentId = '', skipExistingCheck = false } = options || {};
    if (!contentId) {
      toast({
        title: "Error",
        description: "Content ID is required to save tags",
        variant: "destructive",
      });
      return null;
    }
    
    // Filter out empty tags
    const validTags = tags.filter(tag => tag.trim().length > 0);
    
    if (validTags.length === 0) {
      toast({
        title: "No Tags",
        description: "No valid tags to save",
        variant: "destructive",
      });
      return null;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Validate each tag first
      const validationOptions: TagValidationOptions = {
        allowEmpty: false,
        minLength: 1,
        maxLength: 50
      };
      
      const invalidTags = validTags.filter(tag => 
        !validateTag(tag, validationOptions).isValid
      );
      
      if (invalidTags.length > 0) {
        toast({
          title: "Invalid Tags",
          description: `${invalidTags.length} tag(s) are invalid and will be skipped`,
          variant: "default",
        });
      }
      
      // Skip existing check if requested
      if (!skipExistingCheck) {
        // Check for existing tags
        const { data: existingTags } = await supabase
          .from('tags')
          .select('name')
          .eq('content_id', contentId);
        
        if (existingTags && existingTags.length > 0) {
          const existingTagNames = existingTags.map(t => t.name.toLowerCase());
          const newTags = validTags.filter(tag => 
            !existingTagNames.includes(tag.toLowerCase())
          );
          
          if (newTags.length === 0) {
            toast({
              title: "No New Tags",
              description: "All tags already exist for this content",
              variant: "default",
            });
            return contentId;
          }
          
          // Continue with only new tags
          validTags.length = 0;
          validTags.push(...newTags);
        }
      }
      
      // Insert tags
      const tagsToInsert = validTags.map(tag => ({
        name: tag.trim(),
        content_id: contentId
      }));
      
      const { error: insertError } = await supabase
        .from('tags')
        .insert(tagsToInsert);
      
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Tags Saved",
        description: `${validTags.length} tag(s) added successfully`,
      });
      
      return contentId;
    } catch (err) {
      console.error('Error saving tags:', err);
      setError(err instanceof Error ? err : new Error('Failed to save tags'));
      
      toast({
        title: "Error Saving Tags",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [validateTag]);
  
  /**
   * Retry saving tags after failure
   */
  const retryTagSave = useCallback(async (
    text: string,
    tags: string[],
    options?: SaveTagsOptions
  ): Promise<string | null> => {
    setIsRetrying(true);
    
    try {
      return await saveTags(text, tags, options);
    } finally {
      setIsRetrying(false);
    }
  }, [saveTags]);
  
  return {
    saveTags,
    retryTagSave,
    isProcessing,
    isRetrying,
    error
  };
}
