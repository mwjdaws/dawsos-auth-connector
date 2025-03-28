
import React from "react";
import { TagGenerator } from "./TagGenerator";
import { TagList } from "./TagList";
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
  const [isGeneratingTags, setIsGeneratingTags] = React.useState(false);
  
  // Handle tag generation from content
  const handleGenerateTags = async (text: string) => {
    // This is a simple implementation - the actual TagGenerator component
    // will handle the processing, this just receives the results
    if (text && text.trim()) {
      setIsGeneratingTags(true);
      try {
        // Generate tags based on the text
        // For now, just set some placeholder tags
        setGeneratedTags(["tag1", "tag2", "tag3"]);
        setContent(text);
      } finally {
        setIsGeneratingTags(false);
      }
    }
  };
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        <TagGenerator 
          isLoading={isGeneratingTags}
          onGenerateTags={handleGenerateTags}
        />
        
        <TagList 
          tags={generatedTags}
          isLoading={isGeneratingTags}
          knowledgeSourceId={contentId.startsWith("temp-") ? undefined : contentId}
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
