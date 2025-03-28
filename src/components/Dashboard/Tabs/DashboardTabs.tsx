
import { ReactNode, useTransition, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingIndicator } from "./LoadingIndicator";
import { TagGeneratorTab } from "./TabContents/TagGeneratorTab";
import { MarkdownViewerTab } from "./TabContents/MarkdownViewerTab";
import { MarkdownEditorTab } from "./TabContents/MarkdownEditorTab";
import { MetadataTab } from "./TabContents/MetadataTab";
import { TemplatesTab } from "./TabContents/TemplatesTab";
import { useDashboardTabs } from "@/hooks/dashboard/useDashboardTabs";

interface DashboardTabsProps {
  activeTab: string;
  contentId: string;
  onTabChange: (value: string) => void;
  onTagGenerationComplete: (newContentId: string) => void;
  onMetadataChange: () => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export function DashboardTabs({
  activeTab,
  contentId,
  onTabChange,
  onTagGenerationComplete,
  onMetadataChange,
  onSaveDraft,
  onPublish
}: DashboardTabsProps) {
  const [isPending, startTransition] = useTransition();
  const { handleTabChange } = useDashboardTabs({ onTabChange, startTransition });

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="markdown-viewer">Markdown Viewer</TabsTrigger>
          <TabsTrigger value="markdown-editor">Markdown Editor</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabContent value="tag-generator" activeTab={activeTab}>
          <TagGeneratorTab contentId={contentId} onTagsSaved={onTagGenerationComplete} />
        </TabContent>
        
        <TabContent value="markdown-viewer" activeTab={activeTab}>
          <MarkdownViewerTab />
        </TabContent>

        <TabContent value="markdown-editor" activeTab={activeTab}>
          <MarkdownEditorTab 
            contentId={contentId} 
            onSaveDraft={onSaveDraft} 
            onPublish={onPublish} 
          />
        </TabContent>

        <TabContent value="metadata" activeTab={activeTab}>
          <MetadataTab contentId={contentId} onMetadataChange={onMetadataChange} />
        </TabContent>
        
        <TabContent value="templates" activeTab={activeTab}>
          <TemplatesTab />
        </TabContent>
      </Tabs>
      {isPending && <LoadingIndicator />}
    </>
  );
}

// Helper component for Tab Content with consistent styling
interface TabContentProps {
  value: string;
  activeTab: string;
  children: ReactNode;
}

function TabContent({ value, activeTab, children }: TabContentProps) {
  return (
    <TabsContent value={value} className="mt-4">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </TabsContent>
  );
}
