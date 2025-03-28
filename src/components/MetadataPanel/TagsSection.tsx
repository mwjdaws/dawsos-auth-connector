
import React from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

interface TagsSectionProps {
  tags: Tag[];
  newTag: string;
  setNewTag: (value: string) => void;
  contentId: string;
  setTags: (tags: Tag[]) => void;
  user: any;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  newTag,
  setNewTag,
  contentId,
  setTags,
  user
}) => {
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

    try {
      const newTagData = {
        name: newTag.trim(),
        content_id: contentId
      };
      
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
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      {user && (
        <div className="flex items-center space-x-2 mb-3">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new tag..."
            className="flex-1"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              {user && (
                <button 
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No tags available for this content.
        </p>
      )}
    </div>
  );
};
