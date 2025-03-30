
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingIndicator } from "./LoadingIndicator";
import { 
  TagGeneratorTab, 
  MetadataTab, 
  MarkdownEditorTab,
  MarkdownViewerTab,
  TemplatesTab,
  RelationshipGraphTab
} from "./TabContents";

interface DashboardTabsProps {
  activeTab: string;
  contentId: string;
  onTabChange: (value: string) => void;
  onTagGenerationComplete?: (contentId: string) => void;
  onMetadataChange?: () => void;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
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
  const [isPending, startTransition] = React.useTransition();

  const handleTabChange = (value: string) => {
    startTransition(() => {
      onTabChange(value);
    });
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="markdown-viewer">Markdown Viewer</TabsTrigger>
          <TabsTrigger value="editor">Markdown Editor</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="relationship-graph">Knowledge Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="tag-generator">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            {onTagGenerationComplete && (
              <TagGeneratorTab 
                contentId={contentId} 
                onTagsSaved={onTagGenerationComplete} 
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="markdown-viewer">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <MarkdownViewerTab />
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            {onSaveDraft && onPublish && (
              <MarkdownEditorTab
                contentId={contentId}
                onSaveDraft={onSaveDraft}
                onPublish={onPublish}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="metadata">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            {onMetadataChange && (
              <MetadataTab
                contentId={contentId}
                onMetadataChange={onMetadataChange}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <TemplatesTab />
          </div>
        </TabsContent>

        <TabsContent value="relationship-graph">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <RelationshipGraphTab contentId={contentId} />
          </div>
        </TabsContent>
      </Tabs>
      {isPending && <LoadingIndicator />}
    </>
  );
}
