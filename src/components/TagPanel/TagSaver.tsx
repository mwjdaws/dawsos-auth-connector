
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SaveTagsResult } from "./hooks/types";

interface TagSaverProps {
  tags: string[];
  contentId: string;
  saveTags: (text: string, tags: string[], options?: any) => Promise<SaveTagsResult>;
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
  const handleSaveTags = async () => {
    if (!tags.length) return;
    
    const result = await saveTags("", tags, { contentId });
    
    if (typeof result === 'string') {
      onTagsSaved(result);
    } else if (result && typeof result === 'object' && 'contentId' in result && result.contentId) {
      onTagsSaved(result.contentId);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        {tags.length === 1 
          ? '1 tag to save' 
          : `${tags.length} tags to save`}
      </div>
      <Button
        onClick={handleSaveTags}
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
