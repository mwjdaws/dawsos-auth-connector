
import React from "react";
import { TagGenerator } from "./TagGenerator";
import { TagContentGenerator } from "./TagContentGenerator";
import { TagSaver } from "./TagSaver";
import { useSaveTags } from "./hooks/useSaveTags";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { useTagGeneration } from "@/hooks/tagGeneration";

interface TagPanelProps {
  contentId: string;
  onTagsSaved: (contentId: string) => void;
}

export function TagPanel({ contentId, onTagsSaved }: TagPanelProps) {
  const {
    saveTags,
    isProcessing,
    isRetrying
  } = useSaveTags();
  
  const [generatedTags, setGeneratedTags] = React.useState<string[]>([]);
  const [content, setContent] = React.useState("");
  
  // Handle tag generation from content
  const handleGenerateTags = async (text: string) => {
    // This is a simple implementation - the actual TagGenerator component
    // will handle the processing, this just receives the results
    if (text && text.trim()) {
      // Generate tags based on the text
      // For now, just set some placeholder tags
      setGeneratedTags(["tag1", "tag2", "tag3"]);
    }
  };
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        <TagGenerator 
          isLoading={false}
          onGenerateTags={handleGenerateTags}
        />
        
        <TagSaver
          tags={generatedTags}
          contentId={contentId}
          saveTags={saveTags}
          isProcessing={isProcessing}
          isRetrying={isRetrying}
          onTagsSaved={onTagsSaved}
        />
      </div>
    </ErrorBoundary>
  );
}
