
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "@/utils/supabase-functions";

type SaveTagsResult = string | false;

interface SaveTagsOptions {
  contentId?: string;
  skipGenerateFunction?: boolean;
}

export function useSaveTags() {
  const saveTags = async (
    text: string, 
    tags: string[], 
    options: SaveTagsOptions = {}
  ): Promise<SaveTagsResult> => {
    const { contentId: initialContentId, skipGenerateFunction = false } = options;

    if (tags.length === 0) {
      toast({
        title: "Error",
        description: "No tags to save",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Generate a valid content ID if not already present
      const validContentId = initialContentId || `content-${Date.now()}`;
      
      console.log(`Attempting to save tags with content_id: ${validContentId}`);
      
      // Use the edge function if text is provided and not explicitly skipped
      if (text && text.trim() && !skipGenerateFunction) {
        try {
          console.log("Attempting to save tags via edge function");
          const savedTags = await generateTags(text, true, validContentId);
          
          if (!savedTags.includes("error") && !savedTags.includes("fallback")) {
            toast({
              title: "Success",
              description: `${tags.length} tags saved successfully via edge function`,
            });
            return validContentId;
          }
          
          console.log("Edge function approach returned error flags, falling back");
        } catch (edgeFunctionError) {
          console.error("Edge function error:", edgeFunctionError);
          console.log("Edge function approach failed, falling back to direct DB insertion");
        }
      }
      
      // If the edge function approach failed or we don't have text, fallback to direct DB insertion
      const tagsToInsert = tags.map(tag => ({
        name: tag,
        content_id: validContentId
      }));

      console.log("Directly inserting tags:", tagsToInsert);
      
      const { error, data } = await supabase
        .from("tags")
        .insert(tagsToInsert)
        .select();

      if (error) {
        throw error;
      }
      
      console.log("Tags inserted successfully:", data);
      
      toast({
        title: "Success",
        description: `${tags.length} tags saved successfully via direct insertion`,
      });
      
      return validContentId;
    } catch (error: any) {
      console.error("Error saving tags:", error);
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to save tags. Please try again.";
      
      if (error.code === "23505") {
        errorMessage = "Some tags already exist for this content.";
      } else if (error.code === "42P01") {
        errorMessage = "Database configuration issue. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return { saveTags };
}
