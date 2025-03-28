
import { useState, useCallback } from "react";
import { TagGenerator } from "./TagGenerator";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/error-handling";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface TagContentGeneratorProps {
  isLoading: boolean;
  contentId: string;
  handleGenerateTags: (text: string) => Promise<string | undefined>;
  setLastSavedContentId: (id: string | null) => void;
  isPending: boolean;
}

export function TagContentGenerator({
  isLoading,
  contentId,
  handleGenerateTags,
  setLastSavedContentId,
  isPending
}: TagContentGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle tag generation from content
  const handleTagging = useCallback(async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Empty Content",
        description: "Please provide some content to generate tags",
        variant: "destructive"
      });
      return;
    }
    
    console.log("TagContentGenerator: Handling tag generation for content:", text.substring(0, 50) + "...");
    setError(null);
    setIsProcessing(true);
    
    try {
      // Use startTransition to avoid UI freezing during processing
      const newContentId = await handleGenerateTags(text);
      console.log("TagContentGenerator: handleTagging completed with contentId:", newContentId);
      
      // Store the new contentId but don't notify parent yet (wait for save)
      if (newContentId) {
        setLastSavedContentId(newContentId);
        toast({
          title: "Tags Generated",
          description: "Tags were successfully generated from your content",
        });
      } else {
        setError("No content ID was returned. Tag generation may have failed.");
        toast({
          title: "Warning",
          description: "Tags were generated but may be incomplete",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("TagContentGenerator: Error generating tags:", error);
      
      let errorMessage = "Failed to generate tags";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      setError(errorMessage);
      
      handleError(
        error, 
        "Failed to generate tags", 
        {
          actionLabel: "Try Again",
          action: () => handleTagging(text)
        }
      );
    } finally {
      setIsProcessing(false);
    }
  }, [handleGenerateTags, setLastSavedContentId]);

  return (
    <>
      <TagGenerator 
        isLoading={isLoading || isProcessing} 
        onGenerateTags={handleTagging} 
      />
      
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing content...
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
