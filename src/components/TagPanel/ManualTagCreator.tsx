
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/content-validation";

interface TagType {
  id: string;
  name: string;
}

interface ManualTagCreatorProps {
  contentId: string;
  onTagCreated: () => void;
  className?: string;
}

/**
 * A component that allows users to manually create tags with specified types
 * 
 * @param contentId - The ID of the content to tag
 * @param onTagCreated - Callback function when a tag is created successfully
 * @param className - Optional CSS class name
 */
export function ManualTagCreator({ contentId, onTagCreated, className }: ManualTagCreatorProps) {
  const [tagName, setTagName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<string | undefined>();
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTypes, setIsFetchingTypes] = useState(true);

  // Fetch available tag types on component mount
  useEffect(() => {
    const fetchTagTypes = async () => {
      try {
        setIsFetchingTypes(true);
        setError(null);
        
        console.log("ManualTagCreator: Fetching tag types...");
        
        const { data, error } = await supabase
          .from("tag_types")
          .select("id, name")
          .order("name");

        if (error) throw error;

        setTagTypes(data || []);
        
        // Set a default selection if available
        if (data && data.length > 0) {
          setSelectedTypeId(data[0].id);
        }
      } catch (error) {
        console.error("ManualTagCreator: Error fetching tag types:", error);
        toast({
          title: "Error",
          description: "Failed to load tag types",
          variant: "destructive",
        });
      } finally {
        setIsFetchingTypes(false);
      }
    };

    fetchTagTypes();
  }, []);

  const handleCreateTag = async () => {
    if (!tagName.trim() || !selectedTypeId) {
      toast({
        title: "Missing Information",
        description: "Please provide a tag name and select a tag type",
        variant: "destructive",
      });
      return;
    }

    // Validate content ID before creating the tag
    if (!isValidContentId(contentId)) {
      toast({
        title: "Invalid Content ID",
        description: "Cannot create a tag for an invalid or temporary content ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tags")
        .insert({
          name: tagName.trim(),
          content_id: contentId,
          type_id: selectedTypeId
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag created successfully",
      });

      // Reset form
      setTagName("");
      
      // Notify parent component of the new tag
      if (onTagCreated) {
        onTagCreated();
      }
    } catch (error: any) {
      console.error("Error creating tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tag",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="text-sm font-medium mb-1">Add Manual Tag</div>
      <div className="flex items-center space-x-2">
        <Input
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag name"
          className="flex-1"
          disabled={isLoading}
        />
        
        <Select
          value={selectedTypeId}
          onValueChange={setSelectedTypeId}
          disabled={isFetchingTypes || isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {tagTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          onClick={handleCreateTag}
          disabled={!tagName.trim() || !selectedTypeId || isLoading || !isValidContentId(contentId)}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
