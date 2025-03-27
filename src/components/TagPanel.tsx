import { useState, useEffect, useTransition, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { generateTags } from "@/utils/supabase-functions";

export function TagPanel() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contentId, setContentId] = useState<string>(`temp-${Date.now()}`); // Temporary content ID
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
    
    // Set a UI timeout to prevent the button from getting stuck
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        setIsLoading(false);
        toast({
          title: "Operation timed out",
          description: "Tag generation is taking longer than expected. Please try again.",
          variant: "destructive",
        });
      }
    }, 20000); // 20 second UI timeout
    
    try {
      console.log("Starting tag generation");
      const generatedTags = await generateTags(text);
      console.log("Tag generation completed:", generatedTags);
      
      if (isMounted.current) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        setTags(generatedTags);
        setContentId(`temp-${Date.now()}`);
        
        if (generatedTags.includes("fallback") || generatedTags.includes("error")) {
          toast({
            title: "Limited results",
            description: "We had trouble generating optimal tags, so we've provided some basic ones.",
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: "Tags generated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error generating tags:", error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: "Failed to generate tags. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
  };

  const handleSaveTags = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save tags",
        variant: "destructive",
      });
      return;
    }

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
      // Generate a valid content ID if not already present
      const validContentId = contentId || `content-${Date.now()}`;
      
      // Method 1: Direct database insertion (as a fallback)
      // Method 2: Using the edge function with save=true (preferred)
      console.log(`Attempting to save tags with content_id: ${validContentId}`);
      
      // Call generateTags with save=true to use the edge function
      const savedTags = await generateTags(text, true, validContentId);
      
      if (isMounted.current) {
        if (savedTags.includes("error") || savedTags.includes("fallback")) {
          // If the edge function approach failed, fallback to direct DB insertion
          const tagsToInsert = tags.map(tag => ({
            name: tag,
            content_id: validContentId
          }));

          const { error } = await supabase
            .from("tags")
            .insert(tagsToInsert);

          if (error) {
            throw error;
          }
        }
        
        toast({
          title: "Success",
          description: `${tags.length} tags saved successfully`,
        });
      }
    } catch (error: any) {
      console.error("Error saving tags:", error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error.message || "Failed to save tags. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
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
            disabled={isSaving || tags.length === 0 || !user}
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
      {isPending && <div className="text-sm text-muted-foreground mt-2">Processing...</div>}
      {isLoading && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Generating Tags...</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-xl" />
            ))}
          </div>
        </div>
      )}
      {tags.length > 0 && !isLoading && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TagPanel;
