
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
      handleError(
        new Error("Authentication required"),
        "Please log in to save tags",
        { level: "error" }
      );
      return;
    }

    if (tags.length === 0) {
      handleError(
        new Error("No tags to save"),
        "Please generate some tags before saving",
        { level: "warning" }
      );
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
    
    try {
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
      } else if (!success) {
        throw new Error("Failed to save tags - operation returned failure status");
      }
    } catch (error) {
      clearTimeout(timeoutId);
      handleError(
        error, 
        "Failed to save tags", 
        {
          level: "error",
          actionLabel: "Retry",
          action: handleSaveTags
        }
      );
    } finally {
      clearTimeout(timeoutId);
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
