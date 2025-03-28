
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import DebugPanel from "@/components/DebugPanel";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tag-generator");
  const [contentId, setContentId] = useState(`temp-${Date.now()}`);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, but continuing as guest for development");
        // Uncomment the line below to redirect to login in production
        // navigate("/auth");
      }
    };
    
    checkAuth();
    
    // Set up realtime subscription
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
  }, [navigate]);

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {showDebug ? "Hide Debug Panel" : "Show Debug Panel"}
        </button>
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
      />
    </div>
  );
};

export default DashboardPage;
