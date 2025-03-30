
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errors";

type UsePublishHandlerProps = {
  user: any;
};

export const usePublishHandler = ({ user }: UsePublishHandlerProps) => {
  const handlePublish = useCallback(async (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string = '') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to publish content",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Publishing content:", { id, title, templateId });
    
    try {
      // Verify that the content was published correctly
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('published, published_at, user_id')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error verifying published status:", error);
        handleError(error, "Error verifying published status");
        return;
      }
      
      if (data) {
        console.log("Published content data:", data);
        
        if (!data.published) {
          console.warn("Content not marked as published in database");
          
          // Attempt to fix the published status if it wasn't set
          const { error: updateError } = await supabase
            .from('knowledge_sources')
            .update({
              published: true,
              published_at: new Date().toISOString(),
            })
            .eq('id', id);
            
          if (updateError) {
            console.error("Failed to update published status:", updateError);
            handleError(updateError, "Failed to update published status");
          } else {
            console.log("Fixed published status for content:", id);
          }
        }
        
        if (data.user_id !== user?.id) {
          console.warn("Content published with incorrect user ID:", data.user_id, "expected:", user?.id);
          
          // Try to fix the user_id
          const { error: updateError } = await supabase
            .from('knowledge_sources')
            .update({ user_id: user.id })
            .eq('id', id);
            
          if (updateError) {
            console.error("Failed to update user ID:", updateError);
            handleError(updateError, "Failed to update user ID for published content");
          } else {
            console.log("Fixed user ID for published content:", id);
          }
        }
      }
      
      toast({
        title: "Content Published",
        description: `"${title}" has been published successfully.`,
      });
    } catch (error) {
      console.error("Error checking published content:", error);
      handleError(
        error,
        "There was an error verifying the published status. The content may still be published.",
        { level: "warning" }
      );
    }
  }, [user]);

  return { handlePublish };
};
