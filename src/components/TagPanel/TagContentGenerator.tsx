
import { useState, useCallback } from "react";
import { TagGenerator } from "./TagGenerator";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/error-handling";

interface TagContentGeneratorProps {
  isLoading: boolean;
  contentId: string;
  handleGenerateTags: (text: string) => Promise<string | undefined>;
  setLastSavedContentId: (id: string | null) => void;
  isPending: boolean;
}

export function TagContentGenerator({
  isLoading,
  contentId,
  handleGenerateTags,
  setLastSavedContentId,
  isPending
}: TagContentGeneratorProps) {
  // Handle tag generation from content
  const handleTagging = useCallback(async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Empty Content",
        description: "Please provide some content to generate tags",
        variant: "destructive"
      });
      return;
    }
    
    console.log("TagContentGenerator: Handling tag generation for content:", text.substring(0, 50) + "...");
    
    try {
      // Use startTransition to avoid UI freezing during processing
      const newContentId = await handleGenerateTags(text);
      console.log("TagPanel: handleTagging completed with contentId:", newContentId);
      
      // Store the new contentId but don't notify parent yet (wait for save)
      if (newContentId) {
        setLastSavedContentId(newContentId);
      }
    } catch (error) {
      console.error("TagContentGenerator: Error generating tags:", error);
      handleError(
        error, 
        "Failed to generate tags", 
        {
          actionLabel: "Try Again",
          action: () => handleTagging(text)
        }
      );
    }
  }, [handleGenerateTags, setLastSavedContentId]);

  return (
    <>
      <TagGenerator 
        isLoading={isLoading} 
        onGenerateTags={handleTagging} 
      />
      {isPending && <div className="text-sm text-muted-foreground mt-2">Processing...</div>}
    </>
  );
}
