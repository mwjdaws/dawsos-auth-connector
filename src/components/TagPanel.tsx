
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { generateTags } from "@/utils/supabase-functions";

interface TagPanelProps {
  onTagsGenerated?: (tags: string[]) => void;
  className?: string;
}

const TagPanel = ({ onTagsGenerated, className }: TagPanelProps) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTags = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to generate tags",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const generatedTags = await generateTags(content);
      setTags(generatedTags);
      if (onTagsGenerated) {
        onTagsGenerated(generatedTags);
      }
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
    <div className={`space-y-4 ${className || ""}`}>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Generate Tags</h3>
        <p className="text-sm text-muted-foreground">
          Enter text below to generate relevant tags
        </p>
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content here..."
        className="min-h-[150px]"
      />
      
      <Button 
        onClick={handleGenerateTags} 
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? "Generating..." : "Generate Tags"}
      </Button>

      {tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Generated Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagPanel;
