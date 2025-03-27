
import { useState, useEffect, useTransition, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { TagList } from "./TagList";
import { TagGenerator } from "./TagGenerator";
import { TagSaveButton } from "./TagSaveButton";
import { useSaveTags } from "./hooks/useSaveTags";
import { useTagGeneration } from "@/hooks/useTagGeneration";
import { handleError } from "@/utils/error-handling";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface TagPanelProps {
  onTagsGenerated?: (contentId: string) => void;
  expectedTags?: number;
}

export function TagPanel({ 
  onTagsGenerated, 
  expectedTags = 8
}: TagPanelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const isMounted = useRef(true);
  
  const { 
    tags, 
    setTags,
    isLoading, 
    contentId,
    handleGenerateTags 
  } = useTagGeneration({
    maxRetries: 1, // Configure retry behavior
    retryDelay: 2000
  });

  const { saveTags } = useSaveTags();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleTagging = async (text: string) => {
    try {
      startTransition(() => {}); // Start transition to indicate processing
      const newContentId = await handleGenerateTags(text);
      console.log("TagPanel: handleTagging completed with contentId:", newContentId);
      
      // Notify parent component of the new contentId
      if (onTagsGenerated && newContentId) {
        console.log("TagPanel: Notifying parent of contentId:", newContentId);
        onTagsGenerated(newContentId);
      }
    } catch (error) {
      handleError(error, "Failed to generate tags");
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
        title: "No Tags",
        description: "Please generate some tags before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Pass the contentId as part of the options object
      const success = await saveTags("", tags, { contentId });
      if (success && onTagsGenerated) {
        // Notify parent component of the contentId when tags are saved
        console.log("Tags saved, notifying parent of contentId:", contentId);
        onTagsGenerated(contentId);
        
        toast({
          title: "Success",
          description: `${tags.length} tags saved successfully`,
          variant: "default",
        });
      }
    } catch (error) {
      handleError(error, "Failed to save tags");
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-red-700 font-medium mb-2">Something went wrong with the tag generator</h3>
          <p className="text-sm text-red-600 mb-4">
            We encountered an error while processing your request. Please try again or contact support.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            Reload Page
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <TagGenerator 
          isLoading={isLoading} 
          onGenerateTags={handleTagging} 
        />
        
        <div className="flex flex-wrap gap-2 mt-4">
          <TagSaveButton
            isSaving={isSaving}
            tags={tags}
            isUserLoggedIn={!!user}
            onSaveTags={handleSaveTags}
          />
        </div>
        
        {isPending && <div className="text-sm text-muted-foreground mt-2">Processing...</div>}
        <TagList 
          tags={tags} 
          isLoading={isLoading} 
          expectedTags={expectedTags} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default TagPanel;
