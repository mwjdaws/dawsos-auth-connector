
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import DebugPanel from "@/components/DebugPanel";
import { useAuth } from "@/hooks/useAuth";

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
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [navigate, user, authLoading]);

  const handleTagGenerationComplete = (newContentId: string) => {
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

  const handleSaveDraft = (id: string, title: string, content: string, templateId: string | null) => {
    console.log("Draft saved:", { id, title, templateId });
    toast({
      title: "Draft Saved",
      description: `"${title}" has been saved as a draft.`,
    });
  };

  const handlePublish = (id: string, title: string, content: string, templateId: string | null) => {
    console.log("Content published:", { id, title, templateId });
    toast({
      title: "Content Published",
      description: `"${title}" has been published successfully.`,
    });
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
    </div>
  );
};

export default DashboardPage;
