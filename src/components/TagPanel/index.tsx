
import { useState, useEffect, useTransition, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { TagList } from "./TagList";
import { TagGenerator } from "./TagGenerator";
import { TagSaveButton } from "./TagSaveButton";
import { useSaveTags } from "./hooks/useSaveTags";
import { useTagGeneration } from "@/hooks/useTagGeneration";

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
  } = useTagGeneration();

  const { saveTags } = useSaveTags();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleTagging = async (text: string) => {
    const newContentId = await handleGenerateTags(text);
    console.log("TagPanel: handleTagging completed with contentId:", newContentId);
    
    // Notify parent component of the new contentId
    if (onTagsGenerated && newContentId) {
      console.log("TagPanel: Notifying parent of contentId:", newContentId);
      onTagsGenerated(newContentId);
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

    setIsSaving(true);
    try {
      // Pass the contentId as part of the options object
      const success = await saveTags("", tags, { contentId });
      if (success && onTagsGenerated) {
        // Notify parent component of the contentId when tags are saved
        console.log("Tags saved, notifying parent of contentId:", contentId);
        onTagsGenerated(contentId);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  return (
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
  );
}

export default TagPanel;
