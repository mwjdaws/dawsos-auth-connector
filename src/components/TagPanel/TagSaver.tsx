
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TagSaverProps {
  tags: string[];
  contentId: string;
  saveTags: (text: string, tags: string[], options: any) => Promise<string | boolean>;
  isProcessing: boolean;
  isRetrying: boolean;
  onTagsSaved: (contentId: string) => void;
}

export function TagSaver({
  tags,
  contentId,
  saveTags,
  isProcessing,
  isRetrying,
  onTagsSaved
}: TagSaverProps) {
  const [saveComplete, setSaveComplete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (tags.length === 0) {
      toast({
        title: "No Tags to Save",
        description: "Generate tags first before saving",
        variant: "destructive",
      });
      return;
    }

    console.log("TagSaver: Saving tags:", {
      tagCount: tags.length,
      contentId: contentId,
    });
    
    setSaveComplete(false);
    setSaveError(null);
    
    try {
      const result = await saveTags("", tags, {
        contentId: contentId,
        skipGenerateFunction: true
      });
      
      console.log("TagSaver: Save result:", result);
      
      if (result && typeof result === 'string') {
        setSaveComplete(true);
        toast({
          title: "Tags Saved",
          description: `${tags.length} tags saved successfully`,
        });
        
        // Notify parent component
        onTagsSaved(result);
      } else {
        setSaveError("Failed to save tags");
        toast({
          title: "Error",
          description: "Failed to save tags. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("TagSaver: Error saving tags:", error);
      setSaveError(error instanceof Error ? error.message : "Failed to save tags");
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving tags",
        variant: "destructive",
      });
    }
  };

  const isDisabled = isProcessing || isRetrying || tags.length === 0;
  
  return (
    <div className="space-y-4">
      {saveError && (
        <Alert variant="destructive">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {tags.length === 0 
            ? "No tags to save" 
            : `${tags.length} tags ready to save`}
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isDisabled}
          variant={saveComplete ? "outline" : "default"}
          className="min-w-[100px]"
        >
          {isProcessing || isRetrying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveComplete ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Tags
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
