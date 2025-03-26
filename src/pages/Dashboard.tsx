
import { useState, useEffect } from "react";
import { TagPanel, MarkdownPanel } from "@/components";
import { TagSummary } from "@/components/TagSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("tag-generator");
  
  // Sample markdown with metadata for demo purposes
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

  // Set up Supabase Realtime listener for tag updates
  useEffect(() => {
    // Create a Supabase Realtime channel
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
      .subscribe();

    // Clean up the subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TagSummary />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4">Tag Statistics</h2>
            <p className="text-muted-foreground">
              The tag usage statistics are automatically updated on a schedule.
              The materialized view is refreshed using a Supabase Edge Function.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="tag-generator" onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="tag-generator">Tag Generator</TabsTrigger>
          <TabsTrigger value="markdown-viewer">Markdown Viewer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tag-generator" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tag Generator</h2>
            <TagPanel />
          </div>
        </TabsContent>
        
        <TabsContent value="markdown-viewer" className="mt-4">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Markdown Viewer</h2>
            <MarkdownPanel 
              content={sampleMarkdown} 
              metadata={sampleMetadata} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
