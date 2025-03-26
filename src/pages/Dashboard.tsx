
import { useState } from "react";
import { TagPanel, MarkdownPanel } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
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
