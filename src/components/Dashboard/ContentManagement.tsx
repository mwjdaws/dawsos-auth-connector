
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardTabs } from "@/components/Dashboard/Tabs";
import { 
  useTagGenerationHandler, 
  useMetadataHandler, 
  useDraftHandler, 
  usePublishHandler 
} from "@/hooks/dashboard";

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
  // Use our custom hooks for handler functions
  const handleTagGenerationComplete = useTagGenerationHandler({
    setContentId,
    setActiveTab,
    activeTab
  });
  
  const handleMetadataChange = useMetadataHandler();
  
  const handleSaveDraft = useDraftHandler({ user });
  
  const handlePublish = usePublishHandler({ user });

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
