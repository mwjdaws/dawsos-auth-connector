
import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/error-handling";

interface ContentManagementProps {
  contentId: string;
  setContentId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export function ContentManagement({
  contentId,
  setContentId,
  activeTab,
  setActiveTab,
  user
}: ContentManagementProps) {
  
  const handleTagGenerationComplete = (newContentId: string) => {
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
  };

  const handleMetadataChange = () => {
    console.log("Metadata refresh triggered, contentId:", contentId);
    toast({
      title: "Metadata Updated",
      description: "The metadata has been refreshed.",
    });
  };

  const handleSaveDraft = async (id: string, title: string, content: string, templateId: string | null) => {
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
  };

  const handlePublish = async (id: string, title: string, content: string, templateId: string | null) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to publish content",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Content published:", { id, title, templateId });
    
    // Verify that the content was published correctly
    try {
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
        { 
          level: "warning"
        }
      );
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 border border-amber-300 bg-amber-50 rounded-md">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">Tab Content Error</h2>
          <p className="mb-4 text-amber-700">There was an error loading this tab's content. Other tabs may still work.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab("tag-generator")}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md"
            >
              Try Tag Generator
            </button>
            <button 
              onClick={() => setActiveTab("metadata")}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md"
            >
              Try Metadata
            </button>
            <button 
              onClick={() => setActiveTab("editor")}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md"
            >
              Try Editor
            </button>
          </div>
        </div>
      }
    >
      <DashboardTabs 
        activeTab={activeTab}
        contentId={contentId}
        onTabChange={setActiveTab}
        onTagGenerationComplete={handleTagGenerationComplete}
        onMetadataChange={handleMetadataChange}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </ErrorBoundary>
  );
}
