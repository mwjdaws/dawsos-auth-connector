
import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { memo } from "react";
import { TagList } from "./TagList";
import { TagContentGenerator } from "./TagContentGenerator";
import { TagSaver } from "./TagSaver";
import { TagPanelErrorFallback } from "./TagPanelErrorFallback";
import { useTagGeneration } from "@/hooks/useTagGeneration";
import { useSaveTags } from "./hooks/useSaveTags";

interface TagPanelProps {
  onTagsGenerated?: (contentId: string) => void;
  expectedTags?: number;
}

export const TagPanel = memo(function TagPanel({ 
  onTagsGenerated, 
  expectedTags = 8
}: TagPanelProps) {
  const [lastSavedContentId, setLastSavedContentId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);
  
  const { 
    tags, 
    setTags,
    isLoading, 
    contentId,
    handleGenerateTags 
  } = useTagGeneration({
    maxRetries: 2,
    retryDelay: 2000
  });

  const { saveTags, isRetrying, isProcessing } = useSaveTags();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Prevent duplicate notifications when contentId doesn't change
  useEffect(() => {
    if (contentId && lastSavedContentId === contentId) {
      return;
    }
    
    if (lastSavedContentId && onTagsGenerated) {
      console.log("TagPanel: Notifying parent of contentId change:", lastSavedContentId);
      onTagsGenerated(lastSavedContentId);
    }
  }, [lastSavedContentId, contentId, onTagsGenerated]);

  // Handle successful tag saving
  const handleTagsSaved = useCallback((savedContentId: string) => {
    setLastSavedContentId(savedContentId);
  }, []);

  return (
    <ErrorBoundary fallback={<TagPanelErrorFallback />}>
      <div className="space-y-4">
        <TagContentGenerator
          isLoading={isLoading}
          contentId={contentId}
          handleGenerateTags={handleGenerateTags}
          setLastSavedContentId={setLastSavedContentId}
          isPending={isPending}
        />
        
        <TagSaver
          tags={tags}
          contentId={contentId}
          saveTags={saveTags}
          isProcessing={isProcessing}
          isRetrying={isRetrying}
          onTagsSaved={handleTagsSaved}
        />
        
        <TagList 
          tags={tags} 
          isLoading={isLoading} 
          expectedTags={expectedTags} 
        />
      </div>
    </ErrorBoundary>
  );
});

export default TagPanel;
