import { Skeleton } from "@/components/ui/skeleton";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import { Suspense } from "react";

interface MarkdownEditorTabProps {
  contentId: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

export function MarkdownEditorTab({ 
  contentId, 
  onSaveDraft, 
  onPublish 
}: MarkdownEditorTabProps) {
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

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Markdown Editor</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <MarkdownEditor 
          initialTitle="Draft Document"
          initialContent={sampleMarkdown}
          initialTemplateId={null}
          sourceId={contentId !== `temp-${Date.now()}` ? contentId : undefined}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
        />
      </Suspense>
    </>
  );
}
