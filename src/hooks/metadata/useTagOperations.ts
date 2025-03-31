
/**
 * Hook for tag operations (add, delete)
 */
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tag } from "@/types/tag";
import { handleError } from "@/utils/errors";
import { useContentIdValidation } from "@/hooks/validation";

interface UseTagOperationsProps {
  contentId?: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

/**
 * Hook for tag operations
 */
export function useTagOperations({
  contentId,
  tags,
  setTags
}: UseTagOperationsProps) {
  // Validate content ID
  const { isValid } = useContentIdValidation(contentId);
  
  /**
   * Add a tag to the content
   */
  const addTag = useCallback(async (name: string, typeId?: string): Promise<Tag | null> => {
    if (!contentId || !isValid || !name.trim()) return null;
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ 
          name: name.trim().toLowerCase(), 
          content_id: contentId,
          type_id: typeId 
        }])
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        const newTag = data[0] as Tag;
        setTags([...tags, newTag]);
        
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
        
        return newTag;
      }
      
      return null;
    } catch (error) {
      handleError(
        error,
        "Failed to add tag",
        { 
          level: "warning", 
          technical: false,
          context: { contentId }
        }
      );
      
      return null;
    }
  }, [contentId, isValid, tags, setTags]);

  /**
   * Delete a tag from the content
   */
  const deleteTag = useCallback(async (tagId: string): Promise<boolean> => {
    if (!contentId || !isValid || !tagId) return false;
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) throw error;
      
      // Update local state
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to delete tag",
        { 
          level: "warning", 
          technical: false,
          context: { contentId }
        }
      );
      
      return false;
    }
  }, [contentId, isValid, tags, setTags]);

  return {
    addTag,
    deleteTag
  };
}

export default useTagOperations;
