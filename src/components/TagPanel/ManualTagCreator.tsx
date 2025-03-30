
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TagType {
  id: string;
  name: string;
}

interface ManualTagCreatorProps {
  contentId: string;
  onTagCreated: () => void;
  editable?: boolean;
}

export function ManualTagCreator({ contentId, onTagCreated, editable = true }: ManualTagCreatorProps) {
  const [tag, setTag] = useState("");
  const [tagTypeId, setTagTypeId] = useState<string>("");
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch tag types when component mounts
  useEffect(() => {
    const fetchTagTypes = async () => {
      const { data, error } = await supabase
        .from('tag_types')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching tag types:", error);
        toast({
          title: "Error",
          description: "Failed to load tag types",
          variant: "destructive"
        });
        return;
      }
      
      setTagTypes(data || []);
      
      // Set default tag type ID if we have options
      if (data && data.length > 0) {
        setTagTypeId(data[0].id);
      }
    };
    
    fetchTagTypes();
  }, []);

  const handleAddTag = async () => {
    if (!tag.trim() || !contentId || !tagTypeId || !editable) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const cleanTag = tag.trim().toLowerCase();
      
      // Check if tag already exists for this content
      const { data: existingTags, error: checkError } = await supabase
        .from('tags')
        .select('id, name')
        .eq('content_id', contentId)
        .eq('name', cleanTag);
        
      if (checkError) throw checkError;
      
      if (existingTags && existingTags.length > 0) {
        toast({
          title: "Tag Exists",
          description: "This tag already exists for this content",
          variant: "default"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add new tag
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: cleanTag,
          content_id: contentId,
          type_id: tagTypeId
        })
        .select();
        
      if (error) throw error;
      
      setTag("");
      onTagCreated();
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editable) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag name"
            className="flex-1"
            disabled={isSubmitting}
          />
          
          <Select 
            value={tagTypeId} 
            onValueChange={setTagTypeId}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {tagTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleAddTag} 
            disabled={!tag.trim() || isSubmitting || !tagTypeId}
          >
            Add
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Add tags to categorize this content. Tags will be grouped by their type.
      </p>
    </div>
  );
}
