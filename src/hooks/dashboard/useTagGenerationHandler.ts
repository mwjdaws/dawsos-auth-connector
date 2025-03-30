
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

type UseTagGenerationHandlerProps = {
  setContentId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

export function useTagGenerationHandler({
  setContentId,
  setActiveTab,
  activeTab
}: UseTagGenerationHandlerProps) {
  const handleTagGenerationComplete = useCallback((newContentId: string) => {
    if (!newContentId) {
      console.error("Tag generation complete called with invalid contentId");
      toast({
        title: "Error",
        description: "Failed to generate tags. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Tag generation complete, setting new contentId:", newContentId);
    setContentId(newContentId);
    
    if (activeTab !== "metadata") {
      setActiveTab("metadata");
    }
  }, [setContentId, setActiveTab, activeTab]);

  return handleTagGenerationComplete;
}
