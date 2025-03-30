import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/errors";
import { isValidContentId } from "@/utils/validation";
import { Tag, TagOperationsProps, UseTagStateResult, UseTagMutationsResult } from "./types";

/**
 * Hook for handling tag mutation operations (add/delete) with proper error handling
 * and validation.
 * 
 * @param props - Configuration props including contentId and user info
 * @param tagState - Current tag state from useTagState hook
 * @returns Object with handleAddTag and handleDeleteTag functions
 */
export function useTagMutations(
  { contentId, user, onMetadataChange }: TagOperationsProps,
  { tags, setTags, newTag, setNewTag }: UseTagStateResult
): UseTagMutationsResult {
  
  /**
   * Adds a new tag to the content
   * 
   * @param typeId - Optional tag type ID for categorizing the tag
   * @returns Promise that resolves when operation completes
   */
  const handleAddTag = async (typeId?: string): Promise<void> => {
    if (!newTag.trim() || !user) {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add tags",
          variant: "destructive",
        });
      }
      return;
    }

    // Validate contentId before adding tag
    if (!isValidContentId(contentId)) {
      toast({
        title: "Invalid Content",
        description: "Cannot add tags to temporary or invalid content",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check for existing tag with same name and content_id to avoid duplicates
      const { data: existingTags, error: checkError } = await supabase
        .from("tags")
        .select("id")
        .eq("name", newTag.trim().toLowerCase())
        .eq("content_id", contentId);
      
      if (checkError) throw checkError;
      
      if (existingTags && existingTags.length > 0) {
        toast({
          title: "Duplicate Tag",
          description: "This tag already exists for this content",
          variant: "destructive",
        });
        return;
      }
      
      const newTagData = {
        name: newTag.trim().toLowerCase(),
        content_id: contentId,
        type_id: typeId || null // Support for tag types
      };
      
      console.log("Adding tag:", newTagData);
      
      const result = await supabase
        .from("tags")
        .insert(newTagData)
        .select();
      
      // Defensive check for valid response format
      if (typeof result === 'object' && result !== null && 'data' in result) {
        const { data, error } = result;
        
        if (error) throw error;
        
        // Verify we got data back before updating state
        if (data && data.length > 0) {
          // Fix: Use the spread operator correctly to maintain type consistency
          setTags([...tags, data[0]]);
          setNewTag("");
          
          toast({
            title: "Success",
            description: "Tag added successfully",
          });
          
          if (onMetadataChange) {
            onMetadataChange();
          }
          
          console.log("Tag added successfully:", data[0]);
        } else {
          throw new Error("Failed to create tag: No data returned");
        }
      } else {
        throw new Error("Unexpected response format when adding tag");
      }
    } catch (error: any) {
      console.error("Error adding tag:", error);
      
      // Use standardized error handling
      handleError(error, "Failed to add tag", {
        context: { tagName: newTag, contentId },
        level: "error"
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete tags",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Deleting tag with ID:", tagId);
      
      const result = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      // Defensive check for valid response format
      if (typeof result === 'object' && result !== null && 'error' in result) {
        const { error } = result;
        if (error) throw error;
      }
      
      // Update state after successful deletion
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      console.log("Tag deleted successfully");
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      
      // Use standardized error handling
      handleError(error, "Failed to delete tag", {
        context: { tagId },
        level: "error" 
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  return {
    handleAddTag,
    handleDeleteTag
  };
}
