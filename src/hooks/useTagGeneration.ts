
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";

export function useTagGeneration() {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentId, setContentId] = useState<string>(`temp-${Date.now()}`);
  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      global.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleGenerateTags = async (text: string) => {
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
        clearTimeoutRef();
        
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
        clearTimeoutRef();
      }
    }
  };
  
  return {
    tags,
    setTags,
    isLoading,
    contentId,
    handleGenerateTags
  };
}
