import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { DashboardTabs } from "./Tabs/DashboardTabs";
import { useTagGenerationHandler, useMetadataHandler, useDraftHandler, usePublishHandler } from "@/hooks/dashboard";
import { toast } from "@/hooks/use-toast";

interface ContentManagementProps {
  contentId: string;
  setContentId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

export function ContentManagement({
  contentId,
  setContentId,
  activeTab,
  setActiveTab,
  user
}: ContentManagementProps) {
  const { handleGenerateTags, contentId: generatedContentId } = useTagGenerationHandler();
  const { handleMetadataChange } = useMetadataHandler();
  const { handleSaveDraft } = useDraftHandler();
  const { handlePublish } = usePublishHandler();

  useEffect(() => {
    if (generatedContentId) {
      setContentId(generatedContentId);
    }
  }, [generatedContentId, setContentId]);

  return (
    <DashboardTabs
      activeTab={activeTab}
      contentId={contentId}
      onTabChange={setActiveTab}
      onTagGenerationComplete={handleGenerateTags}
      onMetadataChange={handleMetadataChange}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
}
