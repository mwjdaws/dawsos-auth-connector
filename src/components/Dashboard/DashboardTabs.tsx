
import { ReactNode, useTransition, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TagPanel } from "@/components";
import { MarkdownPanel, MetadataPanel } from "@/components";
import { TagCards } from "@/components/TagPanel/TagCards";
import TemplatesPanel from "@/components/TemplatesPanel";

interface DashboardTabsProps {
  activeTab: string;
  contentId: string;
  onTabChange: (value: string) => void;
  onTagGenerationComplete: (newContentId: string) => void;
  onMetadataChange: () => void;
}

export function DashboardTabs({
  activeTab,
  contentId,
  onTabChange,
  onTagGenerationComplete,
  onMetadataChange
}: DashboardTabsProps) {
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (value: string) => {
    startTransition(() => {
      onTabChange(value);
    });
  };

  const sampleMarkdown = `# Sample Markdown
  
This is an example of markdown content with metadata displayed above.

## Features
- Renders markdown content
- Displays metadata like tags and ontology terms
- Supports additional custom metadata fields
  
> This is a blockquote that demonstrates markdown rendering capabilities.

### Code Example
\`\`\`typescript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`;

  const sampleMetadata = {
    tags: ["markdown", "documentation", "example"],
    ontology_terms: ["content", "metadata", "rendering"],
    author: "Lovable AI",
    created_at: new Date().toLocaleDateString()
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="markdown-viewer">Markdown Viewer</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tag-generator" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tag Generator</h2>
            <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
              <TagPanel onTagsGenerated={onTagGenerationComplete} />
            </Suspense>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">Recent Tags</h2>
            <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
              <TagCards />
            </Suspense>
          </div>
        </TabsContent>
        
        <TabsContent value="markdown-viewer" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Markdown Viewer</h2>
            <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
              <MarkdownPanel 
                content={sampleMarkdown} 
                metadata={sampleMetadata} 
              />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Content Metadata</h2>
            <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
              <MetadataPanel 
                contentId={contentId}
                onMetadataChange={onMetadataChange}
              />
            </Suspense>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Knowledge Templates</h2>
            <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
              <TemplatesPanel />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
      {isPending && <LoadingIndicator />}
    </>
  );
}

function LoadingIndicator() {
  return (
    <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg">
      Loading...
    </div>
  );
}
