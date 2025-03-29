
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/content-validation";

export interface Tag {
  id: string;
  name: string;
  content_id: string;
}

export interface UseTagOperationsProps {
  contentId: string;
  user: any;
  onMetadataChange?: () => void;
}

export const useTagOperations = ({ contentId, user, onMetadataChange }: UseTagOperationsProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  
  const fetchTags = async () => {
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching tags:", contentId);
      return [];
    }
    
    try {
      console.log("Fetching tags for contentId:", contentId);
      
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("*")
        .eq("content_id", contentId);
      
      if (tagError) throw tagError;
      
      console.log("Tags fetched:", tagData);
      return tagData || [];
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      throw err;
    }
  };

  const handleAddTag = async () => {
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
      const newTagData = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      console.log("Adding tag:", newTagData);
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagData)
        .select();
      
      if (error) throw error;
      
      setTags(prev => [...prev, data![0]]);
      setNewTag("");
      
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
      
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      console.log("Tag added successfully:", data![0]);
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
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
      
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
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
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  return {
    tags,
    setTags,
    newTag,
    setNewTag,
    fetchTags,
    handleAddTag,
    handleDeleteTag
  };
};
