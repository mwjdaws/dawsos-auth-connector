
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardAuth } from "@/components/Dashboard/DashboardAuth";
import { DashboardLoading } from "@/components/Dashboard/DashboardLoading";
import { ContentManagement } from "@/components/Dashboard/ContentManagement";
import { DashboardContainer } from "@/components/Dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { useDashboardEffects } from "@/hooks/dashboard/useDashboardEffects";
import { useUserPreferences } from "@/utils/user-onboarding";

/**
 * Dashboard page component that serves as the main interface for content management
 * and tag generation. Manages user authentication, content state, and UI preferences.
 */
const DashboardPage = () => {
  // State management for dashboard
  const [activeTab, setActiveTab] = useState("tag-generator");
  const [contentId, setContentId] = useState(`temp-${Date.now()}`);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Authentication and user preferences
  const { user, isLoading: authLoading } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences(user?.id);
  
  // Set up dashboard effects (auth check, realtime subscriptions, etc.)
  useDashboardEffects({ contentId, user });
  
  // Set initial active tab from user preferences
  useState(() => {
    if (preferences && preferences.defaultTab) {
      setActiveTab(preferences.defaultTab);
    }
  });
  
  // Handle tab change and save preference
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Save as preference if user is logged in
    if (user) {
      updatePreferences({ defaultTab: tab });
    }
  };

  // Show loading state if auth is loading
  if (authLoading) {
    return <DashboardLoading />;
  }

  // If no user after loading completes, this serves as a fallback to the useEffect redirect
  if (!user) {
    return <DashboardAuth />;
  }

  return (
    <DashboardContainer user={user} showDebug={showDebug} setShowDebug={setShowDebug}>
      <DashboardHeader 
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
    </DashboardContainer>
  );
};

export default DashboardPage;
