
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { toast } from "@/hooks/use-toast";
import { Tag } from "./useMarkdownMetadata";
import { isValidContentId } from "@/utils/content-validation";

interface UseTagManagementProps {
  contentId: string;
  editable: boolean;
}

export const useTagManagement = ({ contentId, editable }: UseTagManagementProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = async (tags: Tag[], setTagsFn: React.Dispatch<React.SetStateAction<Tag[]>>) => {
    if (!newTag.trim() || !editable) return;
    
    // Validate content ID before adding tag
    if (!isValidContentId(contentId)) {
      console.warn("Cannot add tag to invalid or temporary contentId:", contentId);
      toast({
        title: "Invalid Content",
        description: "Cannot add tags to temporary or invalid content",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTagObj = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      console.log("Adding tag:", newTagObj);
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagObj)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTagsFn((prevTags) => [...prevTags, data[0]]);
        setNewTag("");
        
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
        
        console.log("Tag added successfully:", data[0]);
      }
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string, tags: Tag[], setTagsFn: React.Dispatch<React.SetStateAction<Tag[]>>) => {
    if (!editable) return;
    
    try {
      console.log("Deleting tag with ID:", tagId);
      
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
      setTagsFn(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
      
      console.log("Tag deleted successfully");
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  return {
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag
  };
};
