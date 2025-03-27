
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateTags } from "./supabase-functions";

export async function saveTags(text: string, tags: string[], contentId: string) {
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
    const validContentId = contentId || `content-${Date.now()}`;
    
    console.log(`Attempting to save tags with content_id: ${validContentId}`);
    
    // Call generateTags with save=true to use the edge function
    const savedTags = await generateTags(text, true, validContentId);
    
    if (savedTags.includes("error") || savedTags.includes("fallback")) {
      // If the edge function approach failed, fallback to direct DB insertion
      const tagsToInsert = tags.map(tag => ({
        name: tag,
        content_id: validContentId
      }));

      const { error } = await supabase
        .from("tags")
        .insert(tagsToInsert);

      if (error) {
        throw error;
      }
    }
    
    toast({
      title: "Success",
      description: `${tags.length} tags saved successfully`,
    });
    
    return true;
  } catch (error: any) {
    console.error("Error saving tags:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to save tags. Please try again.",
      variant: "destructive",
    });
    return false;
  }
}
