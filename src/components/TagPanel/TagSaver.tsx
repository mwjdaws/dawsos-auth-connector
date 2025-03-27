
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { TagSaveButton } from "./TagSaveButton";
import { handleError } from "@/utils/error-handling";

interface TagSaverProps {
  tags: string[];
  contentId: string | null;
  saveTags: (text: string, tags: string[], options: any) => Promise<any>;
  isProcessing: boolean;
  isRetrying: boolean;
  onTagsSaved: (savedContentId: string) => void;
}

export function TagSaver({
  tags,
  contentId,
  saveTags,
  isProcessing,
  isRetrying,
  onTagsSaved
}: TagSaverProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Optimized tag saving with better error handling
  const handleSaveTags = useCallback(async () => {
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

    // Prevent duplicate save operations
    if (isSaving || isProcessing) {
      toast({
        title: "Save in Progress",
        description: "Please wait for the current save operation to complete",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Add a timeout to prevent UI from being stuck in saving state
      const timeoutId = setTimeout(() => {
        if (isSaving) {
          setIsSaving(false);
          toast({
            title: "Operation Timeout",
            description: "The save operation is taking longer than expected. It may still complete in the background.",
            variant: "default",
          });
        }
      }, 10000);
      
      const success = await saveTags("", tags, { 
        contentId,
        maxRetries: isRetrying ? 0 : 1
      });
      
      clearTimeout(timeoutId);
      
      if (success && typeof success === 'string') {
        console.log("Tags saved successfully with contentId:", success);
        onTagsSaved(success);
        
        toast({
          title: "Success",
          description: `${tags.length} tags saved successfully`,
          variant: "default",
        });
      }
    } catch (error) {
      handleError(error, "Failed to save tags");
    } finally {
      setIsSaving(false);
    }
  }, [user, tags, contentId, saveTags, isRetrying, isProcessing, onTagsSaved, isSaving]);

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <TagSaveButton
        isSaving={isSaving || isProcessing}
        tags={tags}
        isUserLoggedIn={!!user}
        onSaveTags={handleSaveTags}
      />
    </div>
  );
}
