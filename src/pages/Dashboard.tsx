
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DebugPanel from "@/components/DebugPanel";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { handleError } from "@/utils/error-handling";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tag-generator");
  const [contentId, setContentId] = useState(`temp-${Date.now()}`);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      if (!authLoading && !user) {
        console.log("No authenticated user, redirecting to auth page");
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
    
    // Set up realtime subscription for authenticated users
    if (user) {
      const channel = supabase
        .channel('public:tags')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'tags' },
          (payload) => {
            console.log('New tag added:', payload.new);
            toast({
              title: "New Tag Added",
              description: `A new tag "${payload.new.name}" was added to the system.`,
            });
          }
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'tags' },
          (payload) => {
            console.log('Tag deleted:', payload.old);
            toast({
              title: "Tag Removed",
              description: `A tag was removed from the system.`,
            });
          }
        )
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.error('Failed to subscribe to channel:', status);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [navigate, user, authLoading]);

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

  // Show loading state or redirect if no auth
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Dashboard...</h1>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If no user after loading completes, this serves as a fallback to the useEffect redirect
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {user ? (
              <span>Logged in as: {user.email}</span>
            ) : (
              <span>Not authenticated (RLS policies may limit data access)</span>
            )}
          </div>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {showDebug ? "Hide Debug Panel" : "Show Debug Panel"}
          </button>
        </div>
      </div>
      
      {showDebug && (
        <div className="mb-8">
          <DebugPanel />
        </div>
      )}
      
      <ErrorBoundary>
        <DashboardHeader 
          contentId={contentId}
          isRefreshingStats={isRefreshingStats}
          setIsRefreshingStats={setIsRefreshingStats}
        />
        
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
    </div>
  );
};

export default DashboardPage;
