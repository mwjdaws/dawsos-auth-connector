
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTagValidator } from './useTagValidator';
import { useTagGroups } from './useTagGroups';

/**
 * Options for saving tags
 */
export interface SaveTagsOptions {
  contentId?: string;
  maxRetries?: number;
  skipGenerateFunction?: boolean;
}

/**
 * Return type for save tags operation
 */
export type SaveTagsResult = string | { 
  success: boolean; 
  contentId?: string; 
  message?: string; 
};

/**
 * Hook for saving tags with validation and proper error handling
 * 
 * @returns Object containing save function and state
 */
export function useSaveTags() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { validateTagText, validateTagList } = useTagValidator();
  const tagGroups = useTagGroups();

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
      const validationResult = validateTagText(tags.join(', '), {
        allowEmpty: false,
        maxLength: 50
      });
      
      if (!validationResult) {
        toast({
          title: "Validation Error",
          description: "Invalid tags",
          variant: "destructive"
        });
        return { success: false, message: "Invalid tags" };
      }
      
      // Mock implementation for now
      // In a real implementation, we would call an API to save the tags
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Tags Saved",
        description: `Successfully saved ${tags.length} tag${tags.length !== 1 ? 's' : ''}`,
      });
      
      // Return either the contentId or success status
      return options.contentId || 'mock-content-id';
      
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
        contentId: options.contentId || "",
        message: errorMessage 
      };
    } finally {
      setIsProcessing(false);
    }
  }, [validateTagText]);

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
