
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";

const TagGenerator = () => {
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
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Tag Generator</h2>
        <p className="text-muted-foreground">
          Enter some content below to generate relevant tags
        </p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your content here..."
          className="min-h-[200px]"
        />
        
        <Button 
          onClick={handleGenerateTags} 
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? "Generating..." : "Generate Tags"}
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Generated Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagGenerator;
