
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { DashboardTabs } from "./Tabs/DashboardTabs";
import { useTagGenerationHandler } from "@/hooks/dashboard/useTagGenerationHandler";
import { useMetadataHandler } from "@/hooks/dashboard/useMetadataHandler";
import { useDraftHandler } from "@/hooks/dashboard/useDraftHandler";
import { usePublishHandler } from "@/hooks/dashboard/usePublishHandler";
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
  const tagGenerationHandler = useTagGenerationHandler({
    setContentId,
    setActiveTab,
    activeTab
  });
  
  const metadataHandler = useMetadataHandler();
  const { handleSaveDraft } = useDraftHandler({ user });
  const { handlePublish } = usePublishHandler({ user });

  return (
    <DashboardTabs
      activeTab={activeTab}
      contentId={contentId}
      onTabChange={setActiveTab}
      onTagGenerationComplete={tagGenerationHandler}
      onMetadataChange={metadataHandler}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
}
