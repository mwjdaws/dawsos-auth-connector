
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import DebugPanel from "@/components/DebugPanel";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DashboardAuth } from "@/components/Dashboard/DashboardAuth";
import { DashboardLoading } from "@/components/Dashboard/DashboardLoading";
import { ContentManagement } from "@/components/Dashboard/ContentManagement";
import { DashboardUserInfo } from "@/components/Dashboard/DashboardUserInfo";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/utils/access-control";
import { useUserPreferences } from "@/utils/user-onboarding";
import { invokeEdgeFunctionReliably } from "@/utils/edge-function-reliability";
import { handleError } from "@/utils/errors";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tag-generator");
  const [contentId, setContentId] = useState(`temp-${Date.now()}`);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();
  const { preferences, updatePreferences } = useUserPreferences(user?.id);
  
  // Set initial active tab from user preferences
  useEffect(() => {
    if (preferences && preferences.defaultTab) {
      setActiveTab(preferences.defaultTab);
    }
  }, [preferences]);
  
  // Authentication check
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

  // Check for pending agent tasks
  useEffect(() => {
    if (user) {
      const checkPendingTasks = async () => {
        try {
          const { data, error } = await supabase
            .from('agent_tasks')
            .select('id, agent_name, action, status')
            .eq('status', 'completed')
            // Commenting out notified check as it doesn't exist in the schema
            // .is('notified', false)
            .limit(5);
            
          if (error) throw error;
          
          // Notify user of completed tasks
          if (data && data.length > 0) {
            // Update task status instead of using notified flag
            for (const task of data) {
              await supabase
                .from('agent_tasks')
                .update({ status: 'notified' })
                .eq('id', task.id);
            }
              
            // Show a notification
            toast({
              title: `${data.length} Background Task${data.length > 1 ? 's' : ''} Completed`,
              description: `Agent tasks have finished processing.`,
            });
          }
        } catch (error) {
          console.error("Failed to check pending tasks:", error);
        }
      };
      
      // Check on load and set interval
      checkPendingTasks();
      const interval = setInterval(checkPendingTasks, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Save as preference if user is logged in
    if (user) {
      updatePreferences({ defaultTab: tab });
    }
  };

  // Check for edge function health
  useEffect(() => {
    const checkEdgeFunctionHealth = async () => {
      if (user) {
        try {
          await invokeEdgeFunctionReliably('get-related-tags', { knowledgeSourceId: contentId }, {
            timeoutMs: 5000,
            showErrorToast: false
          });
        } catch (error) {
          console.warn("Edge function health check failed:", error);
          // No need to show toast for this silent check
        }
      }
    };
    
    checkEdgeFunctionHealth();
  }, [contentId, user]);

  // Show loading state if auth is loading
  if (authLoading) {
    return <DashboardLoading />;
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
        <DashboardUserInfo 
          user={user} 
          showDebug={showDebug} 
          setShowDebug={setShowDebug} 
        />
      </div>
      
      {showDebug && (
        <div className="mb-8">
          <DebugPanel />
        </div>
      )}
      
      <ErrorBoundary fallback={
        <div className="p-6 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h2>
          <p className="mb-4 text-red-700">There was an error loading the dashboard components.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
          >
            Reload Page
          </button>
        </div>
      }>
        <DashboardHeader 
          contentId={contentId}
          isRefreshingStats={isRefreshingStats}
          setIsRefreshingStats={setIsRefreshingStats}
        />
        
        <ContentManagement
          contentId={contentId}
          setContentId={setContentId}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          user={user}
        />
      </ErrorBoundary>
    </div>
  );
};

export default DashboardPage;
