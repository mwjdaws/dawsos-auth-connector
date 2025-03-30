
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from '@/utils/validation';
import { Tag } from "../../types";
import { handleError } from "@/utils/errors";

export interface UseTagMutationsProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export const useTagMutations = ({ contentId, onMetadataChange }: UseTagMutationsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTag = async (name: string, typeId?: string | null): Promise<Tag | null> => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      });
      return null;
    }

    if (!contentId || !isValidContentId(contentId)) {
      toast({
        title: "Error",
        description: "Invalid content ID",
        variant: "destructive",
      });
      return null;
    }

    setIsAdding(true);

    try {
      // Check if tag already exists
      const { data: existingTags, error: checkError } = await supabase
        .from("tags")
        .select("id")
        .eq("content_id", contentId)
        .eq("name", name.trim().toLowerCase());

      if (checkError) throw checkError;

      if (existingTags && existingTags.length > 0) {
        toast({
          title: "Warning",
          description: "This tag already exists for this content",
          variant: "warning",
        });
        setIsAdding(false);
        return null;
      }

      // Insert new tag
      const { data, error } = await supabase
        .from("tags")
        .insert({
          name: name.trim().toLowerCase(),
          content_id: contentId,
          type_id: typeId || null
        })
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No data returned after tag insertion");
      }

      const newTag: Tag = {
        id: data[0].id,
        name: data[0].name,
        content_id: data[0].content_id,
        type_id: data[0].type_id || null,
        type_name: null // We don't have type name in the response
      };

      toast({
        title: "Success",
        description: "Tag added successfully",
      });

      if (onMetadataChange) {
        onMetadataChange();
      }

      return newTag;
    } catch (err) {
      console.error("Error adding tag:", err);
      
      handleError(
        err instanceof Error ? err : new Error('Failed to add tag'), 
        "Error adding tag", 
        { context: { contentId, name } }
      );
      
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTag = async (tagId: string): Promise<boolean> => {
    if (!tagId) {
      toast({
        title: "Error",
        description: "Invalid tag ID",
        variant: "destructive",
      });
      return false;
    }

    if (!contentId || !isValidContentId(contentId)) {
      toast({
        title: "Error",
        description: "Invalid content ID",
        variant: "destructive",
      });
      return false;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });

      if (onMetadataChange) {
        onMetadataChange();
      }

      return true;
    } catch (err) {
      console.error("Error deleting tag:", err);
      
      handleError(
        err instanceof Error ? err : new Error('Failed to delete tag'), 
        "Error deleting tag", 
        { context: { contentId, tagId } }
      );
      
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleAddTag,
    handleDeleteTag,
    isAdding,
    isDeleting
  };
};
