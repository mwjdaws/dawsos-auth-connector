
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

export function TagPanel() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contentId, setContentId] = useState<string>(`temp-${Date.now()}`); // Temporary content ID

  const handleTagging = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to generate tags",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tags', {
        body: { content: text }
      });
      
      if (error) throw error;
      
      setTags(data?.tags || []);
      // Generate a new content ID for this set of tags
      setContentId(`temp-${Date.now()}`);
      
      toast({
        title: "Success",
        description: "Tags generated successfully",
      });
    } catch (error) {
      console.error("Error generating tags:", error);
      toast({
        title: "Error",
        description: "Failed to generate tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTags = async () => {
    if (tags.length === 0) {
      toast({
        title: "Error",
        description: "No tags to save",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Prepare tags for insertion
      const tagsToInsert = tags.map(tag => ({
        name: tag,
        content_id: contentId
      }));

      // Insert tags into the database
      const { error } = await supabase
        .from("tags")
        .insert(tagsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${tags.length} tags saved successfully`,
      });
    } catch (error) {
      console.error("Error saving tags:", error);
      toast({
        title: "Error",
        description: "Failed to save tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Paste content here..."
        className="min-h-[150px]"
      />
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleTagging}
          disabled={isLoading || !text.trim()}
          className="mr-2"
        >
          {isLoading ? "Generating..." : "Suggest Tags"}
        </Button>
        {tags.length > 0 && (
          <Button
            onClick={handleSaveTags}
            disabled={isSaving || tags.length === 0}
            variant="outline"
          >
            {isSaving ? "Saving..." : (
              <span className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                Save Tags
              </span>
            )}
          </Button>
        )}
      </div>
      {tags.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TagPanel;
