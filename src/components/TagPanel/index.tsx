
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
    if (text && text.trim()) {
      setIsGeneratingTags(true);
      try {
        // For future implementation: Replace with actual tag generation logic
        // Example using the useTagGeneration hook (uncomment when implemented)
        // const { generateTags } = useTagGeneration();
        // const tags = await generateTags(text);
        // setGeneratedTags(tags);
        
        // For now, use placeholder tags with more realistic content
        setTimeout(() => {
          setGeneratedTags([
            "knowledge", 
            "management", 
            "documentation", 
            "metadata", 
            "tagging",
            "ontology"
          ]);
        }, 1000);
        
        setContent(text);
      } finally {
        setTimeout(() => {
          setIsGeneratingTags(false);
        }, 1000);
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
          knowledgeSourceId={contentId}
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
