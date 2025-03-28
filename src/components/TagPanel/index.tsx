
import React, { useState, useTransition } from "react";
import { TagGenerator } from "./TagGenerator";
import { TagList } from "./TagList";
import { TagSaver } from "./TagSaver";
import { useSaveTags } from "./hooks/useSaveTags";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { useTagGeneration } from "@/hooks/tagGeneration";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface TagPanelProps {
  contentId: string;
  onTagsSaved: (contentId: string) => void;
}

export function TagPanel({ contentId, onTagsSaved }: TagPanelProps) {
  const navigate = useNavigate();
  const {
    saveTags,
    isProcessing,
    isRetrying
  } = useSaveTags();
  
  // Use the hook for tag generation
  const {
    tags,
    isLoading,
    contentId: tagContentId,
    setContentId,
    handleGenerateTags
  } = useTagGeneration();
  
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  
  // Handle tag generation from content - renamed to processTagGeneration
  const processTagGeneration = (text: string) => {
    if (text && text.trim()) {
      setContent(text);
      
      // Fixed: Use startTransition properly without async/await
      startTransition(() => {
        // Call the tag generation function from the hook
        handleGenerateTags(text)
          .then(newContentId => {
            if (newContentId) {
              setContentId(newContentId);
            }
          })
          .catch(err => {
            console.error("Error generating tags:", err);
            toast({
              title: "Error",
              description: "Failed to generate tags. Please try again.",
              variant: "destructive"
            });
          });
      });
    }
  };
  
  // Handle tag click for filtering or navigation
  const handleTagClick = (tag: string) => {
    toast({
      title: "Navigating to tag",
      description: `Searching for content with tag: ${tag}`
    });
    navigate(`/search?tag=${encodeURIComponent(tag)}`);
  };
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        <TagGenerator 
          isLoading={isLoading || isPending}
          onGenerateTags={processTagGeneration}
        />
        
        <TagList 
          tags={tags}
          isLoading={isLoading || isPending}
          knowledgeSourceId={tagContentId || contentId}
          onTagClick={handleTagClick}
        />
        
        <TagSaver
          tags={tags}
          contentId={tagContentId || contentId}
          saveTags={saveTags}
          isProcessing={isProcessing}
          isRetrying={isRetrying}
          onTagsSaved={onTagsSaved}
        />
      </div>
    </ErrorBoundary>
  );
}
