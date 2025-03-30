
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errors";

type UseDraftHandlerProps = {
  user: any;
};

export const useDraftHandler = ({ user }: UseDraftHandlerProps) => {
  const handleSaveDraft = useCallback(async (id: string, title: string, content: string, templateId: string | null) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save drafts",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Draft saved:", { id, title, templateId });
    toast({
      title: "Draft Saved",
      description: `"${title}" has been saved as a draft.`,
    });
    
    // Verify that the draft was saved with the current user's ID
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('user_id, published')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error checking saved draft:", error);
        handleError(error, "Error verifying saved draft");
        return;
      }
      
      if (data) {
        console.log("Saved draft data:", data);
        if (data.user_id !== user?.id) {
          console.warn("Draft saved with incorrect user ID:", data.user_id, "expected:", user?.id);
          
          // Try to fix the user_id
          const { error: updateError } = await supabase
            .from('knowledge_sources')
            .update({ user_id: user.id })
            .eq('id', id);
            
          if (updateError) {
            console.error("Failed to update user ID:", updateError);
          } else {
            console.log("Fixed user ID for draft:", id);
          }
        }
      }
    } catch (error) {
      console.error("Error checking saved draft:", error);
    }
  }, [user]);

  return { handleSaveDraft };
};
