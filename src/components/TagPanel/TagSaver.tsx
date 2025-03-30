
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SaveTagsResult, SaveTagsOptions } from "./hooks/types";

interface TagSaverProps {
  tags: string[];
  contentId: string;
  saveTags: (text: string, tags: string[], options?: SaveTagsOptions) => Promise<SaveTagsResult>;
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
  const handleSave = async () => {
    if (disabled) return;
    
    const result = await saveTags("", tags, { contentId });
    
    // Handle different result formats
    if (result) {
      if (typeof result === 'string') {
        onTagsSaved(result);
      } else if (typeof result === 'object' && result.success && result.contentId) {
        onTagsSaved(result.contentId);
      }
    }
  };

  const hasTags = tags.length > 0;
  const buttonDisabled = isProcessing || !hasTags || disabled;
  
  let buttonText = "Save Tags";
  if (isProcessing) buttonText = "Saving...";
  if (isRetrying) buttonText = "Retrying...";
  if (disabled) buttonText = "Save note first";

  return (
    <div>
      <Button 
        onClick={handleSave}
        disabled={buttonDisabled}
        className="w-full"
      >
        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>
      
      {!hasTags && !isProcessing && !disabled && (
        <p className="text-xs text-muted-foreground mt-2">
          Generate or add tags before saving
        </p>
      )}
      
      {disabled && (
        <p className="text-xs text-muted-foreground mt-2">
          Save your note before adding tags to it
        </p>
      )}
    </div>
  );
}
