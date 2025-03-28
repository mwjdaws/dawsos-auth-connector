
import React from "react";
import { TagGenerator } from "./TagGenerator";
import { TagContentGenerator } from "./TagContentGenerator";
import { TagSaver } from "./TagSaver";
import { useSaveTags } from "./hooks/useSaveTags";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";

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
  
  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-6 w-full">
        <TagContentGenerator 
          onContentChange={setContent} 
        />
        
        <TagGenerator 
          content={content}
          onTagsGenerated={setGeneratedTags}
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
