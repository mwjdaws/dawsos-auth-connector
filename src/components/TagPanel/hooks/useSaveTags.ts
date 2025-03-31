
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTagValidator } from './useTagValidator';
import { useTagGroups } from './useTagGroups';
import { SaveTagsOptions, SaveTagsResult, BatchInsertResult } from './types';
import { TagValidationOptions } from '@/utils/validation/types';

/**
 * Hook for saving tags with validation and proper error handling
 * 
 * @returns Object containing save function and state
 */
export function useSaveTags() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { validateTagText, validateTagList } = useTagValidator();
  const { saveTagGroupsToDatabase } = useTagGroups();

  /**
   * Save tags with validation
   * 
   * @param text - The content text (optional)
   * @param tags - Array of tags to save
   * @param options - Options for saving tags
   * @returns Result of the save operation
   */
  const saveTags = useCallback(async (
    text: string,
    tags: string[],
    options: SaveTagsOptions = {}
  ): Promise<SaveTagsResult> => {
    setIsProcessing(true);
    setIsRetrying(false);
    
    try {
      // Validate tags
      const validationResult = validateTagList(tags, {
        allowEmpty: false,
        maxLength: 50
      });
      
      if (!validationResult.isValid) {
        toast({
          title: "Validation Error",
          description: validationResult.message || "Invalid tags",
          variant: "destructive"
        });
        return { success: false, message: validationResult.message || "Invalid tags" };
      }
      
      // Process and save tags
      const result = await saveTagGroupsToDatabase(tags, options.contentId || "", {
        maxRetries: options.maxRetries || 3,
        skipGenerateFunction: options.skipGenerateFunction
      });
      
      if (result.success) {
        toast({
          title: "Tags Saved",
          description: `Successfully saved ${tags.length} tag${tags.length !== 1 ? 's' : ''}`,
        });
        
        // Return either the contentId or success status
        return typeof result.contentId === 'string' 
          ? result.contentId 
          : { success: true, contentId: options.contentId };
      } else {
        // Handle errors
        toast({
          title: "Failed to Save Tags",
          description: result.message || "An error occurred while saving tags",
          variant: "destructive"
        });
        
        return { 
          success: false, 
          contentId: options.contentId,
          message: result.message || "Failed to save tags" 
        };
      }
    } catch (error) {
      console.error("Error saving tags:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred";
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { 
        success: false, 
        contentId: options.contentId,
        message: errorMessage 
      };
    } finally {
      setIsProcessing(false);
    }
  }, [validateTagList, saveTagGroupsToDatabase]);

  /**
   * Retry saving tags
   * 
   * @param text - The content text (optional)
   * @param tags - Array of tags to save
   * @param options - Options for saving tags
   * @returns Result of the save operation
   */
  const retrySaveTags = useCallback(async (
    text: string,
    tags: string[],
    options: SaveTagsOptions = {}
  ): Promise<SaveTagsResult> => {
    setIsRetrying(true);
    const result = await saveTags(text, tags, options);
    setIsRetrying(false);
    return result;
  }, [saveTags]);

  return {
    saveTags,
    retrySaveTags,
    isProcessing,
    isRetrying
  };
}
