
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SaveTagsResult } from "./hooks/types";

interface TagSaverProps {
  tags: string[];
  contentId: string;
  saveTags: () => Promise<void>;
  isProcessing: boolean;
  isRetrying: boolean;
  onTagsSaved: (contentId: string) => void;
  disabled?: boolean;
}

export function TagSaver({
  tags,
  contentId,
  saveTags,
  isProcessing,
  isRetrying,
  onTagsSaved,
  disabled = false
}: TagSaverProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        {tags.length === 1 
          ? '1 tag to save' 
          : `${tags.length} tags to save`}
      </div>
      <Button
        onClick={saveTags}
        disabled={tags.length === 0 || isProcessing || disabled}
        className="min-w-[120px]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRetrying ? "Retrying..." : "Saving..."}
          </>
        ) : (
          "Save Tags"
        )}
      </Button>
    </div>
  );
}
