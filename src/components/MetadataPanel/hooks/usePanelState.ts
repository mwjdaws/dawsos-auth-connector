
import { useState, useEffect, useTransition, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { isValidContentId } from "@/utils/content-validation";
import { handleError } from "@/utils/errors";

export interface UsePanelStateProps {
  contentId: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
}

export const usePanelState = ({ 
  contentId, 
  onMetadataChange,
  isCollapsible = false,
  initialCollapsed = false 
}: UsePanelStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const isMounted = useRef(true);

  // Reset the component state when unmounting
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateContentId = (): boolean => {
    if (!isValidContentId(contentId)) {
      console.log("Invalid contentId for fetching metadata:", contentId);
      setIsLoading(false);
      setError("Invalid content ID");
      return false;
    }
    return true;
  };

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const finishLoading = (success: boolean = true, errorMessage?: string) => {
    if (isMounted.current) {
      setIsLoading(false);
      
      if (!success && errorMessage) {
        setError(errorMessage);
        
        // Use standardized error handling
        handleError(
          new Error(errorMessage),
          "Failed to load metadata",
          {
            level: "error",
            context: { contentId }
          }
        );
      }
      
      if (success && onMetadataChange) {
        onMetadataChange();
      }
    }
  };

  const toggleCollapsed = () => {
    setIsCollapsed(prev => !prev);
  };

  return {
    isLoading,
    error,
    isPending,
    startTransition,
    isCollapsed,
    setIsCollapsed,
    toggleCollapsed,
    isMounted,
    validateContentId,
    startLoading,
    finishLoading
  };
};
