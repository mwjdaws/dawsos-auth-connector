import { useState, useEffect, useTransition, Suspense, lazy } from "react";
import { TagPanel } from "@/components/TagPanel/index";
import { MarkdownPanel, MetadataPanel } from "@/components";
import { TagSummary } from "@/components/TagSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { TagCards } from "@/components/TagPanel/TagCards";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tag-generator");
  const [contentId, setContentId] = useState(`temp-${Date.now()}`);
  const [isPending, startTransition] = useTransition();
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  
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

  const handleMetadataChange = () => {
    console.log("Metadata refresh triggered, contentId:", contentId);
    toast({
      title: "Metadata Updated",
      description: "The metadata has been refreshed.",
    });
  };

  useEffect(() => {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setActiveTab(value);
    });
  };

  const handleTagGenerationComplete = (newContentId: string) => {
    console.log("Tag generation complete, setting new contentId:", newContentId);
    setContentId(newContentId);
    
    if (activeTab !== "metadata") {
      startTransition(() => {
        setActiveTab("metadata");
      });
    }
  };

  const refreshTagStats = async () => {
    try {
      setIsRefreshingStats(true);
      const { error } = await supabase.rpc('refresh_tag_summary_view');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Statistics Updated",
        description: "Tag usage statistics have been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing tag statistics:", error);
      toast({
        title: "Error",
        description: "Failed to refresh tag statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingStats(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
            <TagSummary />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Tag Statistics</CardTitle>
                <Button 
                  onClick={refreshTagStats} 
                  size="sm" 
                  variant="outline"
                  disabled={isRefreshingStats}
                  className="h-8"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <p className="text-muted-foreground text-sm mb-4">
                The tag usage statistics are automatically updated on a schedule.
                The materialized view is refreshed using a Supabase Edge Function.
              </p>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Current Content ID: <span className="font-mono">{contentId}</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="markdown-viewer">Markdown Viewer</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tag-generator" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tag Generator</h2>
            <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
              <TagPanel onTagsGenerated={handleTagGenerationComplete} />
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
                onMetadataChange={handleMetadataChange}
              />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
      {isPending && <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg">Loading...</div>}
    </div>
  );
};

export default DashboardPage;
