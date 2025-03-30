import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingIndicator } from "./LoadingIndicator";

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
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
        <TabsTrigger value="metadata">Metadata</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
      </TabsList>

      <TabsContent value="tag-generator">
        <div className="space-y-4">
          {/* Tag Generator content will be implemented here */}
          <p>Tag Generator content for content ID: {contentId}</p>
        </div>
      </TabsContent>

      <TabsContent value="metadata">
        <div className="space-y-4">
          {/* Metadata content will be implemented here */}
          <p>Metadata content for content ID: {contentId}</p>
        </div>
      </TabsContent>

      <TabsContent value="editor">
        <div className="space-y-4">
          {/* Editor content will be implemented here */}
          <p>Editor content for content ID: {contentId}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
