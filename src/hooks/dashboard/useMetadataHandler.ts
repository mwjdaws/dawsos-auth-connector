
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export const useMetadataHandler = () => {
  const handleMetadataChange = useCallback(() => {
    console.log("Metadata refresh triggered");
    toast({
      title: "Metadata Updated",
      description: "The metadata has been refreshed.",
    });
  }, []);

  return handleMetadataChange;
};
