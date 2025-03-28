import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownPanel } from "@/components";
import { Suspense } from "react";

export function MarkdownViewerTab() {
  // Sample data - keeping the same as original
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
      <h2 className="text-xl font-semibold mb-4">Markdown Viewer</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <MarkdownPanel 
          content={sampleMarkdown} 
          metadata={sampleMetadata} 
        />
      </Suspense>
    </>
  );
}
