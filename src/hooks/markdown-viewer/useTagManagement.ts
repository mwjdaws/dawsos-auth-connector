
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { toast } from "@/hooks/use-toast";
import { Tag } from "./useMarkdownMetadata";

interface UseTagManagementProps {
  contentId: string;
  editable: boolean;
}

export const useTagManagement = ({ contentId, editable }: UseTagManagementProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = async (tags: Tag[], setTagsFn: React.Dispatch<React.SetStateAction<Tag[]>>) => {
    if (!newTag.trim() || !editable) return;
    
    try {
      const newTagObj = {
        name: newTag.trim(),
        content_id: contentId
      };
      
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
