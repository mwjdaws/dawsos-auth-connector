
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingIndicator } from "./LoadingIndicator";
import { TagGeneratorTab, MetadataTab, MarkdownEditorTab } from "./TabContents";

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
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
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
      </Tabs>
      {isPending && <LoadingIndicator />}
    </>
  );
}
