
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/validation";
import { Tag } from "./types";
import { handleError } from "@/utils/errors";

export interface UseTagMutationsProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export interface UseTagMutationsResult {
  handleAddTag: (name: string, typeId?: string | null) => Promise<Tag | null>;
  handleDeleteTag: (tagId: string) => Promise<boolean>;
  isAdding: boolean;
  isDeleting: boolean;
}

export const useTagMutations = ({ 
  contentId,
  onMetadataChange 
}: UseTagMutationsProps): UseTagMutationsResult => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTag = async (name: string, typeId?: string | null): Promise<Tag | null> => {
    if (!name.trim() || !contentId || !isValidContentId(contentId)) {
      toast({
        title: "Cannot Add Tag",
        description: "Invalid tag name or content ID",
        variant: "destructive"
      });
      return null;
    }

    setIsAdding(true);

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([
          { 
            name: name.trim().toLowerCase(), 
            content_id: contentId,
            type_id: typeId || null
          }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Notify that tag was added
        toast({
          title: "Tag Added",
          description: `Added tag "${name}"`,
          variant: "default"
        });

        // Call the onChange callback if provided
        if (onMetadataChange) {
          onMetadataChange();
        }

        setIsAdding(false);
        return data[0] as Tag;
      }

      throw new Error("No tag was returned from the server");
    } catch (err: any) {
      console.error("Error adding tag:", err);
      
      handleError(err, "Error adding tag", {
        context: { contentId, tagName: name },
        level: "error"
      });

      toast({
        title: "Error Adding Tag",
        description: err.message || "Failed to add tag",
        variant: "destructive"
      });

      setIsAdding(false);
      return null;
    }
  };

  const handleDeleteTag = async (tagId: string): Promise<boolean> => {
    if (!tagId || !contentId || !isValidContentId(contentId)) {
      toast({
        title: "Cannot Delete Tag",
        description: "Invalid tag ID or content ID",
        variant: "destructive"
      });
      return false;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId)
        .eq("content_id", contentId);

      if (error) throw error;

      // Notify that tag was deleted
      toast({
        title: "Tag Deleted",
        description: "Tag was successfully removed"
      });

      // Call the onChange callback if provided
      if (onMetadataChange) {
        onMetadataChange();
      }

      setIsDeleting(false);
      return true;
    } catch (err: any) {
      console.error("Error deleting tag:", err);
      
      handleError(err, "Error deleting tag", {
        context: { contentId, tagId },
        level: "error"
      });

      toast({
        title: "Error Deleting Tag",
        description: err.message || "Failed to delete tag",
        variant: "destructive"
      });

      setIsDeleting(false);
      return false;
    }
  };

  return {
    handleAddTag,
    handleDeleteTag,
    isAdding,
    isDeleting
  };
};
