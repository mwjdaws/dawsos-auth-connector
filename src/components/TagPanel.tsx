
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TagPanel() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-4">
      <Textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Paste content here..."
        className="min-h-[150px]"
      />
      <Button 
        onClick={handleTagging}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? "Generating..." : "Suggest Tags"}
      </Button>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default TagPanel;
