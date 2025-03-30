
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/validation/contentIdValidation";
import { handleError } from "@/utils/errors";
import { Tag, UseTagMutationsResult } from "./types";

export interface UseTagMutationsProps {
  contentId: string;
}

export const useTagMutations = ({ contentId }: UseTagMutationsProps): UseTagMutationsResult => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTag = async (typeId?: string | null): Promise<void> => {
    if (!contentId || !isValidContentId(contentId)) {
      console.error("Invalid content ID for adding tag:", contentId);
      toast({
        title: "Error",
        description: "Cannot add tag: Invalid content ID",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      // Get the current tags for this content
      const { data: existingTags, error: fetchError } = await supabase
        .from("tags")
        .select("name")
        .eq("content_id", contentId);

      if (fetchError) throw fetchError;

      // Insert the new tag
      const { error: insertError } = await supabase
        .from("tags")
        .insert({
          name: "New Tag",
          content_id: contentId,
          type_id: typeId || null
        });

      if (insertError) throw insertError;

      toast({
        title: "Tag Added",
        description: "The tag was added successfully"
      });
    } catch (err: any) {
      console.error("Error adding tag:", err);
      handleError(err, "Failed to add tag", {
        context: { contentId },
        level: "error"
      });
      
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTag = async (tagId: string): Promise<void> => {
    if (!tagId) {
      console.error("No tag ID provided for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;

      toast({
        title: "Tag Deleted",
        description: "The tag was deleted successfully"
      });
    } catch (err: any) {
      console.error("Error deleting tag:", err);
      handleError(err, "Failed to delete tag", {
        context: { tagId, contentId },
        level: "error"
      });
      
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive"
      });
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
