
import { useState, useEffect, useCallback, useTransition } from "react";
import { TagContentGenerator } from "./TagContentGenerator";
import { TagSaver } from "./TagSaver";
import { useTagGeneration } from "@/hooks/tagGeneration";
import { useSaveTags } from "./hooks/useSaveTags";
import { handleError } from "@/utils/error-handling";

interface TagPanelProps {
  contentId: string;
  onTagsSaved?: (savedContentId: string) => void;
}

export function TagPanel({ contentId, onTagsSaved }: TagPanelProps) {
  const [lastSavedContentId, setLastSavedContentId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    generateTags, 
    isLoading: isGenerating, 
    error: generationError 
  } = useTagGeneration();
  
  const { 
    saveTags, 
    isRetrying, 
    isProcessing 
  } = useSaveTags();

  // Initialize component
  useEffect(() => {
    if (!isInitialized) {
      console.log("TagPanel initialized with contentId:", contentId);
      setIsInitialized(true);
    }
  }, [contentId, isInitialized]);

  // Handle generation errors
  useEffect(() => {
    if (generationError) {
      handleError(
        generationError,
        "There was an error generating tags. Please try again.",
        { level: "warning" }
      );
    }
  }, [generationError]);

  // Handle tag generation
  const handleGenerateTags = useCallback(async (text: string): Promise<string | undefined> => {
    try {
      console.log("TagPanel: Generating tags for content of length:", text.length);
      
      // Start transition to show loading state
      startTransition(async () => {
        const generatedTags = await generateTags(text);
        
        if (generatedTags && generatedTags.length > 0) {
          setTags(generatedTags);
          console.log("TagPanel: Tags generated successfully:", generatedTags);
        } else {
          setTags([]);
          console.warn("TagPanel: No tags were generated");
        }
      });
      
      return contentId;
    } catch (err) {
      console.error("TagPanel: Error in handleGenerateTags:", err);
      return undefined;
    }
  }, [contentId, generateTags]);

  // Handle tag saving with notification to parent
  const handleTagsSaved = useCallback((savedContentId: string) => {
    console.log("TagPanel: Tags saved with contentId:", savedContentId);
    
    if (onTagsSaved) {
      console.log("TagPanel: Notifying parent of saved tags");
      onTagsSaved(savedContentId);
    }
  }, [onTagsSaved]);

  return (
    <div className="space-y-6">
      <TagContentGenerator
        isLoading={isGenerating}
        contentId={contentId}
        handleGenerateTags={handleGenerateTags}
        setLastSavedContentId={setLastSavedContentId}
        isPending={isPending}
      />

      {tags.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Generated Tags</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <TagSaver
            tags={tags}
            contentId={lastSavedContentId || contentId}
            saveTags={saveTags}
            isProcessing={isProcessing}
            isRetrying={isRetrying}
            onTagsSaved={handleTagsSaved}
          />
        </div>
      )}
    </div>
  );
}
